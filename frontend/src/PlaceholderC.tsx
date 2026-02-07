import { ListChecks } from 'lucide-react';

interface PlaceholderCProps {
  onContinue: () => void;
  onBack: () => void;
}

function PlaceholderC({ onContinue }: PlaceholderCProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-5 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E7EB]">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E63946]/10 to-[#F4A261]/10 flex items-center justify-center">
              <ListChecks className="w-8 h-8 text-[#E63946]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-[#1D3557] text-center mb-4">
            Making trade-offs
          </h1>

          {/* Body Text */}
          <p className="text-base text-[#6C757D] text-center leading-relaxed mb-8">
            Prioritise what matters most to you.
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

export default PlaceholderC;
