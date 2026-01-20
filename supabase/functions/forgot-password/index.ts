import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { email } = await req.json()

        if (!email) {
            return new Response(
                JSON.stringify({ error: 'Email is required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ error: 'Please enter a valid email address' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Check if user exists
        const { data: user, error: userError } = await supabaseClient
            .from('user_details')
            .select('id, email, name')
            .eq('email', email)
            .maybeSingle()

        if (userError || !user) {
            // For security, don't reveal if email exists
            return new Response(
                JSON.stringify({
                    error: 'No account found with that email address. Please check your email and try again.'
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
            )
        }

        // Generate reset token (valid for 1 hour)
        const jwtSecret = Deno.env.get('JWT_SECRET') ?? 'your-secret-key'
        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(jwtSecret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign", "verify"]
        )

        const resetToken = await create(
            { alg: "HS256", typ: "JWT" },
            {
                userId: user.id,
                email: user.email,
                type: 'password_reset',
                exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
            },
            key
        )

        // Send email via Brevo API
        const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://memecode.in'
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`

        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': Deno.env.get('BREVO_API_KEY') ?? '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    name: 'MemeCODE Team',
                    email: Deno.env.get('EMAIL_FROM') || 'noreply@memecode.in'
                },
                to: [{
                    email: user.email,
                    name: user.name || user.email.split('@')[0]
                }],
                subject: 'Reset Your MemeCODE Account Password',
                htmlContent: `
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
                <p>MemeCODE - Telugu Programming Guide</p>
              </div>
              
              <div class="content">
                <h2>Hello${user.name ? ` ${user.name}` : ''}!</h2>
                
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
                
                <p>Best regards,<br>
                <strong>The MemeCODE Team</strong></p>
              </div>
              
              <div class="footer">
                <p>This email was sent to ${user.email}</p>
                <p>If you have any questions, contact: eefriends1729@gmail.com</p>
                <p>&copy; 2024 MemeCODE. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
                textContent: `
          Password Reset Request - MemeCODE
          
          Hello${user.name ? ` ${user.name}` : ''}!
          
          We received a request to reset your password for your MemeCODE account.
          
          To reset your password, visit this link:
          ${resetLink}
          
          This link will expire in 1 hour for security reasons.
          
          If you didn't request this reset, please ignore this email.
          
          Best regards,
          The MemeCODE Team
        `
            })
        })

        if (!brevoResponse.ok) {
            const errorData = await brevoResponse.json()
            console.error('Brevo API error:', errorData)
            throw new Error('Failed to send password reset email')
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Password reset instructions have been sent to your email address. Please check your inbox and spam folder.'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error:', errorMessage)
        return new Response(
            JSON.stringify({
                error: 'Failed to process password reset request. Please try again later.'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
