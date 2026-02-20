import { useState } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';

interface RegistrationScreen10BProps {
  onNext: (data: { industry: string; role: string }) => void;
  onBack: () => void;
}

function RegistrationScreen10B({ onNext, onBack }: RegistrationScreen10BProps) {
  const [industry, setIndustry] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  const industries = [
    'IT/Software',
    'Healthcare',
    'Education',
    'Finance/Banking',
    'Manufacturing',
    'Consulting',
    'Government',
    'Sales/Marketing',
    'Engineering',
    'Creative/Design',
    'Hospitality',
    'Real Estate',
    'Legal',
    'Retail',
    'Other',
  ];

  const handleContinue = () => {
    if (industry && role.trim().length >= 2) {
      onNext({ industry, role: role.trim() });
    }
  };

  const isFormValid = industry && role.trim().length >= 2;

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
              Work
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out"
            style={{ width: '55%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-8 pb-28 max-w-[600px] w-full mx-auto">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-8">
          Work
        </h1>

        {/* Industry Dropdown */}
        <div className="mb-6">
          <label className="block text-[15px] text-[#6C757D] mb-3">
            Industry
          </label>
          <div className="relative">
            <button
              onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
              className="w-full h-[52px] px-4 rounded-xl border-2 border-[#E5E7EB] bg-white text-[#1D3557] text-base text-left flex items-center justify-between focus:outline-none focus:border-[#9B59B6] transition-colors"
            >
              <span className={industry ? 'text-[#1D3557]' : 'text-[#ADB5BD]'}>
                {industry || 'Select industry'}
              </span>
              <ChevronDown className={`w-5 h-5 text-[#6C757D] transition-transform ${showIndustryDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showIndustryDropdown && (
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-[#E5E7EB] rounded-xl shadow-lg max-h-[320px] overflow-y-auto">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => {
                      setIndustry(ind);
                      setShowIndustryDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[#FAFAFA] transition-colors ${
                      industry === ind ? 'bg-[#F5E6FF] text-[#9B59B6] font-semibold' : 'text-[#1D3557]'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Role Input */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-[15px] text-[#6C757D] mb-3">
            Role/Designation
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Software Engineer, Marketing Manager"
            className="w-full h-[52px] px-4 rounded-xl border-2 border-[#E5E7EB] bg-white text-[#1D3557] text-base placeholder:text-[#ADB5BD] focus:outline-none focus:border-[#9B59B6] transition-colors"
          />
          {role.length > 0 && role.trim().length < 2 && (
            <p className="mt-2 text-sm text-[#9B59B6]">
              Please enter at least 2 characters
            </p>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!isFormValid}
            className={`
              w-full h-[52px] rounded-xl font-semibold text-base transition-all
              ${
                isFormValid
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

      {/* Click outside handler */}
      {showIndustryDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowIndustryDropdown(false)}
        />
      )}
    </div>
  );
}

export default RegistrationScreen10B;
