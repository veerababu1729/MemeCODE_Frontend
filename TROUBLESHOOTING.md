# 🚨 Troubleshooting "Failed to Submit" Error

## Quick Checklist

### 1. ✅ **Backend Server Running?**
```bash
cd server
npm run dev
```
Should show: `🚀 Server running on port 5000`

### 2. ✅ **Database Connected?**
Check server logs for:
- `✅ Database tables created successfully`
- No connection errors

### 3. ✅ **Required Packages Installed?**
```bash
cd server
npm install bcrypt jsonwebtoken
```

### 4. ✅ **Payment Completed?**
The registration form requires a completed payment. Make sure:
- Payment was successful
- Payment verification was completed
- Order ID exists in database

## Common Error Messages & Solutions

### "Missing required fields"
**Cause**: Form validation failed
**Solution**: Check all required fields are filled:
- Email (username)
- Password (min 6 characters)
- Name, Age, Gender
- College Name & Address
- Current Status
- Reason for joining

### "Payment not found"
**Cause**: No payment record for the order ID
**Solution**: 
1. Complete payment first
2. Wait for payment verification
3. Check if order ID is correct

### "Payment not completed"
**Cause**: Payment exists but status is not 'completed'
**Solution**:
1. Complete payment verification
2. Check Razorpay webhook/callback

### "User with this email already exists"
**Cause**: Email already registered
**Solution**: Use a different email address

### "Database connection failed"
**Cause**: PostgreSQL not running or wrong credentials
**Solution**:
1. Start PostgreSQL service
2. Check DATABASE_URL in .env file
3. Verify database credentials

### "Network error"
**Cause**: Frontend can't reach backend
**Solution**:
1. Check if backend server is running on port 5000
2. Check CORS settings
3. Verify API_BASE_URL in frontend config

## Debug Steps

### Step 1: Test Backend Health
Open browser and go to: `http://localhost:5000/api/health`
Should return: `{"status":"Server is running!","timestamp":"..."}`

### Step 2: Check Server Logs
Look at terminal running the backend server for error messages

### Step 3: Test with Debug Script
```bash
node debug-submission.js
```

### Step 4: Check Browser Console
Open Developer Tools → Console tab
Look for network errors or API response errors

### Step 5: Check Database
```sql
-- Check if payments table has data
SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;

-- Check if user_details table exists
\d user_details;
```

## Environment Variables Check

Ensure these are set in `server/.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

## Still Having Issues?

1. **Check the exact error message** in browser console
2. **Check server terminal logs** for detailed error info
3. **Verify payment flow** - complete a test payment first
4. **Test with simple data** - use the debug script
5. **Check database schema** - ensure all tables exist

## Quick Fix Commands

```bash
# Restart everything
cd server
npm install
npm run dev

# In another terminal
cd ..
npm run dev

# Test the health endpoint
curl http://localhost:5000/api/health
```
