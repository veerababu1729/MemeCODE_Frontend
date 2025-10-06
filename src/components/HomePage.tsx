import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentSection from './PaymentSection';
import ReviewsSection from './ReviewsSection';
import FAQSection from './FAQSection';
import { useState, useEffect, useRef } from 'react';
import matrixImage from '@/assets/matrix.png';
import pythonIllustration from '@/assets/coverpage.png';

// Matrix Digital Rain Component
const MatrixRain = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<number[]>([]);

  useEffect(() => {
    const generateColumns = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const columnWidth = 12;
        const numColumns = Math.floor(containerWidth / columnWidth);
        setColumns(Array.from({ length: numColumns }, (_, i) => i));
      }
    };

    generateColumns();
    window.addEventListener('resize', generateColumns);
    return () => window.removeEventListener('resize', generateColumns);
  }, []);

  const generateBinaryString = (length: number) => {
    const chars = ['0', '1'];
    return Array.from({ length }, () => {
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('\n');
  };

  return (
    <div ref={containerRef} className="matrix-rain">
      {columns.map((_, index) => (
        <div
          key={index}
          className="matrix-column"
          style={{
            left: `${index * 12}px`,
            animationDuration: `${8 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        >
          {generateBinaryString(50 + Math.floor(Math.random() * 30))}
        </div>
      ))}
    </div>
  );
};

// Matrix Orbs Component
const MatrixOrbs = () => {
  const [orbs, setOrbs] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    const generateOrbs = () => {
      const orbCount = 6;
      const newOrbs = Array.from({ length: orbCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        size: 0.6 + Math.random() * 0.3,
      }));
      setOrbs(newOrbs);
    };

    generateOrbs();
    const interval = setInterval(generateOrbs, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="matrix-orbs">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="matrix-orb"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            animationDelay: `${orb.delay}s`,
            transform: `scale(${orb.size})`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
};

const HomePage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const imageObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (imageRef.current) {
      imageObserver.observe(imageRef.current);
    }

    return () => {
      imageObserver.disconnect();
    };
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

      {/* Matrix Image Section - Above Reviews */}
      <section className="py-8 px-4 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
        {/* Matrix Digital Rain Background - Only behind image */}
        <div className="absolute inset-0 cse-bg">
          <div className="terminal-grid" />
          <MatrixRain />
          <MatrixOrbs />
          <div className="hacker-lines" />
          <div className="crt-scanlines" />
          <div className="glitch-effect" />
          <div className="matrix-overlay" />
        </div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-col items-center relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-green-600 mb-0">Select One</h3>
          <div className="relative w-full flex justify-center md:justify-center">
            {/* Matrix Image */}
            <div className="relative">
              <img 
                src={matrixImage} 
                alt="Matrix Choice" 
                className="w-64 md:w-80 lg:w-96 xl:w-[28rem] h-auto drop-shadow-2xl matrix-image-animated"
              />
              
              {/* Left Hand Button - "Struggle?" */}
              <Button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-bold shadow-lg hover:shadow-red-500/50 transition-all duration-300"
                style={{ 
                  left: '20px',
                  top: '60%',
                  transform: 'translateY(-50%)'
                }}
                onClick={() => window.open('https://share.google/images/Jvq49TzWsamUJ4cjd', '_blank')}
              >
                Struggle?
              </Button>
              
              {/* Right Hand Button - "Start with 99" */}
              <Button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-bold shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                style={{ 
                  right: '20px',
                  top: '60%',
                  transform: 'translateY(-50%)'
                }}
                onClick={() => document.querySelector('#payment')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start with 99
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <PaymentSection />

      {/* Python Illustration Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-2xl md:max-w-xl lg:max-w-lg xl:max-w-md mx-auto flex justify-center">
          <div 
            ref={imageRef}
            className={`relative transition-all duration-600 ${imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} 
            style={{ transitionDelay: imageVisible ? '0.2s' : '0s' }}
          >
            <div className="coverpage-container">
              <img 
                src={pythonIllustration} 
                alt="Python Learning Illustration"
                className="rounded-xl shadow-floating w-full h-auto hover:scale-105 transition-transform duration-500 relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />
      
      
      
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Final CTA Section */}
      <section className="pt-20 pb-8 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="gradient-text"> Coding Journey?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who chose guidance over struggle. 
            Your coding success story starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-8 py-4 text-lg"
              onClick={() => window.open('https://drive.google.com/file/d/1RGkYFYlYIA-QG7RjAb1lhxp58h6_V9VF/view?usp=sharing', '_blank')}
            >
              Need Demo?
            </Button>
            
            <Button 
              className="hero-button text-lg px-8 py-4"
              onClick={() => document.querySelector('#payment')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Learning Today - ₹99
            </Button>
          </div>
        </div>
      </section>
      
      {/* Matrix-themed section at bottom */}
      <section className="pt-0 pb-16 px-4 bg-gradient-to-t from-background to-background/80">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="relative">
            {/* Matrix Image */}
            <div className="relative">
              <img 
                src={matrixImage} 
                alt="Matrix Choice" 
                className="w-64 md:w-80 lg:w-96 xl:w-[28rem] h-auto drop-shadow-2xl matrix-image-animated"
              />
              
              {/* Left Hand Button - "Need demo?" */}
              <Button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-bold shadow-lg hover:shadow-red-500/50 transition-all duration-300"
                style={{ 
                  left: '20px',
                  top: '60%',
                  transform: 'translateY(-50%)'
                }}
                onClick={() => window.open('https://share.google/images/Jvq49TzWsamUJ4cjd', '_blank')}
              >
                Struggle?
              </Button>
              
              {/* Right Hand Button - "Start with 99" */}
              <Button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-bold shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                style={{ 
                  right: '20px',
                  top: '60%',
                  transform: 'translateY(-50%)'
                }}
                onClick={() => document.querySelector('#payment')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start with 99
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background/80 border-t border-border/20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground/60">
            <a href="/contact" className="hover:text-muted-foreground/80 transition-colors">Contact Us</a>
            <span className="text-muted-foreground/40">•</span>
            <a href="/terms" className="hover:text-muted-foreground/80 transition-colors">Terms and Conditions</a>
            <span className="text-muted-foreground/40">•</span>
            <a href="/refunds" className="hover:text-muted-foreground/80 transition-colors">Cancellations and Refunds</a>
            <span className="text-muted-foreground/40">•</span>
            <a href="/privacy" className="hover:text-muted-foreground/80 transition-colors">Privacy Policy</a>
          </div>
          <div className="text-center mt-4 text-xs text-muted-foreground/50">
            © 2024 EE.Info - All rights reserved.
          </div>
        </div>
      </footer>

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