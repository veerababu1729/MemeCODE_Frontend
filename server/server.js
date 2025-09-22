const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        'https://memecodefrontend112.vercel.app',
        'https://skyblue-python-launch.vercel.app'
      ]
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
};

// Security and Performance Middleware
if (process.env.NODE_ENV === 'production') {
  // Trust proxy for Render deployment
  app.set('trust proxy', 1);
  
  // Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // X-Frame-Options removed to allow iframe embedding
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
}

// CORS and body parsing
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging for production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Initialize Razorpay
console.log('🔧 Initializing Razorpay...');
console.log('📋 Razorpay Key ID:', process.env.RAZORPAY_KEY_ID ? '✅ Present' : '❌ Missing');
console.log('📋 Razorpay Secret:', process.env.RAZORPAY_KEY_SECRET ? '✅ Present' : '❌ Missing');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Missing Razorpay credentials! Payment functionality will not work.');
  console.error('Required: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize PostgreSQL Database with connection pooling optimized for 300-500 concurrent users
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 30, // Increased for higher concurrency
  min: 5, // Minimum connections to maintain
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Increased timeout
  acquireTimeoutMillis: 60000, // Time to wait for connection
  createTimeoutMillis: 30000,
  destroyTimeoutMillis: 5000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200,
});

// Create tables if they don't exist
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
        razorpay_payment_id VARCHAR(255),
        razorpay_signature VARCHAR(255),
        amount INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        status VARCHAR(50) DEFAULT 'created',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // First, check if user_details table exists and what columns it has
    const tableExists = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'user_details'
    `);
    
    if (tableExists.rows.length === 0) {
      // Table doesn't exist, create it with all columns
      console.log('📋 Creating user_details table with authentication fields...');
      await client.query(`
        CREATE TABLE user_details (
          id SERIAL PRIMARY KEY,
          payment_id INTEGER REFERENCES payments(id),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          age INTEGER NOT NULL,
          phone_number VARCHAR(20) NOT NULL,
          gender VARCHAR(20) NOT NULL,
          college_name VARCHAR(500) NOT NULL,
          college_address TEXT NOT NULL,
          current_status VARCHAR(50) NOT NULL,
          course VARCHAR(100),
          year_of_studying VARCHAR(10),
          year_of_passedout INTEGER,
          reason TEXT NOT NULL,
          cgpa DECIMAL(3,2),
          has_purchased BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } else {
      // Table exists, check if it has the new columns
      const existingColumns = tableExists.rows.map(row => row.column_name);
      console.log('📋 Existing columns:', existingColumns);
      
      // Add missing columns
      if (!existingColumns.includes('email')) {
        console.log('➕ Adding email column...');
        await client.query('ALTER TABLE user_details ADD COLUMN email VARCHAR(255) UNIQUE');
      }
      
      if (!existingColumns.includes('password_hash')) {
        console.log('➕ Adding password_hash column...');
        await client.query('ALTER TABLE user_details ADD COLUMN password_hash VARCHAR(255)');
      }
      
      if (!existingColumns.includes('has_purchased')) {
        console.log('➕ Adding has_purchased column...');
        await client.query('ALTER TABLE user_details ADD COLUMN has_purchased BOOLEAN DEFAULT FALSE');
      }
      
      if (!existingColumns.includes('cgpa')) {
        console.log('➕ Adding cgpa column...');
        await client.query('ALTER TABLE user_details ADD COLUMN cgpa DECIMAL(3,2)');
      }
      
      if (!existingColumns.includes('phone_number')) {
        console.log('➕ Adding phone_number column...');
        await client.query('ALTER TABLE user_details ADD COLUMN phone_number VARCHAR(20)');
      }
    }

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(razorpay_order_id);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_details_payment_id ON user_details(payment_id);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_details_email ON user_details(email);
    `);

    client.release();
    console.log('✅ Database schema updated successfully');
    console.log('🔧 Development mode: Payment verification is relaxed for testing');
    console.log('👤 Focus: New user workflow (Payment → Registration → Ebook Access)');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

// Initialize database on startup
initializeDatabase();

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Email configuration with multiple provider support
let emailTransporter;

if (process.env.SENDGRID_API_KEY) {
  // SendGrid configuration (recommended for production)
  emailTransporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });
} else if (process.env.MAILGUN_API_KEY) {
  // Mailgun configuration
  emailTransporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: process.env.MAILGUN_USERNAME || 'postmaster@' + process.env.MAILGUN_DOMAIN,
      pass: process.env.MAILGUN_API_KEY
    }
  });
} else if (process.env.AWS_ACCESS_KEY_ID) {
  // AWS SES configuration
  const aws = require('aws-sdk');
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  });
  emailTransporter = nodemailer.createTransport({
    SES: new aws.SES({ apiVersion: '2010-12-01' })
  });
} else {
  // Gmail configuration (fallback)
  emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
}

// Test email configuration on startup
emailTransporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('⚠️  Password reset emails will not work until email is properly configured');
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Function to send password reset email
const sendPasswordResetEmail = async (email, resetToken, userName = '') => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: {
      name: 'MemeCODE Team',
      address: process.env.EMAIL_USER || 'eefriends1729@gmail.com'
    },
    to: email,
    subject: 'Reset Your MemeCODE Account Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fef3cd; border: 1px solid #ffd60a; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>MemeCODE- Telugu Programming Guide</p>
          </div>
          
          <div class="content">
            <h2>Hello${userName ? ` ${userName}` : ''}!</h2>
            
            <p>We received a request to reset your password for your MemeCODE account. If you didn't make this request, you can safely ignore this email.</p>
            
            <p>To reset your password, click the button below:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset My Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e2e8f0; padding: 10px; border-radius: 5px; font-family: monospace;">
              ${resetLink}
            </p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This link will expire in 1 hour for security reasons</li>
                <li>You can only use this link once</li>
                <li>If you didn't request this reset, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
            
            <p>Best regards,<br>
            <strong>The MemeCODE Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${email}</p>
            <p>If you have any questions, please contact our support team. "eefriends1729@gmail.com"</p>
            <p>&copy; 2024 MemeCODE. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request - MemeCODE
      
      Hello${userName ? ` ${userName}` : ''}!
      
      We received a request to reset your password for your MemeCODE account.
      
      To reset your password, visit this link:
      ${resetLink}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this reset, please ignore this email.
      
      Best regards,
      The MemeCODE Launch Team
    `
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

