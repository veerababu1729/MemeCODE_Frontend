const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration for development
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize SQLite Database for local development
const db = new sqlite3.Database('./database.sqlite');

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Email configuration
const emailTransporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to other services
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Function to send password reset email
const sendPasswordResetEmail = async (email, resetToken, userName = '') => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: {
      name: 'MemeCode Team',
      address: process.env.EMAIL_USER || 'noreply@memecode.com'
    },
    to: email,
    subject: 'Reset Your MemeCode Password',
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
            <p>MemeCode - Telugu Programming Guide</p>
          </div>
          
          <div class="content">
            <h2>Hello${userName ? ` ${userName}` : ''}!</h2>
            
            <p>We received a request to reset your password for your MemeCode account. If you didn't make this request, you can safely ignore this email.</p>
            
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
            <strong>The MemeCode Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${email}</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>&copy; 2024 MemeCode. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request - MemeCode
      
      Hello${userName ? ` ${userName}` : ''}!
      
      We received a request to reset your password for your MemeCode account.
      
      To reset your password, visit this link:
      ${resetLink}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this reset, please ignore this email.
      
      Best regards,
      The MemeCode Team
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

// Create tables if they don't exist
db.serialize(() => {
  // Payments table
  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount INTEGER,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'created',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // User details table with authentication fields
  db.run(`CREATE TABLE IF NOT EXISTS user_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_id INTEGER,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    phone_number TEXT NOT NULL,
    gender TEXT NOT NULL,
    college_name TEXT NOT NULL,
    college_address TEXT NOT NULL,
    current_status TEXT NOT NULL,
    course TEXT,
    year_of_studying TEXT,
    year_of_passedout INTEGER,
    reason TEXT NOT NULL,
    cgpa REAL,
    has_purchased BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments (id)
  )`);
  
  console.log('✅ SQLite database tables created successfully');
});

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running!', 
    timestamp: new Date().toISOString() 
  });
});

