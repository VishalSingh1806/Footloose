import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Camera, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

interface RegistrationScreen19Props {
  onNext: (data: { photos: string[] }) => void;
  onBack: () => void;
}

type PhotoStatus = 'idle' | 'checking' | 'valid' | 'invalid';
type DetectorState = 'loading' | 'ready' | 'error';

function RegistrationScreen19({ onNext, onBack }: RegistrationScreen19Props) {
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [photoStatuses, setPhotoStatuses] = useState<PhotoStatus[]>(Array(6).fill('idle'));
  const [photoErrors, setPhotoErrors] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [detectorState, setDetectorState] = useState<DetectorState>('loading');
  const detectorRef = useRef<FaceDetector | null>(null);
  const validationRequestIdsRef = useRef<number[]>(Array(6).fill(0));

  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const REQUIRED_COUNT = 3;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MIN_FACE_AREA_RATIO = 0.03;

  // ── Initialise FaceDetector (IMAGE mode) on mount ─────────────────────────
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/models/blaze_face_short_range.tflite',
            delegate: 'GPU',
          },
          runningMode: 'IMAGE',
          minDetectionConfidence: 0.5,
        });
        if (!cancelled) {
          detectorRef.current = detector;
          setDetectorState('ready');
        }
      } catch (err) {
        console.error('Face detector failed to load:', err);
        if (!cancelled) setDetectorState('error');
      }
    };
    init();
    return () => {
      cancelled = true;
      detectorRef.current?.close();
    };
  }, []);

  // ── Run face check on a data-URL image ───────────────────────────────────
  const checkForFace = (dataUrl: string, index: number) => {
    const requestId = ++validationRequestIdsRef.current[index];

    const setSlotValidation = (status: PhotoStatus, message = '') => {
      if (validationRequestIdsRef.current[index] !== requestId) return;
      setPhotoStatuses(prev => {
        const next = [...prev];
        next[index] = status;
        return next;
      });
      setPhotoErrors(prev => {
        const next = [...prev];
        next[index] = message;
        return next;
      });
    };

    // Mark as checking immediately
    setSlotValidation('checking', '');

    const img = new Image();
    img.onload = () => {
      const detector = detectorRef.current;
      if (!detector) {
        // Model not yet ready or failed — accept photo and let server-side verify
        setSlotValidation('valid');
        return;
      }
      try {
        const result = detector.detect(img);
        const detections = result.detections ?? [];

        if (detections.length === 0) {
          setSlotValidation('invalid', 'No face detected');
          return;
        }

        if (detections.length > 1) {
          setSlotValidation('invalid', 'Use a photo with only one face');
          return;
        }

        const bbox = detections[0].boundingBox;
        if (bbox && img.naturalWidth && img.naturalHeight) {
          const faceAreaRatio =
            (Math.max(0, bbox.width) * Math.max(0, bbox.height)) /
            (img.naturalWidth * img.naturalHeight);

          if (faceAreaRatio < MIN_FACE_AREA_RATIO) {
            setSlotValidation('invalid', 'Move closer so your face is clearly visible');
            return;
          }
        }

        setSlotValidation('valid', '');
      } catch {
        setSlotValidation('invalid', 'Could not verify face. Please try a different photo.');
      }
    };
    img.onerror = () => {
      setSlotValidation('invalid', 'Could not read that image');
    };
    img.src = dataUrl;
  };

  const handleFileSelect = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setError('Only JPG or PNG images are accepted.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be under 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setPhotos(prev => {
        const next = [...prev];
        next[index] = dataUrl;
        return next;
      });
      checkForFace(dataUrl, index);
    };
    reader.readAsDataURL(file);

    if (event.target) event.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    validationRequestIdsRef.current[index] += 1;
    setPhotos(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setPhotoStatuses(prev => {
      const next = [...prev];
      next[index] = 'idle';
      return next;
    });
    setPhotoErrors(prev => {
      const next = [...prev];
      next[index] = '';
      return next;
    });
  };

  const handleAddPhotoClick = (index: number) => {
    fileInputRefs[index].current?.click();
  };

  // All 3 required slots must be 'valid'
  const validRequiredCount = photos
    .slice(0, REQUIRED_COUNT)
    .filter((p, i) => p !== null && photoStatuses[i] === 'valid').length;
  const canContinue = validRequiredCount === REQUIRED_COUNT;

  const handleContinue = () => {
    if (canContinue) {
      const filledPhotos = photos.filter((p, i) => p !== null && photoStatuses[i] === 'valid') as string[];
      onNext({ photos: filledPhotos });
    }
  };

  const renderPhotoSlot = (index: number) => {
    const photo = photos[index];
    const status = photoStatuses[index];
    const isRequired = index < REQUIRED_COUNT;

    if (photo) {
      return (
        <div className="relative aspect-square">
          {/* Photo */}
          <div
            className={`relative w-full h-full rounded-xl overflow-hidden border-2 transition-colors ${
              status === 'valid'
                ? 'border-[#10B981]'
                : status === 'invalid'
                ? 'border-[#DC2626]'
                : 'border-[#E5E7EB]'
            }`}
          >
            <img
              src={photo}
              alt={`Profile photo ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Checking overlay */}
            {status === 'checking' && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
                <p className="text-white text-xs font-medium">Checking…</p>
              </div>
            )}

            {/* Invalid overlay */}
            {status === 'invalid' && (
              <div className="absolute inset-0 bg-[#DC2626]/70 flex flex-col items-center justify-center gap-1 px-2">
                <AlertCircle className="w-6 h-6 text-white" />
                <p className="text-white text-[11px] font-semibold text-center leading-tight">
                  {photoErrors[index] || 'Invalid photo'}
                </p>
                <p className="text-white/80 text-[10px] text-center">
                  Use a clear solo photo of your face
                </p>
              </div>
            )}

            {/* Valid badge */}
            {status === 'valid' && (
              <div className="absolute top-2 left-2">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] drop-shadow" />
              </div>
            )}

            {/* Remove button — always visible so user can swap invalid photos */}
            <button
              onClick={() => handleRemovePhoto(index)}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
              aria-label="Remove photo"
            >
              <X className="w-4 h-4 text-[#1D3557]" />
            </button>
          </div>
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
            <p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">You</p>
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
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-2">Photos</h1>

        <p className="text-[15px] text-[#6C757D] mb-6">
          Put your best foot forward with profile photos.
        </p>

        {/* Progress Indicator */}
        <p className="text-sm font-medium text-[#1D3557] mb-4">
          {validRequiredCount} of {REQUIRED_COUNT} required photos added
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-[#DC2626]">{error}</p>
          </div>
        )}

        {detectorState === 'error' && (
          <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-[#DC2626]">
              Face validation is unavailable right now. Please refresh and try again.
            </p>
          </div>
        )}

        {/* Photo Grid */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-3">
            {renderPhotoSlot(0)}
            {renderPhotoSlot(1)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {renderPhotoSlot(2)}
            {renderPhotoSlot(3)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {renderPhotoSlot(4)}
            {renderPhotoSlot(5)}
          </div>
        </div>

        {/* Helper Text */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
          <p className="text-sm text-[#6C757D] leading-relaxed">
            Each photo must clearly show your face.<br />
            Recent photos only. No group photos.
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
