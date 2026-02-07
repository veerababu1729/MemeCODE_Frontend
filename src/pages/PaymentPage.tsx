import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Shield, CheckCircle, Clock, Tag, X, Check } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import ebookCover from '@/assets/coverpage.png';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Flip Clock Digit Component
const FlipDigit = ({ digit }: { digit: string }) => (
  <div className="relative bg-gradient-to-b from-green-700 to-green-900 rounded px-1.5 py-0.5 shadow-md border border-green-800">
    <div className="absolute inset-x-0 top-1/2 h-[0.5px] bg-green-800"></div>
    <span className="text-base md:text-lg font-bold text-white font-mono">
      {digit}
    </span>
  </div>
);

// Scarcity Counters Component
const ScarcityCounters = () => {
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [slotsLeft, setSlotsLeft] = useState(15);

  useEffect(() => {
    // Initialize from localStorage or set defaults
    const initializeCounts = () => {
      const storedPurchases = localStorage.getItem('purchaseCount');
      const storedSlots = localStorage.getItem('slotsLeft');
      const lastUpdateTime = localStorage.getItem('countersLastUpdate');

      if (storedPurchases && storedSlots && lastUpdateTime) {
        const elapsed = Math.floor((Date.now() - parseInt(lastUpdateTime, 10)) / 5000); // 5-second intervals

        const calculatedPurchases = parseInt(storedPurchases, 10) + elapsed;
        const currentPurchases = Math.min(8765, calculatedPurchases);
        const currentSlots = Math.max(2, parseInt(storedSlots, 10) - elapsed);

        setPurchaseCount(currentPurchases);
        setSlotsLeft(currentSlots);

        localStorage.setItem('purchaseCount', currentPurchases.toString());
        localStorage.setItem('slotsLeft', currentSlots.toString());
      } else {
        // First time - initialize with random starting values
        const initialPurchases = Math.floor(Math.random() * 200) + 1200; // 1200-1400
        setPurchaseCount(initialPurchases);
        setSlotsLeft(15);

        localStorage.setItem('purchaseCount', initialPurchases.toString());
        localStorage.setItem('slotsLeft', '15');
      }

      localStorage.setItem('countersLastUpdate', Date.now().toString());
    };

    initializeCounts();

    // Update every 5 seconds
    const interval = setInterval(() => {
      setPurchaseCount(prev => {
        if (prev >= 8765) return 8765;
        const newValue = prev + 1;
        localStorage.setItem('purchaseCount', newValue.toString());
        localStorage.setItem('countersLastUpdate', Date.now().toString());
        return newValue;
      });

      setSlotsLeft(prev => {
        const newValue = Math.max(2, prev - 1);
        localStorage.setItem('slotsLeft', newValue.toString());
        return newValue;
      });
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Format numbers to display digits
  const purchaseDigits = purchaseCount.toString().padStart(4, '0').split('');
  const slotsDigits = slotsLeft.toString().padStart(2, '0').split('');

  return { purchaseDigits, slotsDigits, slotsLeft };
};

// People Purchased Counter Component
const PurchaseCounter = () => {
  const { purchaseDigits } = ScarcityCounters();

  return (
    <div className="p-1 max-w-[200px] mx-auto">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700">People purchased:</span>
        </div>
        <div className="flex gap-1">
          {purchaseDigits.map((digit, index) => (
            <FlipDigit key={`purchase-${index}`} digit={digit} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Slots Left Counter Component
const SlotsCounter = () => {
  const { slotsDigits, slotsLeft } = ScarcityCounters();

  return (
    <div className="p-1">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700">Slots left:</span>
          {slotsLeft <= 10 && (
            <span className="text-red-600 animate-bounce">⚠️</span>
          )}
        </div>
        <div className="flex gap-1">
          {slotsDigits.map((digit, index) => (
            <FlipDigit key={`slots-${index}`} digit={digit} />
          ))}
        </div>
      </div>
    </div>
  );
};



const PaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Optimization State: Tracks if Razorpay and Order are ready for instant checkout
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [preCreatedOrder, setPreCreatedOrder] = useState<any>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    // Silent Wake-Up: Ping the backend to wake up Render free tier
    // We don't wait for this or handle errors - it's fire and forget
    fetch(API_ENDPOINTS.HEALTH_CHECK).catch(() => {
      // Ignore wake-up errors, payment flow handles actual errors
    });
  }, []);

  // Timer state (5 minutes = 300 seconds)
  const getStoredTimer = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('paymentTimerRemaining');
      const storedTime = stored ? parseInt(stored, 10) : null;
      const lastUpdate = localStorage.getItem('paymentTimerLastUpdate');

      if (storedTime && lastUpdate) {
        const elapsed = Math.floor((Date.now() - parseInt(lastUpdate, 10)) / 1000);
        const remaining = Math.max(0, storedTime - elapsed);
        return remaining > 0 ? remaining : 300; // Reset to 5 minutes if expired
      }
    }
    return 300; // 5 minutes in seconds
  };

  const [timeRemaining, setTimeRemaining] = useState(getStoredTimer);

  // Timer countdown effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining(prevTime => {
        const newTime = Math.max(0, prevTime - 1);

        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('paymentTimerRemaining', newTime.toString());
          localStorage.setItem('paymentTimerLastUpdate', Date.now().toString());
        }

        // Reset timer when it reaches 0
        if (newTime === 0) {
          return 300; // Reset to 5 minutes
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Format timer to MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validCouponCode, setValidCouponCode] = useState('');

  // Price calculation
  const originalPrice = 39900; // ₹399 in paise
  const currentPrice = couponApplied ? Math.max(0, originalPrice - discountAmount) : originalPrice;
  const currentPriceDisplay = `₹${Math.round(currentPrice / 100)}`;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // LIGHTERSPEED IMPLEMENTATION: Preload resources for instant click response
  useEffect(() => {
    // 1. Preload Razorpay Script
    // We start loading this immediately so it's ready when user clicks
    loadRazorpayScript().then((loaded: any) => setRazorpayReady(!!loaded));

    // 2. Pre-create Order (Optimistic Backend Call)
    // We create the order ID silently in the background
    const createPreOrder = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CREATE_ORDER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: originalPrice,
            couponCode: couponApplied ? validCouponCode : undefined
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("⚡ [Lighterspeed] Pre-created order ready:", data.orderId);
          setPreCreatedOrder(data);
        }
      } catch (e) {
        console.warn("Silent pre-fetch failed, will fallback to on-click fetch", e);
      }
    };

    createPreOrder();
  }, [couponApplied, validCouponCode]); // Re-fetch if coupon logic changes (though currently static)

  const handleCouponApply = async () => {
    setCouponError('');
    if (!couponCode.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.VALIDATE_COUPON, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (data.valid) {
        setCouponApplied(true);
        setValidCouponCode(data.code);
        setShowCouponInput(false);

        let discount = 0;
        if (data.discountType === 'fixed') {
          discount = data.discountValue;
        } else {
          discount = Math.floor((originalPrice * data.discountValue) / 100);
        }
        setDiscountAmount(discount);
        setCouponCode('');
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (err) {
      console.error('Coupon validation error:', err);
      setCouponError('Error validating coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleCouponRemove = () => {
    setCouponApplied(false);
    setCouponCode('');
    setValidCouponCode('');
    setDiscountAmount(0);
    setCouponError('');
  };

  const handlePaymentSuccess = (orderId: string) => {
    // Handle successful payment - redirect to registration
    console.log('Payment successful:', orderId);
    // Navigate immediately without alert
    navigate(`/registration?orderId=${orderId}`);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // LIGHTERSPEED: Check pre-loaded resources first
      let orderData = preCreatedOrder;

      // 1. Ensure Script is Loaded (Should be ready from useEffect, but double check)
      if (!razorpayReady) {
        const loaded = await loadRazorpayScript();
        if (!loaded) throw new Error('Failed to load payment gateway');
      }

      // 2. Get Order Data (Use Pre-created or Fetch New if missing)
      if (!orderData) {
        console.log("⚠️ Pre-order not ready, fetching now...");
        const response = await fetch(API_ENDPOINTS.CREATE_ORDER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: originalPrice,
            couponCode: couponApplied ? validCouponCode : undefined
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create order');
        }

        orderData = await response.json();
      } else {
        console.log("🚀 [Lighterspeed] Launching with pre-created order:", orderData.orderId);
      }

      // Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'EE.Info',
        description: `Coding Guidance Course - ${currentPriceDisplay}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch(API_ENDPOINTS.VERIFY_PAYMENT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
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
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#3B82F6', // Blue color from your palette
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col items-center justify-center p-3 sm:p-4 gap-4">
      {/* Savings Info Section */}
      <Card className="w-full max-w-md mx-auto border-0 shadow-xl bg-white overflow-hidden ring-1 ring-slate-900/5 group">
        {/* Professional Header */}
        <div className="bg-slate-50 border-b border-slate-100 py-4 px-2">
          <h2 className="text-lg md:text-xl font-bold text-center text-slate-800 flex items-center justify-center gap-2 whitespace-nowrap">
            <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all duration-500">💰</span> How much this ebook saves you?
          </h2>
        </div>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {/* Item 1 */}
            <div className="p-3 hover:bg-emerald-50/30 transition-colors flex gap-2 items-start">
              <span className="text-emerald-700 font-bold text-xs mt-0.5">1.</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                You will save <span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">₹1500-2000</span> per project buying from outside.
              </p>
            </div>

            {/* Item 2 */}
            <div className="p-3 hover:bg-emerald-50/30 transition-colors flex gap-2 items-start">
              <span className="text-emerald-700 font-bold text-xs mt-0.5">2.</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                You will save <span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">₹5k - 10k</span> on outside meaningless courses.
              </p>
            </div>

            {/* High Impact Item 3 */}
            <div className="p-3 bg-gradient-to-r from-emerald-50/50 to-transparent flex gap-2 items-start relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
              <span className="text-emerald-800 font-bold text-xs mt-0.5 relative z-10">3.</span>
              <p className="text-slate-700 text-xs font-medium leading-relaxed relative z-10">
                Mainly you will save every penny that you spent on <span className="text-emerald-800 font-extrabold underline decoration-emerald-300 decoration-2 underline-offset-2">19 yrs of education</span>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center px-4 py-3">
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
            Complete Your Purchase
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 px-4 pb-4">
          {/* People Purchased Counter - Right below heading */}
          <PurchaseCounter />
          {/* Theater Marquee Frame for Ebook Cover */}
          <div className="flex justify-center py-6">
            <div className="relative max-w-[200px] mx-auto">
              {/* Brown/Red Border Frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-800 via-red-900 to-amber-900 rounded-xl shadow-xl" style={{ margin: '-16px', padding: '16px', border: '3px solid #92400e' }}>
                {/* Inner accent border */}
                <div className="absolute inset-0 border border-amber-600 rounded-lg" style={{ margin: '8px' }}></div>
              </div>

              {/* Yellow Glowing Bulbs */}
              {/* Top bulbs */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`top-${i}`}
                  className="absolute w-2.5 h-2.5 rounded-full"
                  style={{
                    top: '-12px',
                    left: `${(i + 0.5) * 12.5}%`,
                    backgroundColor: '#fbbf24',
                    boxShadow: '0 0 15px 4px rgba(251, 191, 36, 0.9), inset 0 0 6px rgba(255, 255, 255, 0.6)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.08}s`,
                    border: '1.5px solid #f59e0b'
                  }}
                ></div>
              ))}

              {/* Bottom bulbs */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`bottom-${i}`}
                  className="absolute w-2.5 h-2.5 rounded-full"
                  style={{
                    bottom: '-12px',
                    left: `${(i + 0.5) * 12.5}%`,
                    backgroundColor: '#fbbf24',
                    boxShadow: '0 0 15px 4px rgba(251, 191, 36, 0.9), inset 0 0 6px rgba(255, 255, 255, 0.6)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.08 + 0.04}s`,
                    border: '1.5px solid #f59e0b'
                  }}
                ></div>
              ))}

              {/* Left bulbs */}
              {[...Array(10)].map((_, i) => (
                <div
                  key={`left-${i}`}
                  className="absolute w-2.5 h-2.5 rounded-full"
                  style={{
                    left: '-12px',
                    top: `${(i + 0.5) * 10}%`,
                    backgroundColor: '#fbbf24',
                    boxShadow: '0 0 15px 4px rgba(251, 191, 36, 0.9), inset 0 0 6px rgba(255, 255, 255, 0.6)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.08 + 0.08}s`,
                    border: '1.5px solid #f59e0b'
                  }}
                ></div>
              ))}

              {/* Right bulbs */}
              {[...Array(10)].map((_, i) => (
                <div
                  key={`right-${i}`}
                  className="absolute w-2.5 h-2.5 rounded-full"
                  style={{
                    right: '-12px',
                    top: `${(i + 0.5) * 10}%`,
                    backgroundColor: '#fbbf24',
                    boxShadow: '0 0 15px 4px rgba(251, 191, 36, 0.9), inset 0 0 6px rgba(255, 255, 255, 0.6)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.08 + 0.12}s`,
                    border: '1.5px solid #f59e0b'
                  }}
                ></div>
              ))}

              {/* Image */}
              <div className="relative z-10 p-0.5">
                <img
                  src={ebookCover}
                  alt="MemeCode Ebook Cover"
                  className="rounded-lg w-full max-w-[200px] h-auto"
                />
              </div>
            </div>
          </div>

          {/* Slots Left Counter - Above coupon */}
          <SlotsCounter />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom padding to prevent content overlap with fixed bar */}
      <div className="h-20 md:h-0"></div>

      {/* Fixed Bottom Bar - Mobile First Design */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-50 md:relative md:max-w-md md:mx-auto md:mt-4 md:rounded-xl md:border md:shadow-xl">
        <div className="flex items-center justify-between px-3 py-3 gap-2">
          {/* Struck-through Original Price - White Box Style (same size as Buy button) */}
          <div className="flex-shrink-0">
            <div className="relative bg-white border-2 border-slate-200 rounded-lg px-5 h-10 shadow-sm min-w-[110px] flex items-center justify-center">
              <span className="relative inline-block text-lg font-bold text-slate-500">
                <span className="relative z-10">₹1999</span>
                {/* Animated Strike-through Line - Infinite Loop */}
                <span
                  className="absolute left-0 top-1/2 h-0.5 bg-red-500 -translate-y-1/2"
                  style={{
                    animation: 'strikeThrough 2s ease-in-out infinite',
                  }}
                ></span>
              </span>
            </div>
          </div>

          {/* 1hr Deal - Subtle Urgency Indicator (supports CTA, doesn't compete) */}
          <div className="flex-shrink-0 opacity-50">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">1hr Deal</span>
            </div>
          </div>

          {/* Buy @ 399 Button */}
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="flex-shrink-0 px-5 py-2.5 text-base font-bold group relative overflow-hidden shine-button rounded-lg min-w-[110px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-sm">Processing...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">Buy @ ₹399</span>
                {/* Shining effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out shine-overlay"></div>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Strikethrough Animation Keyframes - Infinite Loop */}
      <style>{`
        @keyframes strikeThrough {
          0% {
            width: 0%;
            left: 0;
          }
          50% {
            width: 100%;
            left: 0;
          }
          51% {
            width: 100%;
            left: 0;
          }
          100% {
            width: 0%;
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;