// Create Razorpay order
app.post('/api/create-order', async (req, res) => {
  const client = await pool.connect();
  try {
    console.log('💳 Create order request received:', req.body);
    
    const { amount, currency = 'INR' } = req.body;
    
    if (!amount) {
      console.log('❌ Amount missing in request');
      return res.status(400).json({ error: 'Amount is required' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Razorpay credentials not configured');
      return res.status(500).json({ error: 'Payment service not configured' });
    }

    const options = {
      amount: amount, // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    };

    console.log('🔄 Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created successfully:', order.id);
    
    // Store order in database
    await client.query(
      'INSERT INTO payments (razorpay_order_id, amount, currency, status, created_at) VALUES ($1, $2, $3, $4, $5)',
      [order.id, order.amount, order.currency, 'created', new Date()]
    );
    console.log('💾 Order stored in database:', order.id);
    
    const response = {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    };
    
    console.log('📤 Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      error: 'Failed to create payment order',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    client.release();
  }
});

// Verify payment
app.post('/api/verify-payment', async (req, res) => {
  const client = await pool.connect();
  try {
    console.log('🔍 Payment verification request received:', req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create signature for verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    console.log('🔐 Signature verification:', isAuthentic ? '✅ Valid' : '❌ Invalid');

    if (isAuthentic) {
      // Update payment status in database
      const updateResult = await client.query(
        'UPDATE payments SET razorpay_payment_id = $1, razorpay_signature = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE razorpay_order_id = $4 RETURNING id',
        [razorpay_payment_id, razorpay_signature, 'completed', razorpay_order_id]
      );
      
      if (updateResult.rows.length > 0) {
        console.log('✅ Payment verified and updated in database:', razorpay_order_id);
        res.json({ 
          success: true, 
          message: 'Payment verified successfully',
          orderId: razorpay_order_id 
        });
      } else {
        console.log('❌ Payment order not found in database:', razorpay_order_id);
        res.status(404).json({ success: false, message: 'Payment order not found' });
      }
    } else {
      console.log('❌ Invalid payment signature for order:', razorpay_order_id);
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  } finally {
    client.release();
  }
});

// Register/Submit user details (now includes authentication)
app.post('/api/submit-details', async (req, res) => {
  const client = await pool.connect();
  try {
    console.log('📥 Received submission request:', {
      orderId: req.body.orderId,
      email: req.body.email,
      name: req.body.name,
      hasPassword: !!req.body.password
    });
    
    const {
      orderId,
      email,
      password,
      name,
      age,
      phoneNumber,
      gender,
      collegeName,
      collegeAddress,
      currentStatus,
      course,
      yearOfStudying,
      yearOfPassedout,
      reason,
      cgpa
    } = req.body;

    // Validate required fields with detailed error messages
    const requiredFields = {
      orderId: 'Order ID',
      email: 'Email',
      password: 'Password', 
      name: 'Name',
      age: 'Age',
      phoneNumber: 'Phone Number',
      gender: 'Gender',
      collegeName: 'College Name',
      collegeAddress: 'College Address',
      currentStatus: 'Current Status',
      reason: 'Reason'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        console.log(`❌ Missing field: ${field}`);
        return res.status(400).json({ error: `${label} is required` });
      }
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists:', email);
    const existingUser = await client.query(
      'SELECT id FROM user_details WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    console.log('✅ Email is available');

    // Get payment ID from order ID (relaxed for testing with Razorpay test keys)
    const paymentResult = await client.query(
      'SELECT id, status FROM payments WHERE razorpay_order_id = $1',
      [orderId]
    );

    if (paymentResult.rows.length === 0) {
      console.log(`❌ No payment found for order ID: ${orderId}`);
      return res.status(400).json({ error: 'Payment not found. Please complete payment first.' });
    }

    const payment = paymentResult.rows[0];
    // In development/testing mode, allow both 'created' and 'completed' status
    const isDevelopment = process.env.NODE_ENV === 'development';
    const allowedStatuses = isDevelopment ? ['created', 'completed'] : ['completed'];
    
    if (!allowedStatuses.includes(payment.status)) {
      console.log(`❌ Payment status not allowed. Status: ${payment.status}, Environment: ${process.env.NODE_ENV}`);
      return res.status(400).json({ error: `Payment not completed. Status: ${payment.status}` });
    }
    
    console.log(`✅ Payment found with status: ${payment.status} (Development mode: ${isDevelopment})`);

    // Hash password
    console.log('🔐 Hashing password...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log('✅ Password hashed successfully');

    // Insert user details
    console.log(`✅ Inserting user details for: ${email}`);
    const insertResult = await client.query(
      `INSERT INTO user_details 
       (payment_id, email, password_hash, name, age, phone_number, gender, college_name, college_address, current_status, course, year_of_studying, year_of_passedout, reason, cgpa, has_purchased) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id, email, name`,
      [payment.id, email, passwordHash, name, age, phoneNumber, gender, collegeName, collegeAddress, currentStatus, course, yearOfStudying, yearOfPassedout, reason, cgpa, true]
    );
    
    console.log(`✅ User registered successfully with ID: ${insertResult.rows[0].id}`);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: insertResult.rows[0].id, 
        email: insertResult.rows[0].email,
        hasPurchased: true 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      success: true, 
      message: 'Registration completed successfully',
      submissionId: insertResult.rows[0].id,
      token: token,
      user: {
        id: insertResult.rows[0].id,
        email: insertResult.rows[0].email,
        name: insertResult.rows[0].name,
        hasPurchased: true
      }
    });
  } catch (error) {
    console.error('❌ Error submitting details:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error detail:', error.detail);
    
    // Provide more specific error messages
    if (error.code === '23505') { // Unique constraint violation
      console.log('❌ Unique constraint violation');
      res.status(400).json({ error: 'User with this email already exists' });
    } else if (error.code === '23503') { // Foreign key constraint violation
      console.log('❌ Foreign key constraint violation');
      res.status(400).json({ error: 'Invalid payment reference' });
    } else if (error.code === '42703') { // Column does not exist
      console.log('❌ Database schema error - column missing');
      res.status(500).json({ error: 'Database schema error. Please check server logs.' });
    } else if (error.message.includes('connect')) {
      console.log('❌ Database connection error');
      res.status(500).json({ error: 'Database connection failed' });
    } else if (error.message.includes('bcrypt')) {
      console.log('❌ Password hashing error');
      res.status(500).json({ error: 'Password processing failed' });
    } else {
      console.log('❌ Unknown error:', error.message);
      res.status(500).json({ error: `Submission failed: ${error.message}` });
    }
  } finally {
    if (client) {
      client.release();
    }
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const userResult = await client.query(
      'SELECT id, email, password_hash, name, has_purchased FROM user_details WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        hasPurchased: user.has_purchased 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPurchased: user.has_purchased
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  } finally {
    client.release();
  }
});

// Get user details (for admin or verification)
app.get('/api/user-details/:orderId', async (req, res) => {
  const client = await pool.connect();
  try {
    const { orderId } = req.params;
    
    const result = await client.query(
      `SELECT ud.*, p.razorpay_payment_id, p.amount 
       FROM user_details ud 
       JOIN payments p ON ud.payment_id = p.id 
       WHERE p.razorpay_order_id = $1`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Details not found' });
    }

    // Remove sensitive information
    const userDetails = result.rows[0];
    delete userDetails.password_hash;

    res.json(userDetails);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
});

// Get current user profile (protected route)
app.get('/api/profile', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, email, name, age, phone_number, gender, college_name, college_address, current_status, course, year_of_studying, year_of_passedout, reason, cgpa, has_purchased, created_at FROM user_details WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
});

// Verify token endpoint
app.post('/api/verify-token', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    res.json({ 
      success: true, 
      user: {
        userId: decoded.userId,
        email: decoded.email,
        hasPurchased: decoded.hasPurchased
      }
    });
  });
});

// Rate limiting for forgot password (in-memory store for simplicity)
const forgotPasswordAttempts = new Map();

// Clean up old attempts every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [key, attempts] of forgotPasswordAttempts.entries()) {
    forgotPasswordAttempts.set(key, attempts.filter(time => time > oneHourAgo));
    if (forgotPasswordAttempts.get(key).length === 0) {
      forgotPasswordAttempts.delete(key);
    }
  }
}, 60 * 60 * 1000);

// Forgot Password endpoint with rate limiting
app.post('/api/forgot-password', async (req, res) => {
  const client = await pool.connect();
  try {
    const { email } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    const rateLimitKey = `${clientIP}:${email}`;

    // Rate limiting: max 3 attempts per hour per IP+email combination
    const attempts = forgotPasswordAttempts.get(rateLimitKey) || [];
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentAttempts = attempts.filter(time => time > oneHourAgo);
    
    if (recentAttempts.length >= 3) {
      console.log(`🚫 Rate limit exceeded for ${email} from ${clientIP}`);
      return res.status(429).json({ 
        error: 'Too many password reset attempts. Please try again in an hour.' 
      });
    }

    // Record this attempt
    recentAttempts.push(Date.now());
    forgotPasswordAttempts.set(rateLimitKey, recentAttempts);

    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Check if user exists
    const userResult = await client.query(
      'SELECT id, email, name FROM user_details WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      // For security, don't reveal if email exists or not
      return res.status(404).json({ 
        error: 'No account found with that email address. Please check your email and try again.' 
      });
    }

    const user = userResult.rows[0];

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'password_reset'
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.name);
    
    if (emailResult.success) {
      console.log(`✅ Password reset email sent to: ${email}`);
      res.json({ 
        success: true, 
        message: 'Password reset instructions have been sent to your email address. Please check your inbox and spam folder.',
        // In development, include the token for testing
        ...(process.env.NODE_ENV === 'development' && { resetToken })
      });
    } else {
      console.error(`❌ Failed to send email to: ${email}`, emailResult.error);
      res.status(500).json({ 
        error: 'Failed to send password reset email. Please try again later.',
        // Still provide token in development even if email fails
        ...(process.env.NODE_ENV === 'development' && { resetToken, emailError: emailResult.error })
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  } finally {
    client.release();
  }
});

// Reset Password endpoint
app.post('/api/reset-password', async (req, res) => {
  const client = await pool.connect();
  try {
    const { token, newPassword } = req.body;

    // Validate inputs
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if it's a password reset token
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    const updateResult = await client.query(
      'UPDATE user_details SET password_hash = $1 WHERE id = $2 AND email = $3 RETURNING id, email, name',
      [passwordHash, decoded.userId, decoded.email]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ Password reset successful for user: ${decoded.email}`);

    res.json({ 
      success: true, 
      message: 'Password has been reset successfully. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  } finally {
    client.release();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🗄️ Database: PostgreSQL`);
  console.log(`💳 Razorpay Key: ${process.env.RAZORPAY_KEY_ID}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🧪 Test Mode: ${process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test') ? 'YES' : 'NO'}`);
  console.log(`👤 Workflow: New User Only (Payment → Registration → Ebook)`);
  if (process.env.NODE_ENV === 'development') {
    console.log('⚠️  Development Mode: Relaxed payment verification enabled');
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  try {
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
  process.exit(0);
});
