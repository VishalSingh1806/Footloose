import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import CustomDropdown from '../../components/common/CustomDropdown';

interface RegistrationScreen9Props {
  onNext: (data: { religion: string; community: string }) => void;
  onBack: () => void;
}

const religions = [
  { id: 'hindu', label: 'Hindu' },
  { id: 'muslim', label: 'Muslim' },
  { id: 'christian', label: 'Christian' },
  { id: 'sikh', label: 'Sikh' },
  { id: 'jain', label: 'Jain' },
  { id: 'buddhist', label: 'Buddhist' },
];

const communityOptions: Record<string, string[]> = {
  hindu: [
    'Brahmin', 'Kshatriya', 'Vaishya', 'Rajput', 'Maratha',
    'Reddy', 'Nair', 'Jat', 'Yadav', 'Scheduled Caste',
    'Scheduled Tribe', 'Other Backward Class (OBC)',
    'Prefer not to say', 'Other',
  ],
  muslim: [
    'Sunni', 'Shia', 'Ahmadiyya', 'Bohra', 'Khoja',
    'Ansari', 'Sheikh', 'Syed', 'Pathan',
    'Prefer not to say', 'Other',
  ],
  christian: [
    'Catholic', 'Protestant', 'Orthodox', 'Pentecostal',
    'Church of South India (CSI)', 'Church of North India (CNI)',
    'Syrian Christian', 'Latin Catholic', 'Anglican',
    'Prefer not to say', 'Other',
  ],
  sikh: [
    'Jat Sikh', 'Ramgarhia', 'Arora', 'Khatri',
    'Saini', 'Lubana', 'Rajput Sikh',
    'Prefer not to say', 'Other',
  ],
  jain: [
    'Digambar', 'Shwetambar', 'Oswal', 'Porwal',
    'Agrawal', 'Khandelwal',
    'Prefer not to say', 'Other',
  ],
  buddhist: [
    'Theravada', 'Mahayana', 'Vajrayana',
    'Ambedkarite', 'Navayana',
    'Prefer not to say', 'Other',
  ],
};

function RegistrationScreen9({ onNext, onBack }: RegistrationScreen9Props) {
  const [selectedReligion, setSelectedReligion] = useState<string>('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [otherCommunity, setOtherCommunity] = useState<string>('');
  const [communityTouched, setCommunityTouched] = useState(false);

  const handleReligionSelect = (religionId: string) => {
    setSelectedReligion(religionId);
    setSelectedCommunity('');
    setOtherCommunity('');
    setCommunityTouched(false);
  };

  const handleCommunityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCommunity(e.target.value);
    setCommunityTouched(true);
    if (e.target.value !== 'Other') {
      setOtherCommunity('');
    }
  };

  const canProceed = (): boolean => {
    if (!selectedReligion) return false;
    if (!selectedCommunity) return false;
    if (selectedCommunity === 'Other' && !otherCommunity.trim()) return false;
    return true;
  };

  const handleContinue = () => {
    if (canProceed()) {
      const community = selectedCommunity === 'Other' ? otherCommunity.trim() : selectedCommunity;
      onNext({ religion: selectedReligion, community });
    }
  };

  const showCommunityError = communityTouched && selectedReligion && !selectedCommunity;

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
            className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out"
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
          <p className="text-[15px] text-[#6C757D] mb-4">Religion</p>

          <div className="grid grid-cols-2 gap-3">
            {religions.map((religion) => (
              <button
                key={religion.id}
                onClick={() => handleReligionSelect(religion.id)}
                className={`
                  h-[56px] rounded-xl font-semibold text-base transition-all
                  ${
                    selectedReligion === religion.id
                      ? 'bg-[#9B59B6] text-white shadow-[0_2px_8px_rgba(155,89,182,0.2)]'
                      : 'bg-white text-[#1D3557] border-2 border-[#E5E7EB] hover:border-[#9B59B6]/30'
                  }
                `}
              >
                {religion.label}
              </button>
            ))}
          </div>
        </div>

        {/* Community Section — appears after religion is selected */}
        {selectedReligion && (
          <div className="mb-8">
            <CustomDropdown
              id="community"
              label="Community"
              value={selectedCommunity}
              onChange={handleCommunityChange}
              onBlur={() => setCommunityTouched(true)}
              options={communityOptions[selectedReligion]}
              placeholder="Select community"
              required
              error={showCommunityError ? 'Community is required' : ''}
            />

            {!showCommunityError && (
              <p className="text-[13px] text-[#6C757D] mt-2">
                This helps us understand your cultural background
              </p>
            )}

            {/* "Other" free-text input */}
            {selectedCommunity === 'Other' && (
              <div className="mt-4">
                <label htmlFor="otherCommunity" className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Please specify <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="otherCommunity"
                  type="text"
                  value={otherCommunity}
                  onChange={(e) => setOtherCommunity(e.target.value)}
                  placeholder="Enter your community"
                  className={`
                    w-full h-[52px] px-4 rounded-[10px] border-2 bg-white text-base text-[#1D3557]
                    placeholder:text-[#ADB5BD] focus:outline-none focus:ring-2 focus:ring-[#9B59B6]/20 transition-all
                    ${otherCommunity.trim() ? 'border-[#9B59B6]' : 'border-[#E5E7EB]'}
                  `}
                />
                {!otherCommunity.trim() && (
                  <p className="text-[13px] text-[#DC2626] mt-1">Please specify your community</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!canProceed()}
            className={`
              w-full h-[52px] rounded-xl font-semibold text-base transition-all
              ${
                canProceed()
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

export default RegistrationScreen9;
