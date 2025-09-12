import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';
import hero3d from '@/assets/hero-3d.jpg';
import shapes3d from '@/assets/3d-shapes.jpg';
import codingHologram from '@/assets/coding-hologram.jpg';

interface EntryPageProps {
  onGetStarted: () => void;
}

const EntryPage = ({ onGetStarted }: EntryPageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleGetStarted = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onGetStarted();
    }, 600);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-hero flex items-center justify-center transition-all duration-600 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Multiple Background Layers */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${shapes3d})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div 
        className="absolute top-0 right-0 w-1/2 h-full opacity-15"
        style={{
          backgroundImage: `url(${codingHologram})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
        }}
      />

      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-glow rounded-full animate-pulse-glow opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-accent rounded-full animate-pulse-glow opacity-40" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-glow/20 rounded-full animate-rotate-slow" />
      </div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-2xl rotate-12 animate-floating backdrop-blur-sm" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-32 w-24 h-24 bg-primary-glow/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-primary-deep/15 rounded-lg rotate-45 animate-floating" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-primary/20 rounded-full animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
        
        {/* Small particles */}
        <div className="absolute top-32 left-1/2 w-4 h-4 bg-primary-glow rounded-full animate-floating" style={{ animationDelay: '3s' }} />
        <div className="absolute top-3/4 left-1/4 w-3 h-3 bg-accent-foreground/60 rounded-full animate-bounce-gentle" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-primary/40 rounded-full animate-floating" style={{ animationDelay: '1.5s' }} />
      </div>
      
      {/* Main Content with Enhanced Animations */}
      <div className={`text-center z-10 px-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Logo with Glow Effect */}
        <div className="mb-8 animate-fade-in">
          <div className="relative">
            <img 
              src={logo} 
              alt="EE.Info Logo" 
              className="mx-auto w-36 h-36 drop-shadow-2xl hover:scale-110 transition-all duration-500 animate-pulse-glow relative z-10"
            />
            {/* Logo glow background */}
            <div className="absolute inset-0 w-36 h-36 mx-auto bg-primary-glow/30 rounded-full blur-xl animate-pulse-glow" />
          </div>
        </div>
        
        {/* Welcome Text with Staggered Animation */}
        <div className="mb-12 space-y-4">
          <h1 className={`text-7xl md:text-8xl font-bold gradient-text leading-tight transition-all duration-800 ${isLoaded ? 'animate-slide-in-left' : ''}`} style={{ animationDelay: '0.2s' }}>
            Welcome to
          </h1>
          <h2 className={`text-6xl md:text-7xl font-bold text-foreground mb-6 transition-all duration-800 ${isLoaded ? 'animate-slide-in-right' : ''}`} style={{ animationDelay: '0.4s' }}>
            EE.Info
          </h2>
          <p className={`text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-800 ${isLoaded ? 'animate-fade-in' : ''}`} style={{ animationDelay: '0.6s' }}>
            Transform your coding journey with our comprehensive Python learning experience. 
            <span className="block mt-2 text-lg text-accent-foreground">Join thousands who've mastered programming with us</span>
          </p>
        </div>
        
        {/* Enhanced Get Started Button */}
        <div className={`transition-all duration-800 ${isLoaded ? 'animate-slide-up' : ''}`} style={{ animationDelay: '0.8s' }}>
          <Button 
            onClick={handleGetStarted}
            disabled={isTransitioning}
            className="hero-button text-2xl px-16 py-8 shadow-floating hover:shadow-glow transform hover:scale-110 transition-all duration-500 relative group overflow-hidden"
          >
            <span className="relative z-10">
              {isTransitioning ? 'Loading...' : 'Get Started'}
            </span>
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>
        
        {/* Additional Elements */}
        <div className={`mt-12 flex justify-center space-x-8 transition-all duration-800 ${isLoaded ? 'animate-fade-in' : ''}`} style={{ animationDelay: '1s' }}>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">300+</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-glow">21</div>
            <div className="text-sm text-muted-foreground">Days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-foreground">DSA</div>
            <div className="text-sm text-muted-foreground">Problems</div>
          </div>
        </div>
      </div>
      
      {/* Dynamic grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.6) 2px, transparent 0)',
        backgroundSize: '60px 60px',
        animation: 'float 10s ease-in-out infinite'
      }} />
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")'
      }} />
    </div>
  );
};

export default EntryPage;