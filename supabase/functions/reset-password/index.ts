import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Hash password using PBKDF2
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const passwordData = encoder.encode(password)

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordData,
        'PBKDF2',
        false,
        ['deriveBits']
    )

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 10000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    )

    const hashArray = Array.from(new Uint8Array(derivedBits))
    const saltArray = Array.from(salt)

    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    const saltHex = saltArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return `pbkdf2:sha256:10000$${saltHex}$${hashHex}`
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

        const { token, newPassword } = await req.json()

        // Validate inputs
        if (!token || !newPassword) {
            return new Response(
                JSON.stringify({ error: 'Token and new password are required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return new Response(
                JSON.stringify({ error: 'Password must be at least 6 characters long' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Verify reset token
        const jwtSecret = Deno.env.get('JWT_SECRET') ?? 'your-secret-key'
        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(jwtSecret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign", "verify"]
        )

        let decoded
        try {
            decoded = await verify(token, key)

            // Check if it's a password reset token
            if (decoded.type !== 'password_reset') {
                throw new Error('Invalid token type')
            }
        } catch (err) {
            return new Response(
                JSON.stringify({ error: 'Invalid or expired reset token' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            )
        }

        // Hash new password
        const passwordHash = await hashPassword(newPassword)

        // Update password in database
        const { data, error } = await supabaseClient
            .from('user_details')
            .update({ password_hash: passwordHash })
            .eq('id', decoded.userId)
            .eq('email', decoded.email)
            .select('id, email, name')
            .single()

        if (error || !data) {
            console.error('Database update error:', error)
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
            )
        }

        console.log(`✅ Password reset successful for user: ${decoded.email}`)

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Password has been reset successfully. You can now login with your new password.'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error:', errorMessage)
        return new Response(
            JSON.stringify({ error: 'Failed to reset password' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
