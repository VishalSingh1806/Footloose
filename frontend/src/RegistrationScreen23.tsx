import { useEffect, useState } from 'react';
import { Check, Clock } from 'lucide-react';

interface RegistrationScreen23Props {
  onExploreMatches: () => void;
  onViewProfile: () => void;
}

function RegistrationScreen23({ onExploreMatches, onViewProfile }: RegistrationScreen23Props) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation completes
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Generate random confetti pieces
  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    color: ['#E63946', '#F4A261', '#06D6A0', '#2A9D8F', '#3B82F6'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-2 h-2 rounded-sm animate-confetti-fall"
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 max-w-[600px] w-full mx-auto">

        {/* Success Icon with Bounce Animation */}
        <div className="relative mb-6 animate-bounce-once">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#06D6A0] to-[#2A9D8F] flex items-center justify-center shadow-lg">
            <Check className="w-10 h-10 text-white stroke-[3]" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-[28px] font-semibold text-[#1D3557] mb-3 text-center">
          You're almost there
        </h1>

        {/* Subheading */}
        <p className="text-base font-medium text-[#6C757D] mb-4 text-center">
          Profile under review
        </p>

        {/* Body Text */}
        <p className="text-[15px] text-[#6C757D] text-center max-w-[400px] leading-[1.6] mb-8">
          Our team will verify your profile within 24 hours. You'll receive a notification once approved.
        </p>

        {/* Illustration */}
        <div className="mb-8">
          <Clock className="w-12 h-12 text-[#9CA3AF] opacity-50" />
        </div>

        {/* Spacer */}
        <div className="h-8" />

        {/* Primary Button */}
        <button
          onClick={onExploreMatches}
          className="w-full max-w-[400px] h-[52px] rounded-xl font-semibold text-base bg-[#E63946] hover:bg-[#D62828] text-white active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)] transition-all"
        >
          Explore Matches
        </button>

        {/* Secondary Link */}
        <button
          onClick={onViewProfile}
          className="mt-4 text-sm text-[#E63946] underline hover:text-[#D62828] transition-colors"
        >
          View My Profile
        </button>
      </div>

      {/* Bottom Section - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5">
        <div className="max-w-[600px] mx-auto">
          <p className="text-[13px] text-[#9CA3AF] text-center leading-relaxed">
            You'll receive an email and notification once your profile is verified. This usually takes 2-4 hours.
          </p>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-20px);
          }
          50% {
            transform: translateY(-10px);
          }
          75% {
            transform: translateY(-5px);
          }
        }

        .animate-confetti-fall {
          animation: confetti-fall 2.5s ease-in forwards;
        }

        .animate-bounce-once {
          animation: bounce-once 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

export default RegistrationScreen23;
