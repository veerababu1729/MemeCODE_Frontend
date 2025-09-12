import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentSection from './PaymentSection';
import ReviewsSection from './ReviewsSection';
import FeaturesSection from './FeaturesSection';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Quote Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-8">
              "BTech / Degree people fail not due to lack of talent.
              <br />
              <span className="gradient-text">It's lack of guidance.</span>
              <br />
              You will get that here."
            </blockquote>
            <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full" />
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <PaymentSection />
      
      {/* Reviews Section */}
      <ReviewsSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="gradient-text"> Coding Journey?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who chose guidance over struggle. 
            Your coding success story starts here.
          </p>
          <Button 
            className="hero-button text-lg px-8 py-4"
            onClick={() => document.querySelector('#payment')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Learning Today - ₹99
          </Button>
        </div>
      </section>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary-deep shadow-floating hover:shadow-glow transition-all duration-300 z-50"
          size="icon"
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default HomePage;