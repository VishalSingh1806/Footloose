import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface RegistrationScreen3AProps {
  onNext: (data: { gender: string; maritalStatus: string }) => void;
  onBack: () => void;
}

type Gender = 'Male' | 'Female' | '';
type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Separated' | 'Awaiting divorce' | 'Widowed' | '';

function RegistrationScreen3A({ onNext, onBack }: RegistrationScreen3AProps) {
  const [gender, setGender] = useState<Gender>('');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('');

  const handleContinue = () => {
    if (gender && maritalStatus) {
      onNext({ gender, maritalStatus });
    }
  };

  const isComplete = gender !== '' && maritalStatus !== '';

  const genderOptions: Gender[] = ['Male', 'Female'];
  const maritalStatusOptions: MaritalStatus[] = [
    'Single',
    'Married',
    'Divorced',
    'Separated',
    'Awaiting divorce',
    'Widowed',
  ];

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
              Personal Details
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] transition-all duration-500 ease-out"
            style={{ width: '10%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-8 pb-28 max-w-[600px] w-full mx-auto">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-8">
          A little about you
        </h1>

        {/* Gender Section */}
        <div className="mb-8">
          <label className="block text-base font-semibold text-[#1D3557] mb-3">
            Gender
          </label>
          <div className="flex flex-wrap gap-3">
            {genderOptions.map((option) => (
              <button
                key={option}
                onClick={() => setGender(option)}
                className={`
                  h-12 px-6 rounded-3xl font-semibold text-[15px] transition-all duration-200
                  ${
                    gender === option
                      ? 'bg-[#E63946] text-white shadow-[0_2px_8px_rgba(230,57,70,0.2)] scale-[1.02]'
                      : 'bg-white text-[#6C757D] border-2 border-[#E5E7EB] hover:border-[#E63946] hover:text-[#E63946]'
                  }
                `}
                role="radio"
                aria-checked={gender === option}
                aria-label={`Gender: ${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Marital Status Section */}
        <div>
          <label className="block text-base font-semibold text-[#1D3557] mb-3">
            Marital Status
          </label>
          <div className="flex flex-wrap gap-3">
            {maritalStatusOptions.map((option) => (
              <button
                key={option}
                onClick={() => setMaritalStatus(option)}
                className={`
                  h-12 px-6 rounded-3xl font-semibold text-[15px] transition-all duration-200
                  ${
                    maritalStatus === option
                      ? 'bg-[#E63946] text-white shadow-[0_2px_8px_rgba(230,57,70,0.2)] scale-[1.02]'
                      : 'bg-white text-[#6C757D] border-2 border-[#E5E7EB] hover:border-[#E63946] hover:text-[#E63946]'
                  }
                `}
                role="radio"
                aria-checked={maritalStatus === option}
                aria-label={`Marital Status: ${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!isComplete}
            className={`
              w-full h-[52px] rounded-xl font-semibold text-base transition-all
              ${
                isComplete
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

export default RegistrationScreen3A;
