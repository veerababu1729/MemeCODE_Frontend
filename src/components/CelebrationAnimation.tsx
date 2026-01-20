import { useState, useEffect } from 'react';

interface ConfettiPiece {
    id: number;
    x: number;
    y: number;
    rotation: number;
    type: 'ribbon' | 'square' | 'curl' | 'strip';
    delay: number;
    duration: number;
    size: number;
    shade: string;
}

interface CelebrationAnimationProps {
    isActive: boolean;
    duration?: number;
}

const CelebrationAnimation = ({ isActive, duration = 8000 }: CelebrationAnimationProps) => {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    // Golden shades like the reference image
    const goldShades = [
        '#FFD700', // Gold
        '#FFC300', // Bright Gold
        '#DAA520', // Goldenrod
        '#F4C430', // Saffron
        '#FFBF00', // Amber
        '#E8B923', // Dark Gold
        '#FFA500', // Orange Gold
        '#FFE135', // Banana Yellow
    ];

    useEffect(() => {
        if (!isActive) return;

        setIsVisible(true);

        const newPieces: ConfettiPiece[] = [];

        // Curly ribbons (large spiraling ribbons)
        for (let i = 0; i < 12; i++) {
            newPieces.push({
                id: i,
                x: Math.random() * 100,
                y: -15 - Math.random() * 20,
                rotation: Math.random() * 360,
                type: 'ribbon',
                delay: Math.random() * 2,
                duration: 4 + Math.random() * 2,
                size: 0.8 + Math.random() * 0.5,
                shade: goldShades[Math.floor(Math.random() * goldShades.length)],
            });
        }

        // Small squares/rectangles (confetti pieces)
        for (let i = 12; i < 60; i++) {
            newPieces.push({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 30,
                rotation: Math.random() * 360,
                type: 'square',
                delay: Math.random() * 1.5,
                duration: 3 + Math.random() * 2,
                size: 0.5 + Math.random() * 0.5,
                shade: goldShades[Math.floor(Math.random() * goldShades.length)],
            });
        }

        // Curl pieces (small curls)
        for (let i = 60; i < 80; i++) {
            newPieces.push({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 25,
                rotation: Math.random() * 360,
                type: 'curl',
                delay: Math.random() * 1.8,
                duration: 3.5 + Math.random() * 2,
                size: 0.6 + Math.random() * 0.4,
                shade: goldShades[Math.floor(Math.random() * goldShades.length)],
            });
        }

        // Strip pieces (thin strips)
        for (let i = 80; i < 100; i++) {
            newPieces.push({
                id: i,
                x: Math.random() * 100,
                y: -8 - Math.random() * 20,
                rotation: Math.random() * 360,
                type: 'strip',
                delay: Math.random() * 1.2,
                duration: 2.5 + Math.random() * 2,
                size: 0.6 + Math.random() * 0.5,
                shade: goldShades[Math.floor(Math.random() * goldShades.length)],
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
        @keyframes goldenFall {
          0% {
            transform: translateY(0) rotate(0deg) scale(var(--scale));
            opacity: 1;
          }
          25% {
            transform: translateY(28vh) rotate(180deg) translateX(25px) scale(var(--scale));
          }
          50% {
            transform: translateY(55vh) rotate(360deg) translateX(-20px) scale(var(--scale));
          }
          75% {
            transform: translateY(82vh) rotate(540deg) translateX(15px) scale(var(--scale));
            opacity: 0.9;
          }
          100% {
            transform: translateY(115vh) rotate(720deg) translateX(-10px) scale(var(--scale));
            opacity: 0;
          }
        }

        @keyframes confettiSpin {
          0% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg) scale(var(--scale));
            opacity: 1;
          }
          100% {
            transform: translateY(115vh) rotateX(1440deg) rotateY(720deg) scale(var(--scale));
            opacity: 0;
          }
        }

        .gold-piece {
          position: absolute;
          will-change: transform;
        }

        .ribbon-anim {
          animation: goldenFall var(--duration) ease-out var(--delay) forwards;
        }

        .confetti-anim {
          animation: confettiSpin var(--duration) linear var(--delay) forwards;
        }
      `}</style>

            {pieces.map(piece => (
                <div
                    key={piece.id}
                    className="gold-piece"
                    style={{
                        left: `${piece.x}%`,
                        top: `${piece.y}%`,
                        ['--delay' as string]: `${piece.delay}s`,
                        ['--duration' as string]: `${piece.duration}s`,
                        ['--scale' as string]: piece.size,
                    }}
                >
                    {/* Curly Ribbon */}
                    {piece.type === 'ribbon' && (
                        <svg
                            className="ribbon-anim"
                            width="40"
                            height="80"
                            viewBox="0 0 40 80"
                            fill="none"
                            style={{ transform: `rotate(${piece.rotation}deg)` }}
                        >
                            <path
                                d="M20 0 C 35 10, 5 20, 20 30 C 35 40, 5 50, 20 60 C 35 70, 15 80, 20 80"
                                stroke={piece.shade}
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                            />
                            <path
                                d="M22 0 C 37 10, 7 20, 22 30 C 37 40, 7 50, 22 60"
                                stroke={piece.shade}
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                opacity="0.5"
                            />
                        </svg>
                    )}

                    {/* Square Confetti */}
                    {piece.type === 'square' && (
                        <svg
                            className="confetti-anim"
                            width="10"
                            height="12"
                            viewBox="0 0 10 12"
                            style={{ transform: `rotate(${piece.rotation}deg)` }}
                        >
                            <rect
                                x="0"
                                y="0"
                                width="10"
                                height="12"
                                rx="1"
                                fill={piece.shade}
                            />
                            <rect
                                x="2"
                                y="2"
                                width="4"
                                height="4"
                                fill="rgba(255,255,255,0.3)"
                            />
                        </svg>
                    )}

                    {/* Small Curl */}
                    {piece.type === 'curl' && (
                        <svg
                            className="ribbon-anim"
                            width="25"
                            height="30"
                            viewBox="0 0 25 30"
                            fill="none"
                            style={{ transform: `rotate(${piece.rotation}deg)` }}
                        >
                            <path
                                d="M5 0 C 20 5, 0 15, 15 20 C 25 25, 10 30, 20 30"
                                stroke={piece.shade}
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}

                    {/* Strip */}
                    {piece.type === 'strip' && (
                        <svg
                            className="confetti-anim"
                            width="6"
                            height="18"
                            viewBox="0 0 6 18"
                            style={{ transform: `rotate(${piece.rotation}deg)` }}
                        >
                            <rect
                                x="0"
                                y="0"
                                width="6"
                                height="18"
                                rx="1"
                                fill={piece.shade}
                            />
                        </svg>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CelebrationAnimation;
