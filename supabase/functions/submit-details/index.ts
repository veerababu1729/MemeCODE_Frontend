import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple bcrypt-compatible password hashing using Web Crypto API
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

        const body = await req.json()
        const {
            orderId,
            email,
            password,
            name,
            age,
            phoneNumber,
            gender,
            collegeName,
            collegeAddress,
            currentStatus,
            course,
            yearOfStudying,
            yearOfPassedout,
            reason,
            cgpa
        } = body

        // Validate required fields
        const requiredFields = ['orderId', 'email', 'password', 'name', 'age', 'phoneNumber', 'gender', 'collegeName', 'collegeAddress', 'currentStatus', 'reason']
        for (const field of requiredFields) {
            if (!body[field]) {
                return new Response(
                    JSON.stringify({ error: `${field} is required` }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
                )
            }
        }

        // Check if user already exists
        const { data: existingUser } = await supabaseClient
            .from('user_details')
            .select('id')
            .eq('email', email)
            .maybeSingle()

        if (existingUser) {
            return new Response(
                JSON.stringify({ error: 'User with this email already exists' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Get payment from order ID
        const { data: payment, error: paymentError } = await supabaseClient
            .from('payments')
            .select('id, status')
            .eq('razorpay_order_id', orderId)
            .maybeSingle()

        if (paymentError || !payment) {
            return new Response(
                JSON.stringify({ error: 'Payment not found. Please complete payment first.' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        if (payment.status !== 'completed' && payment.status !== 'created') {
            return new Response(
                JSON.stringify({ error: `Payment not completed. Status: ${payment.status}` }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Hash password
        const passwordHash = await hashPassword(password)

        // Insert user details
        const { data: newUser, error: insertError } = await supabaseClient
            .from('user_details')
            .insert({
                payment_id: payment.id,
                email,
                password_hash: passwordHash,
                name,
                age,
                phone_number: phoneNumber,
                gender,
                college_name: collegeName,
                college_address: collegeAddress,
                current_status: currentStatus,
                course,
                year_of_studying: yearOfStudying,
                year_of_passedout: yearOfPassedout,
                reason,
                cgpa,
                has_purchased: true,
                created_at: new Date().toISOString()
            })
            .select('id, email, name')
            .single()

        if (insertError) {
            console.error('Insert error:', insertError)
            if (insertError.code === '23505') {
                return new Response(
                    JSON.stringify({ error: 'User with this email already exists' }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
                )
            }
            throw insertError
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
                userId: newUser.id,
                email: newUser.email,
                hasPurchased: true,
                exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
            },
            key
        )

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Registration completed successfully',
                submissionId: newUser.id,
                token: token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    hasPurchased: true
                }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error:', errorMessage)
        return new Response(
            JSON.stringify({ error: `Submission failed: ${errorMessage}` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
