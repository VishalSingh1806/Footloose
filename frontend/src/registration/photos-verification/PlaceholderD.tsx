import { Camera } from 'lucide-react';

interface PlaceholderDProps {
  onContinue: () => void;
  onBack: () => void;
}

function PlaceholderD({ onContinue }: PlaceholderDProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-5 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E7EB]">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9B59B6]/10 to-[#8E44AD]/10 flex items-center justify-center">
              <Camera className="w-8 h-8 text-[#9B59B6]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-[#1D3557] text-center mb-4">
            Photos and verification
          </h1>

          {/* Body Text */}
          <p className="text-base text-[#6C757D] text-center leading-relaxed mb-8">
            Put your best foot forward.
          </p>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full h-[52px] bg-[#9B59B6] hover:bg-[#8E44AD] text-white font-semibold text-base rounded-xl transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(155,89,182,0.2)]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceholderD;
