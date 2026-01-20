import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Razorpay from "npm:razorpay@2.9.2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Initialize Supabase Client (Direct DB Access)
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 2. Initialize Razorpay (Payment Gateway)
        const razorpay = new Razorpay({
            key_id: Deno.env.get('RAZORPAY_KEY_ID') ?? '',
            key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') ?? '',
        })

        // 3. Parse Request Body
        const { amount, couponCode, currency = 'INR', paymentType = 'full' } = await req.json()

        if (!amount) {
            throw new Error('Amount is required')
        }

        // 4. Coupon Logic (Database Check)
        let finalAmount = amount
        let originalAmount = amount
        let appliedCoupon = null

        if (couponCode) {
            const { data: coupons, error: couponError } = await supabaseClient
                .from('coupons')
                .select('*')
                .eq('code', couponCode.toUpperCase())
                .eq('is_active', true)
                .maybeSingle()

            if (couponError) console.error('Coupon fetch error:', couponError)

            if (coupons) {
                appliedCoupon = coupons.code
                if (coupons.discount_type === 'percent') {
                    const discount = Math.floor((amount * coupons.discount_value) / 100)
                    finalAmount = amount - discount
                } else if (coupons.discount_type === 'fixed') {
                    finalAmount = Math.max(0, amount - coupons.discount_value)
                }
            }
        }

        // 5. Create Razorpay Order (The External API Call)
        const options = {
            amount: finalAmount,
            currency: currency,
            receipt: `receipt_${Date.now()}`,
        }

        const order = await razorpay.orders.create(options)

        // 6. Store in Database (The Persistence Step)
        const { error: insertError } = await supabaseClient
            .from('payments')
            .insert({
                razorpay_order_id: order.id,
                amount: finalAmount,
                original_amount: originalAmount,
                currency: order.currency,
                status: 'created',
                coupon_code: appliedCoupon,
                payment_type: paymentType,
                created_at: new Date().toISOString()
            })

        if (insertError) {
            console.error('Database insertion error:', insertError)
        }

        // 7. Return Success Response
        return new Response(
            JSON.stringify({
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key: Deno.env.get('RAZORPAY_KEY_ID'),
                isSpeedLayer: true
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error:', errorMessage)
        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
