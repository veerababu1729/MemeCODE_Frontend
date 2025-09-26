import { Check, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CountdownTimer from './CountdownTimer';
import PurchaseCounter from './PurchaseCounter';
import { useState } from 'react';
import PaymentFlow from './PaymentFlow';
import AuthenticationFlow from './AuthenticationFlow';
import coverImage from '@/assets/coverpage.png';

const PaymentSection = () => {
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [showLoginFlow, setShowLoginFlow] = useState(false);
  
  const benefits = [
    "Learn Coding (in python) with memes in just 21 days.",
    "300+ Free Resume Projects.", 
    "DSA Sheet (only 150-250 Problems)",
    "Telugu Memes & Fun Learning.",
    "Community & Mentor Support."
  ];

  const handlePaymentClick = () => {
    setShowPaymentFlow(true);
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
      <div className="max-w-3xl mx-auto">
        {/* Single boxed card containing the whole payment section */}
        <Card className="glass-card p-8 md:p-10 shadow-floating hover:shadow-glow transition-all duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              <span>Limited Time Offer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Dasara Special Price Ends In:
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
            <p className="text-base md:text-lg text-muted-foreground">One payment • Lifetime access</p>
          </div>

          {/* Purchase Counter for Social Proof */}
          <div className="flex justify-center mb-8">
            <PurchaseCounter />
          </div>

          {/* Cover Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src={coverImage} 
                alt="Python in 21 Days Ebook Cover" 
                className="w-48 h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              {/* Optional glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Payment Button (green) with shining effect */}
          <Button 
            onClick={handlePaymentClick}
            className="w-full text-xl md:text-2xl py-5 md:py-6 group bg-green-600 hover:bg-green-700 text-white relative overflow-hidden shine-button"
          >
            <CreditCard className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Get My Ebook Now
            {/* Shining effect overlay */}
            <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out shine-overlay"></div>
          </Button>

          {/* Login link for existing users */}
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already purchased? 
              <button 
                className="text-blue-600 hover:text-blue-800 underline ml-1 font-medium transition-colors"
                onClick={() => setShowLoginFlow(true)}
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