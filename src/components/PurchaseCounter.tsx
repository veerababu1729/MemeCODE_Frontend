import { useState, useEffect } from 'react';
import { Users, TrendingUp } from 'lucide-react';

interface PurchaseCounterProps {
  initialCount?: number;
  className?: string;
}

const PurchaseCounter = ({ initialCount = 1275, className = '' }: PurchaseCounterProps) => {
  // Get count from localStorage or use initial count
  const getStoredCount = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('purchaseCount');
      return stored ? parseInt(stored, 10) : initialCount;
    }
    return initialCount;
  };

  const [count, setCount] = useState(getStoredCount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Generate realistic increment intervals (between 5-10 seconds)
    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 5000;
    
    const incrementCounter = () => {
      setIsAnimating(true);
      setCount(prevCount => {
        const newCount = prevCount + 1;
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('purchaseCount', newCount.toString());
        }
        return newCount;
      });
      
      // Reset animation after 1 second
      setTimeout(() => setIsAnimating(false), 1000);
      
      // Schedule next increment
      setTimeout(incrementCounter, getRandomInterval());
    };

    // Start the first increment after initial delay
    const initialDelay = getRandomInterval();
    const timeoutId = setTimeout(incrementCounter, initialDelay);

    // Cleanup on unmount
    return () => clearTimeout(timeoutId);
  }, []);

  // Format number with commas for better readability
  const formatCount = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full shadow-sm ${className}`}>
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <Users className="w-4 h-4 text-green-600" />
          {isAnimating && (
            <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75" />
          )}
        </div>
        <TrendingUp className="w-3 h-3 text-green-500" />
      </div>
      
      <div className="flex items-center gap-1">
        <span 
          className={`font-semibold text-green-700 transition-all duration-300 ${
            isAnimating ? 'scale-110 text-green-800' : ''
          }`}
        >
          {formatCount(count)}
        </span>
        <span className="text-sm text-green-600 font-medium">
          people purchased
        </span>
      </div>
      
      {isAnimating && (
        <div className="flex items-center gap-1 animate-bounce">
          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
          <div className="w-1 h-1 bg-green-500 rounded-full animation-delay-100"></div>
          <div className="w-1 h-1 bg-green-500 rounded-full animation-delay-200"></div>
        </div>
      )}
    </div>
  );
};

export default PurchaseCounter;
