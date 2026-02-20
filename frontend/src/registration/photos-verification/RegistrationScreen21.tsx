import { useState, useRef } from 'react';
import { ChevronLeft, FileText, Check, Info } from 'lucide-react';

interface RegistrationScreen21Props {
  onNext: (data: { governmentId: File | null; companyId: File | null }) => void;
  onBack: () => void;
}

function RegistrationScreen21({ onNext, onBack }: RegistrationScreen21Props) {
  const [governmentId, setGovernmentId] = useState<File | null>(null);
  const [companyId, setCompanyId] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const governmentIdRef = useRef<HTMLInputElement>(null);
  const companyIdRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void
  ) => {
    const file = event.target.files?.[0];
    setError('');

    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid file (JPEG, PNG, or PDF)');
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError('File size must be less than 5MB');
        return;
      }

      setFile(file);
    }
  };

  const handleContinue = () => {
    if (governmentId) {
      onNext({ governmentId, companyId });
    }
  };

  const renderUploadSection = (
    label: string,
    file: File | null,
    fileInputRef: React.RefObject<HTMLInputElement>,
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    isOptional: boolean = false
  ) => {
    return (
      <div className="mb-5">
        <label className="block text-sm font-medium text-[#1D3557] mb-3">
          {label}
          {isOptional && (
            <span className="text-[#6C757D] font-normal"> (optional)</span>
          )}
        </label>

        {!file ? (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-[56px] rounded-xl border-2 border-dashed border-[#E5E7EB] bg-white hover:border-[#9B59B6]/30 hover:bg-[#FAFAFA] transition-all flex items-center justify-center gap-3"
            >
              <FileText className="w-5 h-5 text-[#6C757D]" />
              <span className="text-sm font-medium text-[#6C757D]">
                {isOptional ? 'Upload Company ID' : 'Upload ID'}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={onFileChange}
              className="hidden"
            />
          </>
        ) : (
          <div className="w-full h-[56px] rounded-xl border-2 border-[#10B981] bg-[#ECFDF5] flex items-center justify-between px-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Check className="w-5 h-5 text-[#10B981] flex-shrink-0" />
              <span className="text-sm font-medium text-[#1D3557] truncate">
                {file.name}
              </span>
            </div>
            <button
              onClick={() => {
                if (fileInputRef === governmentIdRef) {
                  setGovernmentId(null);
                } else {
                  setCompanyId(null);
                }
                setError('');
              }}
              className="text-xs text-[#6C757D] hover:text-[#9B59B6] ml-3 flex-shrink-0"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
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
              Verification
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out"
            style={{ width: '94%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-8 pb-28 max-w-[600px] w-full mx-auto">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-2">
          ID verification
        </h1>

        <p className="text-base text-[#6C757D] mb-6">
          Upload documents for identity verification
        </p>

        {/* Upload Sections */}
        <div className="mb-6">
          {/* Government ID */}
          {renderUploadSection(
            'Government ID (Aadhaar/PAN/Passport/Driving License)',
            governmentId,
            governmentIdRef,
            (e) => handleFileSelect(e, setGovernmentId),
            false
          )}

          {/* Company ID */}
          {renderUploadSection(
            'Company ID',
            companyId,
            companyIdRef,
            (e) => handleFileSelect(e, setCompanyId),
            true
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-[#FEE2E2] border border-[#EF4444] rounded-lg">
            <p className="text-sm text-[#DC2626]">{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-[#DBEAFE] rounded-xl p-4 border-l-4 border-[#3B82F6] flex gap-3">
          <Info className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#1D3557] leading-relaxed">
            Documents are encrypted and used only for identity verification. Not shown publicly.
          </p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!governmentId}
            className={`
              w-full h-[52px] rounded-xl font-semibold text-base transition-all
              ${
                governmentId
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

export default RegistrationScreen21;
