import { useState, useRef } from 'react';
import { ChevronLeft, Camera, X } from 'lucide-react';

interface RegistrationScreen19Props {
  onNext: (data: { photos: string[] }) => void;
  onBack: () => void;
}

function RegistrationScreen19({ onNext, onBack }: RegistrationScreen19Props) {
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [error, setError] = useState('');
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const REQUIRED_COUNT = 3;
  const MAX_PHOTOS = 6;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setError('Only JPG or PNG images are accepted.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhotos = [...photos];
      newPhotos[index] = reader.result as string;
      setPhotos(newPhotos);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleAddPhotoClick = (index: number) => {
    fileInputRefs[index].current?.click();
  };

  const requiredPhotosCount = photos.slice(0, REQUIRED_COUNT).filter(p => p !== null).length;
  const canContinue = requiredPhotosCount === REQUIRED_COUNT;

  const handleContinue = () => {
    if (canContinue) {
      const filledPhotos = photos.filter(p => p !== null) as string[];
      onNext({ photos: filledPhotos });
    }
  };

  const renderPhotoSlot = (index: number) => {
    const photo = photos[index];
    const isRequired = index < REQUIRED_COUNT;

    if (photo) {
      return (
        <div className="relative aspect-square rounded-xl overflow-hidden bg-white border-2 border-[#E5E7EB]">
          <img
            src={photo}
            alt={`Profile photo ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => handleRemovePhoto(index)}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
            aria-label="Remove photo"
          >
            <X className="w-4 h-4 text-[#1D3557]" />
          </button>
        </div>
      );
    }

    return (
      <>
        <button
          onClick={() => handleAddPhotoClick(index)}
          className={`aspect-square rounded-xl border-2 border-dashed bg-white transition-all flex flex-col items-center justify-center gap-2 relative ${
            isRequired
              ? 'border-[#DC2626] hover:bg-[#FEF2F2]'
              : 'border-[#E5E7EB] hover:border-[#9B59B6]/30 hover:bg-[#FAFAFA]'
          }`}
        >
          <span
            className={`absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide ${
              isRequired ? 'text-[#DC2626]' : 'text-[#9CA3AF]'
            }`}
          >
            {isRequired ? 'Required' : 'Optional'}
          </span>
          <Camera className="w-8 h-8 text-[#6C757D]" />
        </button>
        <input
          ref={fileInputRefs[index]}
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleFileSelect(index, e)}
          className="hidden"
        />
      </>
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
              You
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out"
            style={{ width: '88%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-8 pb-28 max-w-[600px] w-full mx-auto">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-2">
          Photos
        </h1>

        <p className="text-[15px] text-[#6C757D] mb-6">
          Add 3 clear photos of yourself
        </p>

        {/* Progress Indicator */}
        <p className="text-sm font-medium text-[#1D3557] mb-4">
          {requiredPhotosCount} of {REQUIRED_COUNT} required photos added
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-[#DC2626]">{error}</p>
          </div>
        )}

        {/* Photo Grid - 3 rows of 2 */}
        <div className="space-y-3 mb-6">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3">
            {renderPhotoSlot(0)}
            {renderPhotoSlot(1)}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-3">
            {renderPhotoSlot(2)}
            {renderPhotoSlot(3)}
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-3">
            {renderPhotoSlot(4)}
            {renderPhotoSlot(5)}
          </div>
        </div>

        {/* Helper Text */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
          <p className="text-sm text-[#6C757D] leading-relaxed">
            Photos must show your face clearly.<br />
            Recent photos only.<br />
            No group photos.
          </p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`
              w-full h-[52px] rounded-xl font-semibold text-base transition-all
              ${
                canContinue
                  ? 'bg-[#9B59B6] hover:bg-[#8E44AD] text-white active:scale-[0.98] shadow-[0_2px_8px_rgba(155,89,182,0.2)]'
                  : 'bg-[#9B59B6] text-white opacity-40 cursor-not-allowed'
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

export default RegistrationScreen19;
