import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { token } = await req.json()

        if (!token) {
            return new Response(
                JSON.stringify({ error: 'Token is required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        const jwtSecret = Deno.env.get('JWT_SECRET') ?? 'your-secret-key'
        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(jwtSecret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign", "verify"]
        )

        const payload = await verify(token, key)

        return new Response(
            JSON.stringify({
                success: true,
                user: {
                    userId: payload.userId,
                    email: payload.email,
                    hasPurchased: payload.hasPurchased
                }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: unknown) {
        console.error('Token verification error:', error)
        return new Response(
            JSON.stringify({ error: 'Invalid or expired token' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
    }
})
