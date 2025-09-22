# Email Setup Guide for Password Reset

## Overview
The password reset functionality now sends actual emails to users. This guide explains how to configure email sending.

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password
1. Go to Google Account Settings > Security
2. Under "Signing in to Google", select "App passwords"
3. Select "Mail" and "Other (Custom name)"
4. Enter "MemeCode Password Reset" as the name
5. Copy the generated 16-character password

### Step 3: Update .env File
Update your `.env` file with your email credentials:

```env
# Email Configuration for Password Reset
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

## Alternative Email Services

### Using Outlook/Hotmail
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Using Custom SMTP
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

## Testing Email Functionality

### Test with curl:
```bash
curl -X POST http://localhost:5000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Expected Responses:

**Email exists and email sent successfully:**
```json
{
  "success": true,
  "message": "Password reset instructions have been sent to your email address. Please check your inbox and spam folder."
}
```

**Email doesn't exist:**
```json
{
  "error": "No account found with that email address. Please check your email and try again."
}
```

**Email exists but sending failed:**
```json
{
  "success": true,
  "message": "Password reset request processed. If the email exists, you will receive reset instructions."
}
```

## Email Template Features

The password reset email includes:
- Professional HTML design with MemeCode branding
- Clear call-to-action button
- Fallback plain text link
- Security warnings and expiration notice
- Both HTML and plain text versions

## Security Features

- Reset tokens expire in 1 hour
- Tokens are single-use only
- JWT-based token verification
- Email validation before sending
- Secure password hashing with bcrypt

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**
   - Make sure you're using an App Password, not your regular password
   - Verify 2FA is enabled on your Google account

2. **"Connection timeout" error**
   - Check your internet connection
   - Verify EMAIL_USER and EMAIL_PASS are correct

3. **Emails going to spam**
   - This is normal for development
   - In production, use a proper domain and SPF/DKIM records

4. **"Service not available" error**
   - Gmail might be temporarily unavailable
   - Try using a different email service

### Development Mode
In development mode, the reset token is also included in the API response for testing purposes, even if email sending fails.

## Production Considerations

1. Use environment variables for all email credentials
2. Set up proper SPF, DKIM, and DMARC records
3. Use a dedicated email service like SendGrid or AWS SES
4. Monitor email delivery rates
5. Implement rate limiting for password reset requests

## Support

If you encounter issues:
1. Check the server console for detailed error messages
2. Verify your email credentials are correct
3. Test with a simple email first
4. Check spam/junk folders
