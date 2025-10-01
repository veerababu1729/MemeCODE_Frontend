import { Check, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CountdownTimer from './CountdownTimer';
import PurchaseCounter from './PurchaseCounter';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentFlow from './PaymentFlow';
import AuthenticationFlow from './AuthenticationFlow';
import coverImage from '@/assets/coverpage.png';

const PaymentSection = () => {
  const navigate = useNavigate();
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [showLoginFlow, setShowLoginFlow] = useState(false);
  
  // Check URL parameters to auto-show login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showLogin') === 'true') {
      setShowLoginFlow(true);
      // Clean up URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  const benefits = [
    "Learn Coding (in python) with memes in just 21 days.",
    "300+ Free Resume Projects.", 
    "DSA Sheet (only 150-250 Problems)",
    "Telugu Memes & Fun Learning.",
    "Community & Mentor Support."
  ];

  const handlePaymentClick = () => {
    // Navigate directly to payment page
    navigate('/payment');
  };

  const handlePaymentComplete = () => {
    setShowPaymentFlow(false);
  };

  const handleLoginComplete = () => {
    setShowLoginFlow(false);
  };

  if (showPaymentFlow) {
    return <PaymentFlow onComplete={handlePaymentComplete} />;
  }

  if (showLoginFlow) {
    return <AuthenticationFlow onComplete={handleLoginComplete} />;
  }

  return (
    <section id="payment" className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        {/* Single boxed card containing the whole payment section */}
        <Card className="glass-card p-6 md:p-10 lg:p-14 xl:p-16 shadow-floating hover:shadow-glow transition-all duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              <span>Limited Time Offer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Dasara Special Price:
            </h2>
            <p className="text-sm text-muted-foreground">After timer ends, price = ₹1,999/-</p>
          </div>

          {/* Countdown Timer inside the card */}
          <div className="mb-10">
            <CountdownTimer />
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="text-2xl text-muted-foreground line-through">₹1999</span>
              <span className="text-5xl md:text-6xl font-bold gradient-text">₹99</span>
            </div>
            <p className="text-sm text-muted-foreground">One payment • Lifetime access</p>
          </div>

          {/* Purchase Counter for Social Proof */}
          <div className="flex justify-center mb-8">
            <PurchaseCounter />
          </div>

          {/* Cover Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="coverpage-container w-fit">
                <img 
                  src={coverImage} 
                  alt="Python in 21 Days Ebook Cover" 
                  className="w-48 md:w-56 lg:w-64 xl:w-72 h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative z-10"
                />
              </div>
              {/* Optional glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Ultra-Enhanced Payment Button with maximum sparkle effects */}
          <Button 
            onClick={handlePaymentClick}
            className="w-full text-lg sm:text-xl md:text-2xl py-6 sm:py-7 md:py-8 px-6 sm:px-8 group bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-black font-bold relative overflow-hidden shadow-2xl hover:shadow-green-500/60 transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 rounded-xl border-2 border-green-400/40 animate-pulse hover:animate-none"
          >
            {/* Continuous sparkle background */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-300"></div>
              <div className="absolute bottom-3 left-8 w-1 h-1 bg-yellow-200 rounded-full animate-ping animation-delay-500"></div>
              <div className="absolute bottom-5 right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse animation-delay-700"></div>
              <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-1000"></div>
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-1200"></div>
              <div className="absolute top-6 left-1/2 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-ping animation-delay-200"></div>
              <div className="absolute bottom-6 right-1/2 w-0.5 h-0.5 bg-white rounded-full animate-pulse animation-delay-800"></div>
              <div className="absolute top-1/4 left-6 w-0.5 h-0.5 bg-yellow-200 rounded-full animate-ping animation-delay-600"></div>
              <div className="absolute bottom-1/4 right-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse animation-delay-400"></div>
            </div>
            
            {/* Double shining sweep effect */}
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-in-out"></div>
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-in-out animation-delay-200"></div>
            
            {/* Pulsing border with glow */}
            <div className="absolute inset-0 rounded-xl border-2 border-white/30 group-hover:border-yellow-300/60 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_30px_rgba(255,235,59,0.5)]"></div>
            
            {/* Rotating sparkle ring */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute -top-1 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-spin"></div>
              <div className="absolute -top-1 right-1/4 w-1 h-1 bg-white rounded-full animate-spin animation-delay-500"></div>
              <div className="absolute -bottom-1 left-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-spin animation-delay-300"></div>
              <div className="absolute -bottom-1 right-1/3 w-1 h-1 bg-white rounded-full animate-spin animation-delay-700"></div>
            </div>
            
            {/* Button content with enhanced effects */}
            <div className="relative flex items-center justify-center gap-2 sm:gap-3">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              <span className="tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(255,235,59,0.6)]">Get My Ebook Now</span>
              
              {/* Multiple floating sparkles */}
              <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300"></div>
              <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 animation-delay-200"></div>
              <div className="absolute -bottom-2 -right-1 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 animation-delay-400"></div>
            </div>
            
            {/* Enhanced bottom glow with sparkle trail */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4/5 h-2 bg-green-400/60 blur-sm group-hover:bg-yellow-300/80 group-hover:h-3 transition-all duration-300"></div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-white/50 blur-sm group-hover:bg-yellow-200/70 transition-all duration-300"></div>
          </Button>

          {/* Login link for existing users */}
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already purchased? 
              <button 
                className="text-blue-600 hover:text-blue-800 underline ml-1 font-medium transition-colors"
                onClick={() => navigate('/login')}
              >
                Login here
              </button>
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PaymentSection;