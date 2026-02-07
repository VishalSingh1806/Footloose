import { useState, useRef } from 'react';
import { ChevronLeft, Camera, X } from 'lucide-react';

interface RegistrationScreen20Props {
  onNext: (data: { photos: string[] }) => void;
  onBack: () => void;
}

function RegistrationScreen20({ onNext, onBack }: RegistrationScreen20Props) {
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const MAX_PHOTOS = 3;

  const handleFileSelect = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos];
        newPhotos[index] = reader.result as string;
        setPhotos(newPhotos.filter(photo => photo)); // Remove empty slots
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleAddPhotoClick = (index: number) => {
    fileInputRefs[index].current?.click();
  };

  const handleContinue = () => {
    onNext({ photos });
  };

  const handleSkip = () => {
    onNext({ photos: [] });
  };

  const renderPhotoSlot = (index: number) => {
    const photo = photos[index];

    if (photo) {
      return (
        <div className="relative aspect-square rounded-xl overflow-hidden bg-white border-2 border-[#E5E7EB]">
          <img
            src={photo}
            alt={`Lifestyle photo ${index + 1}`}
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

    if (photos.length < MAX_PHOTOS) {
      return (
        <>
          <button
            onClick={() => handleAddPhotoClick(photos.length)}
            className="aspect-square rounded-xl border-2 border-dashed border-[#E5E7EB] bg-white hover:border-[#E63946]/30 hover:bg-[#FAFAFA] transition-all flex flex-col items-center justify-center gap-2"
          >
            <Camera className="w-8 h-8 text-[#6C757D]" />
            <span className="text-sm font-medium text-[#6C757D]">Add Photo</span>
          </button>
          <input
            ref={fileInputRefs[photos.length]}
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => handleFileSelect(photos.length, e)}
            className="hidden"
          />
        </>
      );
    }

    return null;
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
            className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] transition-all duration-500 ease-out"
            style={{ width: '91%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-8 pb-32 max-w-[600px] w-full mx-auto">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-2">
          Your life in moments
        </h1>

        <p className="text-base text-[#6C757D] mb-6">
          Share photos of your hobbies, travels, or interests
        </p>

        {/* Photo Grid */}
        <div className="mb-6">
          {/* Top Row - 2 photos */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {renderPhotoSlot(0)}
            {renderPhotoSlot(1)}
          </div>

          {/* Bottom Row - 1 photo centered */}
          {(photos.length >= 2 || photos.length === MAX_PHOTOS) && (
            <div className="grid grid-cols-2 gap-3">
              <div></div>
              {renderPhotoSlot(2)}
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
          <p className="text-xs text-[#6C757D] leading-relaxed">
            • Show your interests and hobbies<br />
            • Travel photos<br />
            • Activities you enjoy<br />
            • Things that represent you
          </p>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleContinue}
            className="w-full h-[52px] rounded-xl font-semibold text-base transition-all bg-[#E63946] hover:bg-[#D62828] text-white active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)]"
            aria-label="Continue to next step"
          >
            Continue
          </button>

          {/* Skip Link */}
          <button
            onClick={handleSkip}
            className="w-full mt-3 text-sm text-[#6C757D] hover:text-[#1D3557] transition-colors"
            aria-label="Skip for now"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationScreen20;
