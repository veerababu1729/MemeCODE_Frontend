import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Shield, CheckCircle, Clock, Tag, X } from 'lucide-react';
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

        const currentPurchases = parseInt(storedPurchases, 10) + elapsed;
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
    <div className="p-1">
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
  const originalPrice = 199900; // ₹1999 in paise
  const currentPrice = couponApplied ? Math.max(0, originalPrice - discountAmount) : originalPrice;
  const currentPriceDisplay = `₹${Math.round(currentPrice / 100)}`;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create order with current price
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

      const orderData = await response.json();

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
      <Card className="w-full max-w-md mx-auto bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-3xl -mr-12 -mt-12 opacity-50"></div>
        <CardContent className="p-5 space-y-4 relative z-10">
          <h2 className="text-xl font-extrabold text-center text-emerald-800 flex items-center justify-center gap-2 font-display tracking-tight">
            <span className="text-2xl filter drop-shadow-sm">💰</span> How much this ebook saves you?
          </h2>
          <ul className="space-y-3 font-medium">
            <li className="flex items-start gap-3 bg-white/60 p-2.5 rounded-lg border border-emerald-100/50 shadow-sm hover:shadow-md transition-shadow">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 text-sm leading-relaxed">
                You will save <span className="font-bold text-emerald-700">₹1500-2000</span> per project buying from outside.
              </span>
            </li>
            <li className="flex items-start gap-3 bg-white/60 p-2.5 rounded-lg border border-emerald-100/50 shadow-sm hover:shadow-md transition-shadow">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 text-sm leading-relaxed">
                You will save <span className="font-bold text-emerald-700">₹5k - 10k</span> on outside meaningless courses.
              </span>
            </li>
            <li className="flex items-start gap-3 bg-emerald-100/50 p-2.5 rounded-lg border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-800 text-sm font-semibold leading-relaxed">
                Mainly you will save your whole career and meaning of your <span className="text-emerald-800 font-extrabold border-b-2 border-emerald-300">19 yrs of education</span>.
              </span>
            </li>
          </ul>
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

          <a
            href="https://drive.google.com/file/d/1NZBvjLi71kS7lo9O_fEB4d4-mLEORJbO/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-center text-sky-500 font-semibold px-2 hover:text-sky-700 transition-colors underline block"
          >
            I need a demo before buying
          </a>

          {/* Slots Left Counter - Above coupon */}
          <SlotsCounter />

          {/* Coupon Section */}
          <div className="space-y-2">
            {/* Applied Coupon Display */}
            {couponApplied && (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">{validCouponCode} applied</span>
                  <span className="text-xs text-green-600">₹{Math.round(discountAmount / 100)} saved!</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCouponRemove}
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Coupon Input */}
            {!couponApplied && (
              <div className="space-y-2">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg p-2 mb-1 shadow-lg">
                    <p className="text-sm font-bold text-yellow-800 animate-bounce whitespace-nowrap">
                      🎉Apply coupon code to get discount🎉
                    </p>

                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="BTECH"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleCouponApply()}
                  />
                  <Button
                    onClick={handleCouponApply}
                    size="sm"
                    className="px-4 py-2 text-sm"
                    disabled={!couponCode.trim()}
                  >
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <div className="text-xs text-red-600 text-center">{couponError}</div>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Payment Button with shining effect */}
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-3 text-base font-semibold group relative overflow-hidden shine-button"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                Pay {currentPriceDisplay} Now
                {/* Shining effect overlay */}
                <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out shine-overlay"></div>
              </>
            )}
          </Button>



          <p
            className="text-xs text-right text-primary font-semibold px-2 cursor-pointer hover:text-primary/80 transition-colors underline"
            onClick={() => navigate('/slotbookingpage')}
          >
            I want to reserve my slot
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
