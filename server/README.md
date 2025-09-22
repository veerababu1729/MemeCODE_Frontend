# 🚀 MemeCODE Python Launch - Backend API

A production-ready Node.js backend API for the MemeCODE Python Launch application with authentication, payment processing, and email services.

## ✨ Features

- **🔐 Authentication**: JWT-based authentication with 7-day token expiration
- **💳 Payment Processing**: Razorpay integration with order creation and verification
- **📧 Email Services**: Multi-provider email system (SendGrid, Gmail, Mailgun, AWS SES)
- **🔒 Password Reset**: Secure password reset with rate limiting (3 attempts/hour)
- **🗄️ Database**: PostgreSQL with optimized connection pooling (30 max connections)
- **🛡️ Security**: bcrypt hashing, input validation, CORS, security headers
- **⚡ Performance**: Optimized for 300-500 concurrent users
- **📊 Monitoring**: Health checks and production logging

## 🏗️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT + bcrypt
- **Payment**: Razorpay
- **Email**: Nodemailer with multi-provider support
- **Deployment**: Render with Docker support

## 📁 Project Structure

```
├── server.js                    # Main production server (PostgreSQL)
├── server-local.js             # Local development server (SQLite)
├── package.json                # Dependencies and scripts
├── render.yaml                 # Render deployment configuration
├── .env.production.template    # Production environment template
├── .env.render.template        # Render-specific environment template
├── EMAIL_SETUP.md             # Email configuration guide
├── PRODUCTION_SETUP.md        # Production deployment guide
└── database.sqlite            # Local SQLite database
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL (production) or SQLite (development)
- Razorpay account
- Email service provider

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.production.template .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**:
   ```bash
   # For local development (SQLite)
   npm run dev-local
   
   # For production testing (PostgreSQL)
   npm run dev
   ```

4. **Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   ```

## 🌐 Production Deployment (Render)

### Step 1: Create PostgreSQL Database
1. Go to [Render Dashboard](https://render.com/dashboard)
2. Create new PostgreSQL service
3. Save the database URL

### Step 2: Deploy Web Service
1. Create new Web Service
2. Connect this GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Production

### Step 3: Environment Variables
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
JWT_SECRET=your-64-character-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://your-frontend.vercel.app
```

## 📡 API Endpoints

### Authentication
```bash
POST /api/login              # User login
POST /api/submit-details     # User registration
GET  /api/profile            # Get user profile (protected)
POST /api/verify-token       # Verify JWT token
```

### Payment Processing
```bash
POST /api/create-order       # Create Razorpay order
POST /api/verify-payment     # Verify payment signature
```

### Password Reset
```bash
POST /api/forgot-password    # Request password reset
POST /api/reset-password     # Reset password with token
```

### Utility
```bash
GET  /api/health            # Server health check
```

## 🛡️ Security Features

- **Password Security**: bcrypt hashing with 10 salt rounds
- **JWT Tokens**: 7-day expiration with secure secrets
- **Rate Limiting**: 3 password reset attempts per hour per IP+email
- **Input Validation**: Email format, password strength validation
- **CORS**: Configured for production domains only
- **Security Headers**: XSS protection, content type validation
- **SQL Injection Protection**: Parameterized queries only

## ⚡ Performance Optimizations

### Database Connection Pooling
```javascript
// Optimized for 300-500 concurrent users
max: 30,           // Maximum connections
min: 5,            // Minimum connections
acquire: 60000,    // 60s acquire timeout
create: 30000,     // 30s create timeout
idle: 10000        // 10s idle timeout
```

## 🧪 Testing

### Health Check
```bash
curl https://your-backend.onrender.com/api/health
```

### Authentication Test
```bash
curl -X POST https://your-backend.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚨 Troubleshooting

### Common Issues

**Database Connection Errors**:
```bash
# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:5432/dbname
```

**CORS Errors**:
```bash
# Verify FRONTEND_URL matches exactly
echo $FRONTEND_URL
# Should match your Vercel domain exactly
```

## 🎯 Production Checklist

- [x] **Security**: JWT, bcrypt, rate limiting, CORS configured
- [x] **Performance**: Connection pooling, query optimization
- [x] **Monitoring**: Health checks, logging, error tracking  
- [x] **Email**: Multi-provider support with fallbacks
- [x] **Payment**: Razorpay integration with signature verification
- [x] **Database**: PostgreSQL with optimized schema

**Ready for production deployment! 🚀**
