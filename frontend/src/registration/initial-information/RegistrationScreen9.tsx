import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface RegistrationScreen9Props {
  onNext: (data: { religion: string; community: string }) => void;
  onBack: () => void;
}

function RegistrationScreen9({ onNext, onBack }: RegistrationScreen9Props) {
  const [selectedReligion, setSelectedReligion] = useState<string>('');
  const [community, setCommunity] = useState<string>('');

  const religions = [
    'Hindu',
    'Muslim',
    'Christian',
    'Sikh',
    'Jain',
    'Buddhist'
  ];

  const handleContinue = () => {
    if (selectedReligion) {
      onNext({ religion: selectedReligion, community });
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
              Religion & Community
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] transition-all duration-500 ease-out"
            style={{ width: '45%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-8 pb-28 max-w-[600px] w-full mx-auto">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-3">
          Religion & community
        </h1>

        {/* Religion Section */}
        <div className="mb-8">
          <p className="text-[15px] text-[#6C757D] mb-4">
            Religion
          </p>

          {/* Religion Options - 2 Column Grid */}
          <div className="grid grid-cols-2 gap-3">
            {religions.map((religion) => (
              <button
                key={religion}
                onClick={() => setSelectedReligion(religion)}
                className={`
                  h-[56px] rounded-xl font-semibold text-base transition-all
                  ${
                    selectedReligion === religion
                      ? 'bg-[#E63946] text-white shadow-[0_2px_8px_rgba(230,57,70,0.2)]'
                      : 'bg-white text-[#1D3557] border-2 border-[#E5E7EB] hover:border-[#E63946]/30'
                  }
                `}
              >
                {religion}
              </button>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div>
          <label
            htmlFor="community"
            className="block text-[15px] text-[#6C757D] mb-3"
          >
            Community (optional)
          </label>
          <input
            id="community"
            type="text"
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            placeholder="e.g., Brahmin, Rajput, etc."
            className="w-full h-[52px] px-4 rounded-xl border-2 border-[#E5E7EB] bg-white text-[#1D3557] text-base placeholder:text-[#ADB5BD] focus:outline-none focus:border-[#E63946] transition-colors"
          />
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!selectedReligion}
            className={`
              w-full h-[52px] rounded-xl font-semibold text-base transition-all
              ${
                selectedReligion
                  ? 'bg-[#E63946] hover:bg-[#D62828] text-white active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)] opacity-100'
                  : 'bg-[#E63946] text-white opacity-50 cursor-not-allowed'
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

export default RegistrationScreen9;
