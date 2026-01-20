import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Verify password against PBKDF2 hash
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const parts = hashedPassword.split('$')
        if (parts.length !== 3 || !parts[0].startsWith('pbkdf2')) {
            return false
        }

        const saltHex = parts[1]
        const hashHex = parts[2]

        const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))

        const encoder = new TextEncoder()
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
        const computedHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        return computedHashHex === hashHex
    } catch (error) {
        console.error('Password verification error:', error)
        return false
    }
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

        const { email, password } = await req.json()

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: 'Email and password are required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Find user by email
        const { data: user, error } = await supabaseClient
            .from('user_details')
            .select('id, email, password_hash, name, has_purchased')
            .eq('email', email)
            .maybeSingle()

        if (error || !user) {
            return new Response(
                JSON.stringify({ error: 'Invalid email or password' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            )
        }

        // Verify password
        const passwordMatch = await verifyPassword(password, user.password_hash)

        if (!passwordMatch) {
            return new Response(
                JSON.stringify({ error: 'Invalid email or password' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            )
        }

        // Generate JWT token
        const jwtSecret = Deno.env.get('JWT_SECRET') ?? 'your-secret-key'
        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(jwtSecret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign", "verify"]
        )

        const token = await create(
            { alg: "HS256", typ: "JWT" },
            {
                userId: user.id,
                email: user.email,
                hasPurchased: user.has_purchased,
                exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
            },
            key
        )

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    hasPurchased: user.has_purchased
                }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error:', errorMessage)
        return new Response(
            JSON.stringify({ error: 'Login failed' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
