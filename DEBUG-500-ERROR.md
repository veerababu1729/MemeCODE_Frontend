# 🚨 Debugging 500 Internal Server Error

## Current Status: 500 Error on POST /api/submit-details

### Step 1: Check Server Logs 📋
Look at your backend server terminal for detailed error messages. The server now logs:
- 📥 Received submission request
- 🔍 Checking if user exists
- 🔐 Hashing password
- ✅ Inserting user details
- ❌ Detailed error information

### Step 2: Restart Backend with Enhanced Logging 🔄
```bash
cd server
npm run dev
```

Look for startup messages:
- ✅ Database tables created successfully
- 🔧 Development mode: Payment verification is relaxed for testing

### Step 3: Check Database Schema 🗄️
Open browser: `http://localhost:5000/api/debug/schema`

This will show:
- Available tables (payments, user_details)
- All columns in user_details table
- Data types and constraints

### Step 4: Check Recent Payments 💳
Open browser: `http://localhost:5000/api/debug/payments`

This will show recent payment records and their status.

### Step 5: Common 500 Error Causes & Solutions

#### A) Missing bcrypt/jsonwebtoken packages
```bash
cd server
npm install bcrypt jsonwebtoken
```

#### B) Database connection issues
Check `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

#### C) Missing database columns
The error might be: `column "email" does not exist` or similar.
**Solution**: Restart server to recreate tables with new schema.

#### D) PostgreSQL not running
**Solution**: Start PostgreSQL service on your system.

### Step 6: Test with Minimal Data 🧪

Try submitting the form with this exact data:
- Email: test@example.com
- Password: test123
- Name: Test User
- Age: 25
- Gender: Male
- College Name: Test College
- College Address: Test Address
- CGPA: 8.5
- Current Status: Student
- Course: B.Tech
- Year of Studying: 3rd Year
- Reason: Testing the system

### Step 7: Check Specific Error Messages 🔍

The server will now show specific errors:
- `❌ Missing field: [fieldname]` - Form validation issue
- `❌ User already exists` - Email already registered
- `❌ No payment found` - Payment not created
- `❌ Database schema error` - Missing columns
- `❌ Password hashing error` - bcrypt issue
- `❌ Database connection error` - PostgreSQL issue

### Step 8: Manual Database Check 🔧

If you have database access, run:
```sql
-- Check if tables exist
\dt

-- Check user_details table structure
\d user_details

-- Check recent payments
SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;
```

### Step 9: Complete Reset (if needed) 🔄

If all else fails:
```bash
# 1. Stop the server
# 2. Drop and recreate database (if you have access)
# 3. Restart server (will recreate tables)
cd server
npm run dev
```

## Most Likely Issues:

1. **Missing bcrypt package** - Install with `npm install bcrypt`
2. **Database schema mismatch** - Restart server to recreate tables
3. **PostgreSQL not running** - Start PostgreSQL service
4. **Wrong database credentials** - Check .env file

## What to Send Me:

If the error persists, please share:
1. **Server terminal output** (the detailed error logs)
2. **Result from** `http://localhost:5000/api/debug/schema`
3. **Result from** `http://localhost:5000/api/debug/payments`

This will help me identify the exact issue! 🎯
