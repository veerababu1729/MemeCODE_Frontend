import { Check, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CountdownTimer from './CountdownTimer';

const PaymentSection = () => {
  const benefits = [
    "Python in 21 Days Complete Course",
    "300+ Projects with Source Code", 
    "Curated DSA Sheet (150-250 Problems)",
    "Telugu Memes & Fun Learning",
    "Lifetime Access",
    "Community Support"
  ];

  return (
    <section id="payment" className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Limited Time <span className="gradient-text">Special Offer</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Get everything you need to master Python and land your dream job
          </p>
        </div>
        
        {/* Countdown Timer */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <p className="text-lg font-semibold text-foreground mb-2">Offer expires in:</p>
          </div>
          <CountdownTimer />
        </div>
        
        {/* Pricing Card */}
        <Card className="glass-card p-8 shadow-floating hover:shadow-glow transition-all duration-300 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-3xl text-muted-foreground line-through">₹1999</span>
              <span className="text-6xl font-bold gradient-text">₹99</span>
            </div>
            <p className="text-lg text-muted-foreground">One-time payment • Lifetime access</p>
          </div>
          
          {/* Benefits List */}
          <div className="space-y-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
          
          {/* Payment Button */}
          <Button className="w-full hero-button text-lg py-4 group">
            <CreditCard className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Get Instant Access - Pay ₹99
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>95% off</strong> • Secure payment • No hidden charges
            </p>
          </div>
        </Card>
        
        {/* Trust badges */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            🔒 Secure Payment • 💯 Money Back Guarantee • ⚡ Instant Access
          </p>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;