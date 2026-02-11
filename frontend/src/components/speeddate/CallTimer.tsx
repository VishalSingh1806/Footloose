import { useEffect, useState } from 'react';
import { Clock, Pause } from 'lucide-react';

interface CallTimerProps {
  initialSeconds?: number;
  isPaused?: boolean;
  onTimeUp?: () => void;
  onWarning?: (secondsLeft: number) => void;
}

function CallTimer({
  initialSeconds = 600, // 10 minutes
  isPaused = false,
  onTimeUp,
  onWarning,
}: CallTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const newTime = prev - 1;

        // Trigger warnings
        if (newTime === 300 && onWarning) onWarning(300); // 5 minutes
        if (newTime === 60 && onWarning) onWarning(60); // 1 minute
        if (newTime === 30 && onWarning) onWarning(30); // 30 seconds
        if (newTime === 10 && onWarning) onWarning(10); // 10 seconds

        // Time's up
        if (newTime <= 0) {
          clearInterval(interval);
          if (onTimeUp) onTimeUp();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onTimeUp, onWarning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (secondsLeft > 300) return 'bg-green-600 text-white';
    if (secondsLeft > 60) return 'bg-[#F77F00] text-white';
    return 'bg-[#DC2626] text-white';
  };

  const shouldPulse = secondsLeft <= 60;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all
        ${getTimerColor()} ${shouldPulse ? 'animate-pulse' : ''}`}
    >
      {isPaused ? (
        <>
          <Pause size={18} />
          <span className="font-bold text-lg font-mono">Paused</span>
        </>
      ) : (
        <>
          <Clock size={18} />
          <span className="font-bold text-lg font-mono">{formatTime(secondsLeft)}</span>
        </>
      )}
    </div>
  );
}

export default CallTimer;
