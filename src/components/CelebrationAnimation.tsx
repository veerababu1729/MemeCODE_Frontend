import { useState, useEffect } from 'react';

interface RibbonPiece {
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
    type: 'ribbon' | 'confetti' | 'spiral';
    delay: number;
    duration: number;
    size: number;
}

interface CelebrationAnimationProps {
    isActive: boolean;
    duration?: number;
}

const CelebrationAnimation = ({ isActive, duration = 8000 }: CelebrationAnimationProps) => {
    const [pieces, setPieces] = useState<RibbonPiece[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    const colors = [
        '#FF6B6B', // Red
        '#4ECDC4', // Teal
        '#FFE66D', // Yellow
        '#95E1D3', // Mint
        '#F38181', // Coral
        '#AA96DA', // Purple
        '#FCBAD3', // Pink
        '#A8D8EA', // Light Blue
        '#FF9F43', // Orange
        '#6C5CE7', // Indigo
    ];

    useEffect(() => {
        if (!isActive) return;

        setIsVisible(true);

        // Create celebration pieces
        const newPieces: RibbonPiece[] = [];

        // Ribbons (curly falling ribbons)
        for (let i = 0; i < 15; i++) {
            newPieces.push({
                id: i,
                x: Math.random() * 100,
                y: -20 - Math.random() * 30,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'ribbon',
                delay: Math.random() * 2,
                duration: 3 + Math.random() * 2,
                size: 0.8 + Math.random() * 0.5,
            });
        }

        // Confetti (small squares/rectangles)
        for (let i = 15; i < 40; i++) {
            newPieces.push({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'confetti',
                delay: Math.random() * 1.5,
                duration: 2.5 + Math.random() * 2,
                size: 0.6 + Math.random() * 0.6,
            });
        }

        // Spirals (curly decorations)
        for (let i = 40; i < 50; i++) {
            newPieces.push({
                id: i,
                x: Math.random() * 100,
                y: -15 - Math.random() * 25,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'spiral',
                delay: Math.random() * 1,
                duration: 4 + Math.random() * 2,
                size: 0.7 + Math.random() * 0.4,
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
        @keyframes ribbonFall {
          0% {
            transform: translateY(0) rotate(0deg) scale(var(--scale));
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) rotate(180deg) translateX(30px) scale(var(--scale));
          }
          50% {
            transform: translateY(50vh) rotate(360deg) translateX(-20px) scale(var(--scale));
          }
          75% {
            transform: translateY(75vh) rotate(540deg) translateX(15px) scale(var(--scale));
            opacity: 0.8;
          }
          100% {
            transform: translateY(110vh) rotate(720deg) translateX(-10px) scale(var(--scale));
            opacity: 0;
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg) scale(var(--scale));
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(1080deg) scale(var(--scale));
            opacity: 0;
          }
        }

        @keyframes spiralFall {
          0% {
            transform: translateY(0) rotate(0deg) scale(var(--scale));
            opacity: 1;
          }
          50% {
            transform: translateY(55vh) rotate(360deg) translateX(40px) scale(var(--scale));
          }
          100% {
            transform: translateY(110vh) rotate(720deg) translateX(-30px) scale(var(--scale));
            opacity: 0;
          }
        }

        .ribbon-piece {
          position: absolute;
          will-change: transform;
        }

        .ribbon-svg {
          animation: ribbonFall var(--duration) ease-out var(--delay) forwards;
        }

        .confetti-svg {
          animation: confettiFall var(--duration) linear var(--delay) forwards;
        }

        .spiral-svg {
          animation: spiralFall var(--duration) ease-in-out var(--delay) forwards;
        }
      `}</style>

            {pieces.map(piece => (
                <div
                    key={piece.id}
                    className="ribbon-piece"
                    style={{
                        left: `${piece.x}%`,
                        top: `${piece.y}%`,
                        ['--delay' as string]: `${piece.delay}s`,
                        ['--duration' as string]: `${piece.duration}s`,
                        ['--scale' as string]: piece.size,
                    }}
                >
                    {piece.type === 'ribbon' && (
                        <svg
                            className="ribbon-svg"
                            width="30"
                            height="60"
                            viewBox="0 0 30 60"
                            fill="none"
                            style={{ transform: `rotate(${piece.rotation}deg)` }}
                        >
                            <path
                                d="M5 0 C 15 15, 25 15, 15 30 C 5 45, 25 45, 15 60"
                                stroke={piece.color}
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}

                    {piece.type === 'confetti' && (
                        <svg
                            className="confetti-svg"
                            width="12"
                            height="16"
                            viewBox="0 0 12 16"
                            style={{ transform: `rotate(${piece.rotation}deg)` }}
                        >
                            <rect
                                x="0"
                                y="0"
                                width="12"
                                height="16"
                                rx="2"
                                fill={piece.color}
                            />
                        </svg>
                    )}

                    {piece.type === 'spiral' && (
                        <svg
                            className="spiral-svg"
                            width="40"
                            height="50"
                            viewBox="0 0 40 50"
                            fill="none"
                            style={{ transform: `rotate(${piece.rotation}deg)` }}
                        >
                            <path
                                d="M20 0 C 35 10, 5 20, 20 25 C 35 30, 5 40, 20 50"
                                stroke={piece.color}
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                            />
                            <circle cx="20" cy="50" r="4" fill={piece.color} />
                        </svg>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CelebrationAnimation;