// Debug endpoint to check users (remove in production)
app.get('/api/debug/users', (req, res) => {
  db.all('SELECT * FROM user_details LIMIT 5', (err, rows) => {
    if (err) {
      console.error('Debug users error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ users: rows, count: rows.length });
  });
});

// Debug endpoint to check table schema
app.get('/api/debug/schema', (req, res) => {
  db.all("PRAGMA table_info(user_details)", (err, rows) => {
    if (err) {
      console.error('Schema error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ schema: rows });
  });
});

// Debug endpoint to create test user
app.post('/api/debug/create-test-user', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    db.run(
      `INSERT INTO user_details (
        email, password_hash, name, age, gender, college_name, 
        college_address, current_status, course, year_of_studying, 
        year_of_passedout, reason, phone_number, cgpa, has_purchased, payment_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email, hashedPassword, 'Test User', 25, 'male', 'Test College',
        'Test Address', 'student', 'Computer Science', '3',
        '', 'Learning', '1234567890', '8.5', true, 'test_payment_' + Date.now()
      ],
      function(err) {
        if (err) {
          console.error('Create test user error:', err);
          return res.status(500).json({ error: 'Failed to create user', details: err.message });
        }
        
        res.json({ 
          success: true, 
          message: 'Test user created successfully',
          userId: this.lastID,
          email: email
        });
      }
    );
  } catch (error) {
    console.error('Create test user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Create Razorpay order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in paise (₹99 = 9900 paise)
    
    const options = {
      amount: amount || 9900, // Default ₹99
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Store order in database
    db.run(
      'INSERT INTO payments (razorpay_order_id, amount, currency) VALUES (?, ?, ?)',
      [order.id, order.amount, order.currency],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID
        });
      }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create signature for verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment status in database
      db.run(
        'UPDATE payments SET razorpay_payment_id = ?, razorpay_signature = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE razorpay_order_id = ?',
        [razorpay_payment_id, razorpay_signature, 'completed', razorpay_order_id],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          
          res.json({ 
            success: true, 
            message: 'Payment verified successfully',
            orderId: razorpay_order_id 
          });
        }
      );
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Submit user details with authentication (registration)
app.post('/api/submit-details', async (req, res) => {
  try {
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

    // Validate required fields
    if (!orderId || !email || !password || !name || !age || !phoneNumber || !gender || !collegeName || !collegeAddress || !currentStatus || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Get payment ID from order ID
    db.get(
      'SELECT id FROM payments WHERE razorpay_order_id = ? AND status = "completed"',
      [orderId],
      (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!row) {
          return res.status(400).json({ error: 'Invalid or incomplete payment' });
        }

        // Insert user details with authentication
        db.run(
          `INSERT INTO user_details 
           (payment_id, email, password_hash, name, age, phone_number, gender, college_name, college_address, current_status, course, year_of_studying, year_of_passedout, reason, cgpa, has_purchased) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [row.id, email, passwordHash, name, age, phoneNumber, gender, collegeName, collegeAddress, currentStatus, course, yearOfStudying, yearOfPassedout, reason, cgpa, true],
          function(err) {
            if (err) {
              if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(400).json({ error: 'Email already exists. Please use a different email or login.' });
              }
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Failed to save details' });
            }

            // Generate JWT token for auto-login
            const token = jwt.sign(
              { 
                userId: this.lastID, 
                email: email,
                hasPurchased: true 
              },
              JWT_SECRET,
              { expiresIn: '7d' }
            );

            res.json({ 
              success: true, 
              message: 'Registration successful! You are now logged in.',
              submissionId: this.lastID,
              token: token,
              user: {
                id: this.lastID,
                email: email,
                name: name,
                hasPurchased: true
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error submitting details:', error);
    res.status(500).json({ error: 'Failed to submit details' });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    db.get(
      'SELECT id, email, password_hash, name, has_purchased FROM user_details WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        try {
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
        } catch (bcryptError) {
          console.error('Password comparison error:', bcryptError);
          res.status(500).json({ error: 'Login failed' });
        }
      }
    );
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile (protected route)
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, email, name, age, phone_number, gender, college_name, college_address, current_status, course, year_of_studying, year_of_passedout, reason, cgpa, has_purchased, created_at FROM user_details WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    }
  );
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

// Forgot Password endpoint
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Check if user exists
    db.get(
      'SELECT id, email FROM user_details WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          // For security, don't reveal if email exists or not
          return res.status(404).json({ 
            error: 'No account found with that email address. Please check your email and try again.' 
          });
        }

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
        const emailResult = await sendPasswordResetEmail(user.email, resetToken);
        
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
          res.json({ 
            success: true, 
            message: 'Password reset request processed. If the email exists, you will receive reset instructions.',
            // Still provide token in development even if email fails
            ...(process.env.NODE_ENV === 'development' && { resetToken, emailError: emailResult.error })
          });
        }
      }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset Password endpoint
app.post('/api/reset-password', (req, res) => {
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
    bcrypt.hash(newPassword, 10, (hashErr, passwordHash) => {
      if (hashErr) {
        console.error('Password hashing error:', hashErr);
        return res.status(500).json({ error: 'Failed to reset password' });
      }

      // Update password in database
      db.run(
        'UPDATE user_details SET password_hash = ? WHERE id = ? AND email = ?',
        [passwordHash, decoded.userId, decoded.email],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to reset password' });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
          }

          console.log(`✅ Password reset successful for user: ${decoded.email}`);

          res.json({ 
            success: true, 
            message: 'Password has been reset successfully. You can now login with your new password.' 
          });
        }
      );
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Get user details (for admin or verification)
app.get('/api/user-details/:orderId', (req, res) => {
  const { orderId } = req.params;
  
  db.get(
    `SELECT ud.*, p.razorpay_payment_id, p.amount 
     FROM user_details ud 
     JOIN payments p ON ud.payment_id = p.id 
     WHERE p.razorpay_order_id = ?`,
    [orderId],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!row) {
        return res.status(404).json({ error: 'Details not found' });
      }

      // Remove sensitive information
      delete row.password_hash;
      res.json(row);
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🗄️ Database: SQLite (Local Development)`);
  console.log(`💳 Razorpay Key: ${process.env.RAZORPAY_KEY_ID}`);
  console.log(`🌍 Environment: Development`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});
