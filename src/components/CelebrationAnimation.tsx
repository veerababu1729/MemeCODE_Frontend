import { useState, useEffect } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  type: 'star' | 'confetti' | 'streamer';
  delay: number;
  duration: number;
  size: number;
  side: 'left' | 'right' | 'center';
}

interface CelebrationAnimationProps {
  isActive: boolean;
  duration?: number;
}

const CelebrationAnimation = ({ isActive, duration = 8000 }: CelebrationAnimationProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Golden/Orange color palette like the reference image
  const colors = [
    '#FFD700', // Gold
    '#FFA500', // Orange
    '#FFB347', // Light Orange
    '#FFCC00', // Yellow Gold
    '#FF8C00', // Dark Orange
    '#FFE135', // Banana Yellow
    '#F4A460', // Sandy Brown
    '#DAA520', // Goldenrod
  ];

  useEffect(() => {
    if (!isActive) return;

    setIsVisible(true);

    const newPieces: ConfettiPiece[] = [];

    // Stars - burst from bottom corners
    for (let i = 0; i < 30; i++) {
      const side = i % 2 === 0 ? 'left' : 'right';
      newPieces.push({
        id: i,
        x: side === 'left' ? 10 + Math.random() * 30 : 60 + Math.random() * 30,
        y: 100,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'star',
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1.5,
        size: 0.5 + Math.random() * 0.5,
        side,
      });
    }

    // Small confetti pieces
    for (let i = 30; i < 80; i++) {
      const side = Math.random() > 0.5 ? 'left' : 'right';
      newPieces.push({
        id: i,
        x: side === 'left' ? 5 + Math.random() * 40 : 55 + Math.random() * 40,
        y: 100,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'confetti',
        delay: Math.random() * 0.8,
        duration: 2.5 + Math.random() * 2,
        size: 0.4 + Math.random() * 0.4,
        side,
      });
    }

    // Golden streamers
    for (let i = 80; i < 100; i++) {
      const side = i % 2 === 0 ? 'left' : 'right';
      newPieces.push({
        id: i,
        x: side === 'left' ? 15 + Math.random() * 25 : 60 + Math.random() * 25,
        y: 100,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'streamer',
        delay: Math.random() * 0.3,
        duration: 3 + Math.random() * 1.5,
        size: 0.6 + Math.random() * 0.4,
        side,
      });
    }

    setPieces(newPieces);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(hideTimer);
  }, [isActive, duration]);

  if (!isVisible || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes burstUp {
          0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-20vh) rotate(90deg) scale(var(--scale));
          }
          30% {
            transform: translateY(-60vh) rotate(180deg) translateX(var(--drift)) scale(var(--scale));
          }
          60% {
            transform: translateY(-40vh) rotate(360deg) translateX(calc(var(--drift) * 1.5)) scale(var(--scale));
            opacity: 0.9;
          }
          100% {
            transform: translateY(10vh) rotate(720deg) translateX(calc(var(--drift) * 2)) scale(var(--scale));
            opacity: 0;
          }
        }

        @keyframes starBurst {
          0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translateY(-70vh) rotate(180deg) scale(var(--scale));
          }
          40% {
            transform: translateY(-50vh) rotate(360deg) translateX(var(--drift)) scale(var(--scale));
          }
          100% {
            transform: translateY(20vh) rotate(720deg) translateX(calc(var(--drift) * 1.8)) scale(var(--scale));
            opacity: 0;
          }
        }

        @keyframes streamerBurst {
          0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          20% {
            transform: translateY(-80vh) rotate(90deg) scale(var(--scale));
          }
          50% {
            transform: translateY(-30vh) rotate(180deg) translateX(var(--drift)) scale(var(--scale));
          }
          100% {
            transform: translateY(30vh) rotate(360deg) translateX(calc(var(--drift) * 2.5)) scale(var(--scale));
            opacity: 0;
          }
        }

        .celebration-piece {
          position: absolute;
          will-change: transform;
        }

        .star-piece {
          animation: starBurst var(--duration) ease-out var(--delay) forwards;
        }

        .confetti-piece {
          animation: burstUp var(--duration) ease-out var(--delay) forwards;
        }

        .streamer-piece {
          animation: streamerBurst var(--duration) ease-out var(--delay) forwards;
        }
      `}</style>

      {/* Party Poppers at bottom */}
      <div className="absolute bottom-8 left-[15%] transform -translate-x-1/2">
        <svg width="50" height="70" viewBox="0 0 50 70">
          <defs>
            <linearGradient id="popperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="100%" stopColor="#0d1b2a" />
            </linearGradient>
          </defs>
          <rect x="10" y="20" width="30" height="50" rx="5" fill="url(#popperGrad)" />
          <rect x="10" y="20" width="30" height="8" rx="3" fill="#FFD700" />
          <circle cx="20" cy="40" r="2" fill="#FFD700" />
          <circle cx="30" cy="45" r="2" fill="#FFD700" />
          <circle cx="20" cy="55" r="2" fill="#FFD700" />
          <circle cx="30" cy="35" r="2" fill="#FFD700" />
          <circle cx="25" cy="50" r="2" fill="#FFD700" />
        </svg>
      </div>

      <div className="absolute bottom-8 right-[15%] transform translate-x-1/2">
        <svg width="50" height="70" viewBox="0 0 50 70">
          <rect x="10" y="20" width="30" height="50" rx="5" fill="url(#popperGrad)" />
          <rect x="10" y="20" width="30" height="8" rx="3" fill="#FFD700" />
          <circle cx="20" cy="40" r="2" fill="#FFD700" />
          <circle cx="30" cy="45" r="2" fill="#FFD700" />
          <circle cx="20" cy="55" r="2" fill="#FFD700" />
          <circle cx="30" cy="35" r="2" fill="#FFD700" />
          <circle cx="25" cy="50" r="2" fill="#FFD700" />
        </svg>
      </div>

      {pieces.map(piece => {
        const drift = piece.side === 'left' ? `${20 + Math.random() * 40}px` : `${-20 - Math.random() * 40}px`;

        return (
          <div
            key={piece.id}
            className="celebration-piece"
            style={{
              left: `${piece.x}%`,
              bottom: '0%',
              ['--delay' as string]: `${piece.delay}s`,
              ['--duration' as string]: `${piece.duration}s`,
              ['--scale' as string]: piece.size,
              ['--drift' as string]: drift,
            }}
          >
            {piece.type === 'star' && (
              <svg
                className="star-piece"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={piece.color}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}

            {piece.type === 'confetti' && (
              <svg
                className="confetti-piece"
                width="10"
                height="14"
                viewBox="0 0 10 14"
              >
                <rect
                  x="0"
                  y="0"
                  width="10"
                  height="14"
                  rx="2"
                  fill={piece.color}
                />
              </svg>
            )}

            {piece.type === 'streamer' && (
              <svg
                className="streamer-piece"
                width="8"
                height="40"
                viewBox="0 0 8 40"
                fill="none"
              >
                <path
                  d="M4 0 C 8 10, 0 20, 4 30 C 8 35, 0 40, 4 40"
                  stroke={piece.color}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CelebrationAnimation;
