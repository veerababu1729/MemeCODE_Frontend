import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset to 24 hours when timer reaches 0
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="text-center">
        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-3 text-2xl font-bold min-w-16 shadow-card">
          {formatTime(timeLeft.hours)}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Hours</p>
      </div>
      <div className="text-2xl font-bold text-primary">:</div>
      <div className="text-center">
        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-3 text-2xl font-bold min-w-16 shadow-card">
          {formatTime(timeLeft.minutes)}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Minutes</p>
      </div>
      <div className="text-2xl font-bold text-primary">:</div>
      <div className="text-center">
        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-3 text-2xl font-bold min-w-16 shadow-card">
          {formatTime(timeLeft.seconds)}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Seconds</p>
      </div>
    </div>
  );
};

export default CountdownTimer;