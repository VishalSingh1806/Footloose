import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface RegistrationScreen17Props {
  onNext: (data: { relationshipIntent: string }) => void;
  onBack: () => void;
}

function RegistrationScreen17({ onNext, onBack }: RegistrationScreen17Props) {
  const [selectedIntent, setSelectedIntent] = useState<string>('');

  const intentOptions = [
    'Serious relationship',
    'Partner to marry',
    'Just exploring'
  ];

  const handleContinue = () => {
    if (selectedIntent) {
      onNext({ relationshipIntent: selectedIntent });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="px-5 pt-4 pb-3 relative">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-[#FAFAFA] rounded-lg transition-colors absolute left-3 top-3"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-[#1D3557]" />
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">
              Why you're here
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out"
            style={{ width: '82%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-8 pb-28 max-w-[600px] w-full mx-auto">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-8">
          Why you're here
        </h1>

        {/* Options */}
        <div className="space-y-3">
          {intentOptions.map((intent) => (
            <button
              key={intent}
              onClick={() => setSelectedIntent(intent)}
              className={`
                w-full h-[56px] rounded-xl font-semibold text-base transition-all
                ${
                  selectedIntent === intent
                    ? 'bg-[#9B59B6] text-white shadow-[0_2px_8px_rgba(155,89,182,0.2)]'
                    : 'bg-white text-[#1D3557] border-2 border-[#E5E7EB] hover:border-[#9B59B6]/30'
                }
              `}
            >
              {intent}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!selectedIntent}
            className={`
              w-full h-[52px] rounded-xl font-semibold text-base transition-all
              ${
                selectedIntent
                  ? 'bg-[#9B59B6] hover:bg-[#8E44AD] text-white active:scale-[0.98] shadow-[0_2px_8px_rgba(155,89,182,0.2)] opacity-100'
                  : 'bg-[#9B59B6] text-white opacity-50 cursor-not-allowed'
              }
            `}
            aria-label="Continue to next step"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationScreen17;
