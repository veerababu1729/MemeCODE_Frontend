import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';
import hero3d from '@/assets/hero-3d.jpg';

interface EntryPageProps {
  onGetStarted: () => void;
}

const EntryPage = ({ onGetStarted }: EntryPageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-hero flex items-center justify-center">
      {/* Background 3D Elements */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${hero3d})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-20 h-20 bg-primary/20 rounded-full animate-floating" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-32 w-16 h-16 bg-primary-glow/30 rounded-lg rotate-45 animate-floating" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-40 w-12 h-12 bg-primary-deep/25 rounded-full animate-floating" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-primary/30 rounded-full animate-floating" style={{ animationDelay: '0.5s' }} />
      </div>
      
      {/* Main Content */}
      <div className={`text-center z-10 px-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <img 
            src={logo} 
            alt="EE.Info Logo" 
            className="mx-auto w-32 h-32 drop-shadow-2xl hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        {/* Welcome Text */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 gradient-text leading-tight">
            Welcome to
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            EE.Info
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your coding journey with our comprehensive Python learning experience
          </p>
        </div>
        
        {/* Get Started Button */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={onGetStarted}
            className="hero-button text-xl px-12 py-6 shadow-floating hover:shadow-glow transform hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
        backgroundSize: '50px 50px'
      }} />
    </div>
  );
};

export default EntryPage;