# 🚀 SkyBlue Python Launch - Production Ready

A modern, scalable web application for selling and accessing Python programming content with integrated payment processing, user authentication, and enterprise-grade security features.

## ✨ Features

- **💳 Payment Integration**: Razorpay payment gateway with live/test mode support
- **🔐 User Authentication**: JWT-based authentication with 7-day token expiration
- **📧 Password Reset**: Multi-provider email system (SendGrid, Gmail, Mailgun, AWS SES)
- **📱 Responsive Design**: Modern UI with Tailwind CSS and Radix UI components
- **🗄️ Database**: PostgreSQL for production with optimized connection pooling
- **🛡️ Security**: Rate limiting, CORS, security headers, input validation
- **⚡ Performance**: Optimized for 300-500 concurrent users
- **🌐 Production Ready**: Configured for Vercel (frontend) and Render (backend)

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for lightning-fast builds
- **Tailwind CSS** for styling
- **Radix UI** components
- **React Router** for navigation
- **React Hook Form** for form handling
- **Code Splitting** for optimal loading

### Backend
- **Node.js** with Express
- **PostgreSQL** with connection pooling (30 max connections)
- **JWT** authentication with bcrypt hashing
- **Nodemailer** with multi-provider email support
- **Razorpay** for secure payment processing
- **Production optimizations** for high concurrency

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL (production) or SQLite (development)
- Razorpay account
- Email service provider (Gmail/SendGrid recommended)

### Local Development

1. **Clone and Install**:
```bash
git clone <repository-url>
cd skyblue-python-launch

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install
```

2. **Environment Setup**:
```bash
# Backend environment
cp server/.env.example server/.env
# Edit server/.env with your configuration

# Frontend environment (optional for local dev)
echo "VITE_API_URL=http://localhost:5000" > .env
```

3. **Start Development Servers**:
```bash
# Terminal 1 - Backend (from server directory)
cd server && npm run dev

# Terminal 2 - Frontend (from root directory)
npm run dev
```

4. **Access Application**:
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 🌐 Production Deployment

### Quick Deploy Commands

**Backend (Render)**:
```bash
# 1. Push to GitHub
git add . && git commit -m "Production ready" && git push

# 2. Create Render Web Service
# - Connect GitHub repo
# - Root Directory: server
# - Build: npm install
# - Start: npm start
# - Add environment variables from .env.render.template
```

**Frontend (Vercel)**:
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Set environment variable
vercel env add VITE_API_URL production
# Enter your Render backend URL: https://your-app.onrender.com
```

📖 **Detailed Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

## 🔧 Configuration

### Backend Environment Variables
```bash
# Production Settings
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db

# Payment Processing
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY

# Authentication
JWT_SECRET=your-64-character-secret-key

# Email Service (Choose one)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
# OR
SENDGRID_API_KEY=your-sendgrid-key

# Frontend URL
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend Environment Variables
```bash
VITE_API_URL=https://your-backend.onrender.com
```

## 📊 Performance & Scalability

### Optimizations for 300-500 Concurrent Users

**Backend**:
- ✅ Connection pooling: 30 max, 5 min connections
- ✅ Request timeout: 60s acquire, 30s create
- ✅ Security headers and CORS optimization
- ✅ Production logging and monitoring
- ✅ Memory-efficient rate limiting

**Frontend**:
- ✅ Code splitting by vendor, router, UI components
- ✅ Terser minification with tree shaking
- ✅ Asset optimization (4KB inline limit)
- ✅ CDN delivery via Vercel Edge Network
- ✅ No source maps in production

## 🛡️ Security Features

- **🔐 Authentication**: JWT tokens with 7-day expiration
- **🔒 Password Security**: bcrypt hashing (10 salt rounds)
- **📧 Rate Limiting**: 3 password reset attempts per hour
- **🌐 CORS**: Configured for production domains only
- **🛡️ Headers**: XSS protection, content type validation
- **✅ Input Validation**: Email format, password strength
- **🚫 SQL Injection**: Parameterized queries only

## 📡 API Reference

### Authentication Endpoints
```bash
POST /api/login              # User login
POST /api/submit-details     # User registration  
GET  /api/profile            # Get user profile (protected)
POST /api/verify-token       # Verify JWT token
```

### Payment Endpoints
```bash
POST /api/create-order       # Create Razorpay order
POST /api/verify-payment     # Verify payment signature
```

### Password Reset Endpoints
```bash
POST /api/forgot-password    # Request password reset
POST /api/reset-password     # Reset with token
```

### Utility Endpoints
```bash
GET  /api/health            # Server health check
```

## 🚨 Troubleshooting

### Common Issues

**CORS Errors**:
```bash
# Check FRONTEND_URL matches exactly
echo $FRONTEND_URL
# Should match your Vercel domain exactly
```

**Database Connection**:
```bash
# Test database connection
node -e "const {Pool} = require('pg'); const pool = new Pool({connectionString: process.env.DATABASE_URL}); pool.query('SELECT NOW()').then(r => console.log('✅ DB Connected:', r.rows[0])).catch(e => console.error('❌ DB Error:', e.message))"
```

**Payment Issues**:
- Verify Razorpay keys are live (not test) for production
- Check webhook configuration in Razorpay dashboard
- Ensure HTTPS is enabled for production

## 🎯 Production Checklist

- [x] **Code Optimization**: Debug endpoints removed, production optimizations applied
- [x] **Security**: CORS, security headers, rate limiting configured
- [x] **Performance**: Connection pooling, code splitting, asset optimization
- [x] **Deployment**: Vercel and Render configurations ready
- [x] **Monitoring**: Health checks and logging implemented
- [x] **Documentation**: Comprehensive deployment and troubleshooting guides

**Ready for 300-500 concurrent users! 🚀**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
