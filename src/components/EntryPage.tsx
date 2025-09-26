import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import matrixImage from '@/assets/matrix.png';
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
      const orbCount = 2; // Further reduced from 8 to 4 for minimal distraction
      const newOrbs = Array.from({ length: orbCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 8, // Increased delay range for much slower appearance
        size: 0.1 + Math.random() * 0.0, // Much smaller sizes
      }));
      setOrbs(newOrbs);
    };

    generateOrbs();
    const interval = setInterval(generateOrbs, 12000); // Much less frequent regeneration (increased from 8000 to 12000)
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
            opacity: 0.1, // Much reduced opacity for minimal distraction
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
      
      {/* Matrix Image Section with Buttons */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center px-4">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-green-400 mb-4 md:mb-6 text-center drop-shadow-lg">Select One</h3>
        <div className="relative">
          {/* Matrix Image */}
          <img 
            src={matrixImage} 
            alt="Matrix Choice" 
            className="w-80 sm:w-90 md:w-80 lg:w-96 xl:w-[28rem] h-auto drop-shadow-2xl matrix-image-animated"
            style={{
              animation: 'matrix-pulse 3s ease-in-out infinite, matrix-float 6s ease-in-out infinite, matrix-shake 0.1s ease-in-out infinite'
            }}
          />
          
          {/* Left Hand Button - "Code Hard" */}
          <Button 
            className="absolute bg-red-600 hover:bg-red-700 text-white px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-bold shadow-lg hover:shadow-red-500/50 transition-all duration-300"
            style={{ 
              left: '4px',
              top: '60%',
              transform: 'translateY(-50%)'
            }}
            onClick={() => window.open('https://share.google/images/CpiHraFg1wk8kNLsd', '_blank')}
          >
            Code Hard
          </Button>
          
          {/* Right Hand Button - "Code with Memes" */}
          <Button 
            className="absolute bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-bold shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            style={{ 
              right: '4px',
              top: '60%',
              transform: 'translateY(-50%)'
            }}
            onClick={onGetStarted}
          >
            Code with Memes
          </Button>
        </div>
      </div>
      
    </div>
  );
};

export default EntryPage;
