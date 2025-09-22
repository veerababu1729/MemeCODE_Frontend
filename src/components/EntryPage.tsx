import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Code2, Cpu, Database, Terminal, Braces, CircuitBoard } from 'lucide-react';
import logo from '@/assets/logo.png';
import coverpage from '@assets/coverpage.png';

interface EntryPageProps {
  onGetStarted: () => void;
}

// Matrix Digital Rain Component
const MatrixRain = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<number[]>([]);

  useEffect(() => {
    const generateColumns = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const columnWidth = 8; // Much smaller width for higher density
        const numColumns = Math.floor(containerWidth / columnWidth);
        setColumns(Array.from({ length: numColumns }, (_, i) => i));
      }
    };

    generateColumns();
    window.addEventListener('resize', generateColumns);
    return () => window.removeEventListener('resize', generateColumns);
  }, []);

  const generateBinaryString = (length: number) => {
    // Create more varied binary patterns with different characters
    const chars = ['0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1'];
    return Array.from({ length }, () => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      // Add some variation with different characters occasionally
      if (Math.random() < 0.1) {
        return Math.random() > 0.5 ? '1' : '0';
      }
      return char;
    }).join('\n');
  };

  return (
    <div ref={containerRef} className="matrix-rain">
      {columns.map((_, index) => (
        <div
          key={index}
          className="matrix-column"
          style={{
            left: `${index * 8}px`,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 3}s`,
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
      const orbCount = 8; // Reduced from 25 to 8 for less distraction
      const newOrbs = Array.from({ length: orbCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5, // Increased delay range for slower appearance
        size: 0.6 + Math.random() * 0.3, // Smaller sizes
      }));
      setOrbs(newOrbs);
    };

    generateOrbs();
    const interval = setInterval(generateOrbs, 8000); // Much less frequent regeneration (doubled from 4000 to 8000)
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
            opacity: 0.4, // Reduced opacity for less intensity
          }}
        />
      ))}
    </div>
  );
};

// Hacker Data Streams Component
const HackerDataStreams = () => {
  const [streams, setStreams] = useState<Array<{ id: number; x: number; y: number; delay: number; text: string }>>([]);

  useEffect(() => {
    const generateStreams = () => {
      const streamCount = 8;
      const hackerTexts = [
        'ACCESS GRANTED',
        'INITIALIZING...',
        'CONNECTING...',
        'DATA TRANSFER',
        'SECURITY BREACH',
        'SYSTEM ONLINE',
        'PROTOCOL ACTIVE',
        'NETWORK SCAN',
        'ENCRYPTION KEY',
        'FIREWALL BYPASS'
      ];
      
      const newStreams = Array.from({ length: streamCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        text: hackerTexts[Math.floor(Math.random() * hackerTexts.length)]
      }));
      setStreams(newStreams);
    };

    generateStreams();
    const interval = setInterval(generateStreams, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-3">
      {streams.map((stream) => (
        <div
          key={stream.id}
          className="absolute text-green-400 text-xs font-mono opacity-60"
          style={{
            left: `${stream.x}%`,
            top: `${stream.y}%`,
            animation: `fade-in-out 2s ease-in-out ${stream.delay}s infinite`,
            textShadow: '0 0 5px #00ff00'
          }}
        >
          {stream.text}
        </div>
      ))}
    </div>
  );
};

const EntryPage = ({ onGetStarted }: EntryPageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex items-center">
      {/* Matrix Digital Rain Background */}
      <div className="cse-bg absolute inset-0">
        <div className="terminal-grid" />
        <MatrixOrbs />
        <HackerDataStreams />
        <div className="hacker-lines" />
        <div className="crt-scanlines" />
        <div className="glitch-effect" />
        <div className="matrix-overlay" />
      </div>
      
      
      {/* Content + 3D layout */}
      <div className={`relative z-20 w-full max-w-6xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Left: Text */}
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <img 
              src={logo} 
              alt="EE.Info Logo" 
              className="mx-auto w-32 h-32 drop-shadow-2xl hover:scale-110 transition-transform duration-300"
            />
          </div>
          {/* Welcome Text */}
          <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white leading-tight drop-shadow-lg">Welcome to</h1>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">EE.Info</h2>
            <p className="text-xl md:text-2xl text-green-300 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">"Elantivi ante naku baga interest ra!"</p>
          </div>
          {/* Get Started Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              onClick={onGetStarted}
              className="hero-button text-xl px-12 py-6 shadow-floating hover:shadow-glow transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Right: 3D CS-Themed Cube */}
        <div className="flex items-center justify-center pointer-events-none">
          <div className="cube-scene">
            <div className="cube">
              <div className="cube-face cube-face--front"><Code2 className="w-10 h-10" /></div>
              <div className="cube-face cube-face--back"><Terminal className="w-10 h-10" /></div>
              <div className="cube-face cube-face--right"><Cpu className="w-10 h-10" /></div>
              <div className="cube-face cube-face--left"><Database className="w-10 h-10" /></div>
              <div className="cube-face cube-face--top"><Braces className="w-10 h-10" /></div>
              <div className="cube-face cube-face--bottom"><CircuitBoard className="w-10 h-10" /></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Slight dim overlay on small screens for contrast */}
      <div className="absolute inset-0 md:hidden bg-background/40" />
    </div>
  );
};

export default EntryPage;