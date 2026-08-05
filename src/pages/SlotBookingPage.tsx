import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, CheckCircle, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { API_ENDPOINTS, getSupabaseHeaders } from '@/config/api';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const SlotBookingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    const slotPrice = 4900; // ₹49 in paise
    const slotPriceDisplay = '₹49';

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePaymentSuccess = (razorpayOrderId: string) => {
        console.log('Slot booking payment successful:', razorpayOrderId);
        setOrderId(razorpayOrderId);
        setPaymentSuccess(true);
    };

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Failed to load payment gateway');
            }

            // Create order with slot booking type
            const response = await fetch(API_ENDPOINTS.CREATE_ORDER, {
                method: 'POST',
                headers: getSupabaseHeaders(),
                body: JSON.stringify({
                    amount: slotPrice,
                    paymentType: 'slot' // Mark as slot booking
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await response.json();

            // Configure Razorpay options
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'MemeCODE',
                description: `Slot Booking - ${slotPriceDisplay}`,
                order_id: orderData.orderId,
                handler: async (response: any) => {
                    try {
                        // Verify payment
                        const verifyResponse = await fetch(API_ENDPOINTS.VERIFY_PAYMENT, {
                            method: 'POST',
                            headers: getSupabaseHeaders(),
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        if (!verifyResponse.ok) {
                            throw new Error('Payment verification failed');
                        }

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            handlePaymentSuccess(response.razorpay_order_id);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        setError('Payment verification failed. Please contact support.');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#3B82F6',
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    },
                },
            };

            // Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            setError('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    // Success Screen
    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-lg mx-auto shadow-2xl border-2 border-green-200">
                    <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg pb-8 pt-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center animate-bounce">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold mb-2">
                            🎉 Slot Booked Successfully! 🎉
                        </CardTitle>
                        <CardDescription className="text-green-50 text-lg">
                            Your early bird slot has been reserved
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-8 pb-8">
                        {/* Coupon Code Section */}
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-6 h-6 text-yellow-600 animate-pulse" />
                                <h3 className="text-xl font-bold text-gray-800">Your Exclusive Coupon Code</h3>
                            </div>

                            <div className="bg-white border-2 border-dashed border-yellow-400 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-center gap-2">
                                    <Tag className="w-5 h-5 text-yellow-600" />
                                    <code className="text-2xl font-bold text-yellow-700 tracking-wider">
                                        SLOT49
                                    </code>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-700">
                                <p className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span>Apply coupon code <strong>"SLOT49"</strong> during actual course payment</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span>Get <strong>₹49 Less</strong> on the full ebook price</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span>Take a screenshot of this couponcode</span>
                                </p>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-700 mb-2">Booking Details</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex justify-between">
                                    <span>Amount Paid:</span>
                                    <span className="font-semibold text-green-600">{slotPriceDisplay}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Order ID:</span>
                                    <span className="font-mono text-xs">{orderId.substring(0, 20)}...</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="font-semibold text-green-600">Confirmed ✓</span>
                                </p>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="space-y-3">
                            <Button
                                onClick={() => navigate('/payment')}
                                className="w-full py-4 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg group"
                            >
                                Complete Full Payment
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="w-full py-4"
                            >
                                Back to Home
                            </Button>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800 text-center">
                                💡 <strong>Pro Tip:</strong> Take a screenshot of this page for your records!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Payment Screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Reserve Your Slot
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        Secure your early bird spot for just ₹49
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Benefits List */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            What You Get
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Reserve your slot for ebook</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Exclusive coupon code</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>₹49 discount on final payment</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Priority access to all ebook materials</span>
                            </li>
                        </ul>
                    </div>

                    {/* Price Display */}
                    <div className="text-center py-4">
                        <div className="text-4xl font-bold text-primary mb-2">
                            {slotPriceDisplay}
                        </div>
                        <p className="text-sm text-muted-foreground">One-time slot booking fee</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Payment Button */}
                    <Button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-6 text-lg font-semibold group relative overflow-hidden"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                Reserve My Slot - Pay {slotPriceDisplay}
                            </>
                        )}
                    </Button>

                    {/* Back Button */}
                    <Button
                        onClick={() => navigate('/payment')}
                        variant="outline"
                        className="w-full"
                        disabled={loading}
                    >
                        Back to Course Payment
                    </Button>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>Instant Confirmation</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SlotBookingPage;
