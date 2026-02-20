import { Clock } from 'lucide-react';

interface RegistrationScreen24Props {
  onExploreMatches: () => void;
  onViewProfile: () => void;
}

function RegistrationScreen24({ onExploreMatches }: RegistrationScreen24Props) {
  const handleDone = () => {
    // Navigate to holding/waiting page
    onExploreMatches();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-5 py-12">
      <div className="max-w-[500px] w-full text-center">

        {/* Icon - Calm, no animation */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#D1FAE5] flex items-center justify-center">
            <Clock className="w-8 h-8 text-[#2A9D8F]" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-[22px] font-semibold text-[#1D3557] mb-6">
          Profile submitted
        </h1>

        {/* Body Text */}
        <div className="space-y-4 mb-8">
          <p className="text-base text-[#1D3557] leading-relaxed">
            Your profile is under review.
          </p>

          <p className="text-base text-[#6C757D] leading-relaxed">
            We review every profile before it becomes visible. This typically takes a few hours.
          </p>

          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            You will receive a WhatsApp message and email when your profile is approved.
          </p>
        </div>

        {/* Single Button */}
        <button
          onClick={handleDone}
          className="w-full max-w-[400px] h-[52px] rounded-xl font-semibold text-base bg-[#9B59B6] hover:bg-[#8E44AD] text-white transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(155,89,182,0.2)] mx-auto block"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default RegistrationScreen24;
