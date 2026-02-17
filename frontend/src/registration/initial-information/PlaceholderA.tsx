import { Heart } from 'lucide-react';

interface PlaceholderAProps {
  onContinue: () => void;
}

function PlaceholderA({ onContinue }: PlaceholderAProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-5 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E7EB]">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E63946]/10 to-[#F4A261]/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-[#E63946]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-[#1D3557] text-center mb-4">
            Family context
          </h1>

          {/* Body Text */}
          <p className="text-base text-[#6C757D] text-center leading-relaxed mb-8">
            Family backgrounds being similar often matters more than people expect. Answer honestly. There is no right or wrong response.
          </p>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full h-[52px] bg-[#E63946] hover:bg-[#D62828] text-white font-semibold text-base rounded-xl transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceholderA;
