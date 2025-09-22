import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
}

interface ConfettiAnimationProps {
  isActive: boolean;
  duration?: number;
}

const ConfettiAnimation = ({ isActive, duration = 5000 }: ConfettiAnimationProps) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#FFD700', '#FF69B4', '#00CED1', '#32CD32', '#FF4500'
  ];

  const createConfettiPiece = (id: number, burst: boolean = false): ConfettiPiece => {
    // Ensure we have valid dimensions
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 3;
    
    return {
      id,
      x: burst ? centerX + (Math.random() - 0.5) * 400 : Math.random() * screenWidth,
      y: burst ? centerY + (Math.random() - 0.5) * 200 : -50,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: burst ? Math.random() * 20 + 10 : Math.random() * 12 + 8,
      velocityX: burst ? (Math.random() - 0.5) * 25 : (Math.random() - 0.5) * 8,
      velocityY: burst ? (Math.random() - 0.5) * 25 - 10 : Math.random() * 6 + 4,
      rotationSpeed: (Math.random() - 0.5) * 25,
    };
  };

  useEffect(() => {
    if (isActive) {
      console.log('🎉 Confetti animation starting!');
      console.log('📊 Window dimensions:', window.innerWidth, 'x', window.innerHeight);
      setIsVisible(true);
      
      // Create dramatic burst effect - multiple waves
      const burstConfetti = Array.from({ length: 150 }, (_, i) => createConfettiPiece(i, true));
      const fallConfetti = Array.from({ length: 100 }, (_, i) => createConfettiPiece(i + 150, false));
      
      console.log('🎊 Created confetti pieces:', burstConfetti.length + fallConfetti.length);
      setConfetti([...burstConfetti, ...fallConfetti]);

      // Add more bursts at intervals for dramatic effect
      const burstTimeouts = [
        setTimeout(() => {
          setConfetti(prev => [...prev, ...Array.from({ length: 80 }, (_, i) => createConfettiPiece(i + 300, true))]);
        }, 300),
        setTimeout(() => {
          setConfetti(prev => [...prev, ...Array.from({ length: 60 }, (_, i) => createConfettiPiece(i + 400, true))]);
        }, 600),
      ];

      // Animation loop with better performance
      const animationInterval = setInterval(() => {
        setConfetti(prevConfetti => {
          if (prevConfetti.length === 0) return prevConfetti;
          
          const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
          const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
          
          return prevConfetti.map(piece => ({
            ...piece,
            x: piece.x + piece.velocityX,
            y: piece.y + piece.velocityY,
            rotation: piece.rotation + piece.rotationSpeed,
            velocityY: piece.velocityY + 0.2, // stronger gravity
            velocityX: piece.velocityX * 0.98, // air resistance
          })).filter(piece => 
            piece.y < screenHeight + 100 && 
            piece.x > -100 && 
            piece.x < screenWidth + 100
          );
        });
      }, 16); // ~60fps

      // Stop animation after duration
      const timeout = setTimeout(() => {
        clearInterval(animationInterval);
        setIsVisible(false);
        setConfetti([]);
      }, duration);

      return () => {
        clearInterval(animationInterval);
        clearTimeout(timeout);
        burstTimeouts.forEach(clearTimeout);
      };
    }
  }, [isActive, duration]);

  if (!isVisible || confetti.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden" 
      style={{ zIndex: 10000 }}
    >
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute will-change-transform confetti-piece"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            width: `${piece.size}px`,
            height: `${piece.size * 1.2}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: piece.id % 3 === 0 ? '50%' : piece.id % 2 === 0 ? '4px' : '2px',
            opacity: 0.9,
            background: `linear-gradient(135deg, ${piece.color}, ${piece.color}dd)`,
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: `0 2px 8px rgba(0,0,0,0.3), 0 0 15px ${piece.color}40`,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiAnimation;
