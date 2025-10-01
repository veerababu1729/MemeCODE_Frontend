import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Shield, CheckCircle, Clock, Tag, X } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  
  // Price calculation
  const originalPrice = 199900; // ₹1999 in paise
  const discountedPrice = 9900; // ₹99 in paise
  const currentPrice = couponApplied ? discountedPrice : originalPrice;
  const currentPriceDisplay = couponApplied ? '₹99' : '₹1999';

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCouponApply = () => {
    setCouponError('');
    
    if (couponCode.trim().toLowerCase() === 'dasara') {
      setCouponApplied(true);
      setShowCouponInput(false);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleCouponRemove = () => {
    setCouponApplied(false);
    setCouponCode('');
    setCouponError('');
  };

  const handlePaymentSuccess = (orderId: string) => {
    // Handle successful payment - redirect to registration
    console.log('Payment successful:', orderId);
    alert('Payment successful! Redirecting to registration...');
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
        body: JSON.stringify({ amount: currentPrice }),
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
            Complete Your Purchase
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Get access to premium coding Ebook for {currentPriceDisplay}
          </CardDescription>
          <div className="text-center mt-2">
            <Button
              type="button"
              variant="link"
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Course Details */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 sm:p-4 rounded-lg border">
            <h3 className="font-semibold text-base sm:text-lg mb-2">MemeCode EBook</h3>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                <span>Learn Coding(in python) with memes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                <span>300+ projects for your resume</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                <span>Just 150-200 DSA Problems for coding interviews.</span>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {couponApplied && (
                <div className="text-lg sm:text-xl font-medium text-muted-foreground line-through">
                  ₹1999
                </div>
              )}
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {currentPriceDisplay}
              </div>
              {couponApplied && (
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  95% OFF
                </div>
              )}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">One-time payment</div>
          </div>

          {/* Coupon Section */}
          <div className="space-y-3">
            {/* Applied Coupon Display */}
            {couponApplied && (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">DASARA applied</span>
                  <span className="text-xs text-green-600">₹1900 saved!</span>
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
                  <div className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg p-3 mb-2 shadow-lg">
                    <p className="text-sm font-bold text-yellow-800 animate-bounce">
                      🎉 Apply coupon code "Dasara" to get at ₹99 🎉
                    </p>
                    
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="DASARA"
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
            className="w-full py-4 sm:py-6 text-base sm:text-lg font-semibold group relative overflow-hidden shine-button"
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

          {/* Timer */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-full shadow-sm">
              <Clock className={`w-3 h-3 sm:w-4 sm:h-4 ${timeRemaining <= 60 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`} />
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-orange-600 font-medium">Time remaining</span>
                <span 
                  className={`font-bold text-sm sm:text-lg ${
                    timeRemaining <= 60 ? 'text-red-700 animate-pulse' : 'text-orange-700'
                  }`}
                >
                  {formatTimer(timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground px-2">
            "One simple decision may turn the life"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
