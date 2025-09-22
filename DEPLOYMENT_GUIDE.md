# 🚀 Production Deployment Guide

## Overview
This guide covers deploying the SkyBlue Python Launch application to production:
- **Frontend**: Vercel (optimized for 300-500 concurrent users)
- **Backend**: Render (with PostgreSQL database)

## 📋 Pre-Deployment Checklist

### ✅ Code Optimization Complete
- [x] Removed debug endpoints and test files
- [x] Optimized database connection pooling (30 max connections)
- [x] Added production security headers
- [x] Configured CORS for production
- [x] Optimized Vite build configuration
- [x] Added code splitting and chunk optimization

### ✅ Environment Configuration
- [x] Created `.env.render.template` for backend
- [x] Updated `vercel.json` with production settings
- [x] Configured security headers and rewrites

## 🔧 Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub repository

### Step 2: Create PostgreSQL Database
1. In Render dashboard, click "New +"
2. Select "PostgreSQL"
3. Choose a name: `skyblue-database`
4. Select region closest to your users
5. Choose "Free" tier for testing (upgrade for production)
6. Click "Create Database"
7. **Save the Database URL** - you'll need it for the web service

### Step 3: Deploy Backend Service
1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `skyblue-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Starter` (free) or `Standard` for production

### Step 4: Set Environment Variables
In Render dashboard, go to your web service → Environment:

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=<your-postgresql-url-from-step-2>
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
FRONTEND_URL=https://your-app-name.vercel.app
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://skyblue-backend.onrender.com`

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub repository

### Step 2: Deploy Frontend
1. In Vercel dashboard, click "New Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables
In Vercel dashboard, go to your project → Settings → Environment Variables:

```bash
VITE_API_URL=https://skyblue-backend.onrender.com
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL: `https://your-app-name.vercel.app`

### Step 5: Update Backend CORS
Go back to Render and update the `FRONTEND_URL` environment variable with your actual Vercel URL.

## 🔒 Security Configuration

### Razorpay Live Keys
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Switch to "Live Mode"
3. Go to Settings → API Keys
4. Generate Live Keys
5. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Render

### Email Configuration
For production, use SendGrid instead of Gmail:
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create API key
3. Update environment variables:
   ```bash
   SENDGRID_API_KEY=your-sendgrid-api-key
   EMAIL_FROM=noreply@yourdomain.com
   ```

### JWT Secret
Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📊 Performance Optimization

### Database Optimization
- Connection pooling: 30 max connections
- Indexes on email, payment_id, order_id
- Optimized queries with proper joins

### Frontend Optimization
- Code splitting by vendor, router, and UI components
- Terser minification
- Asset optimization (4KB inline limit)
- No source maps in production

### Caching Strategy
- Static assets cached by Vercel CDN
- API responses with appropriate cache headers
- Database connection pooling

## 🔍 Monitoring & Health Checks

### Health Check Endpoint
- `GET /api/health` - Returns server status
- Monitor this endpoint for uptime

### Logging
- Production request logging enabled
- Error tracking with stack traces
- Email delivery confirmation logs

### Performance Metrics
- Database connection pool monitoring
- Response time tracking
- Memory usage monitoring

## 🚨 Troubleshooting

### Common Issues

#### 1. CORS Errors
- Ensure `FRONTEND_URL` matches your Vercel domain exactly
- Check CORS configuration in server.js

#### 2. Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database service is running
- Ensure connection pool settings are appropriate

#### 3. Payment Issues
- Verify Razorpay keys are live keys (not test)
- Check webhook configuration
- Ensure HTTPS is enabled

#### 4. Email Issues
- Test email configuration
- Check spam folders
- Verify email provider settings

### Performance Issues
- Monitor database connection pool usage
- Check for slow queries
- Optimize frontend bundle size
- Use CDN for static assets

## 📈 Scaling for 300-500 Concurrent Users

### Backend Scaling
- **Render Standard Plan**: 512MB RAM, 0.5 CPU
- **Database**: Upgrade to Starter plan (1GB RAM)
- **Connection Pool**: 30 max connections configured

### Frontend Scaling
- **Vercel Pro**: Automatic scaling
- **CDN**: Global edge network
- **Code Splitting**: Optimized bundle loading

### Monitoring
- Set up alerts for high CPU/memory usage
- Monitor database connection pool
- Track response times and error rates

## 🎯 Go-Live Checklist

- [ ] Backend deployed to Render
- [ ] Database created and connected
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Razorpay live keys configured
- [ ] Email service configured and tested
- [ ] CORS configuration verified
- [ ] Health checks passing
- [ ] Payment flow tested end-to-end
- [ ] Authentication flow tested
- [ ] Password reset tested
- [ ] Performance monitoring set up

## 📞 Support

For deployment issues:
1. Check Render/Vercel logs
2. Verify environment variables
3. Test API endpoints individually
4. Check database connectivity
5. Monitor performance metrics

Your application is now production-ready and optimized for 300-500 concurrent users! 🎉
