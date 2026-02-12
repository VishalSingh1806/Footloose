import { useState, useEffect } from 'react';
import { CheckCircle, Heart, ThumbsDown, Clock } from 'lucide-react';

interface CallEndedProps {
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  callDuration: number; // in seconds
  onDecision: (interested: boolean | null) => void;
  onSkip: () => void;
}

function CallEnded({
  matchName,
  matchAge,
  matchPhoto,
  callDuration,
  onDecision,
  onSkip,
}: CallEndedProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowReminder(false);
          onSkip();
          return 0;
        }
        if (prev === 30) {
          setShowReminder(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onSkip]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} second${secs !== 1 ? 's' : ''}`;
    if (secs === 0) return `${mins} minute${mins !== 1 ? 's' : ''}`;
    return `${mins} minute${mins !== 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6 animate-fadeIn">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle size={48} className="text-white" strokeWidth={3} />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#1D3557] mb-3">
          Speed Date Complete!
        </h1>

        {/* Duration */}
        <div className="flex items-center justify-center gap-2 text-[#6C757D] mb-8">
          <Clock size={20} />
          <span>You talked for {formatDuration(callDuration)}</span>
        </div>

        {/* Match Info */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-8 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={matchPhoto}
              alt={matchName}
              className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
            />
            <div className="text-left">
              <h3 className="text-xl font-bold text-[#1D3557]">{matchName}, {matchAge}</h3>
            </div>
          </div>

          {/* Quick Decision Prompt */}
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-[#1D3557] mb-4">
              How did it go with {matchName}?
            </h2>

            {/* Decision Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => onDecision(true)}
                className="w-full bg-[#06D6A0] text-white py-4 px-6 rounded-xl font-semibold text-base
                           hover:bg-[#05C794] active:scale-95 transition-all shadow-md
                           flex items-center justify-center gap-2"
              >
                <Heart size={20} fill="white" />
                Great! I'd like to connect
              </button>

              <button
                onClick={() => onDecision(false)}
                className="w-full bg-gray-100 text-[#6C757D] py-4 px-6 rounded-xl font-semibold text-base
                           hover:bg-gray-200 active:scale-95 transition-all
                           flex items-center justify-center gap-2"
              >
                <ThumbsDown size={20} />
                Not a match for me
              </button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-[#6C757D] mt-4">
              This decision is private. You'll only chat if both choose to connect.
            </p>
          </div>
        </div>

        {/* Skip Option */}
        <button
          onClick={onSkip}
          className="text-[#6C757D] hover:text-[#1D3557] font-medium"
        >
          Decide later
        </button>

        {/* Timer Reminder */}
        {showReminder && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
            Auto-advancing in {timeLeft} seconds...
          </div>
        )}
      </div>
    </div>
  );
}

export default CallEnded;
