import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Camera, AlertCircle, Check, Loader2 } from 'lucide-react';

interface RegistrationScreen22Props {
  onNext: () => void;
  onBack: () => void;
}

type VerificationState = 'camera' | 'preview' | 'processing' | 'verified' | 'review' | 'failed';

function RegistrationScreen22({ onNext, onBack }: RegistrationScreen22Props) {
  const [verificationState, setVerificationState] = useState<VerificationState>('camera');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    checkCameraPermission();
    return () => {
      // Cleanup: stop video stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setHasPermission(result.state === 'granted');
      if (result.state === 'granted') {
        startCamera();
      }
    } catch (err) {
      // Fallback: try to start camera directly
      setHasPermission(null);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      // Simulate face detection after a short delay
      setTimeout(() => setFaceDetected(true), 2000);
    } catch (err) {
      setHasPermission(false);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      // Simulate face detection
      setTimeout(() => setFaceDetected(true), 2000);
    } catch (err) {
      setHasPermission(false);
    }
  };

  const captureVideo = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedVideo(imageData);
      setVerificationState('preview');
    }
  };

  const handleRetake = () => {
    setCapturedVideo(null);
    setVerificationState('camera');
    setFaceDetected(false);
    setTimeout(() => setFaceDetected(true), 2000);
  };

  const handleUseThis = () => {
    setVerificationState('processing');

    // Simulate verification process (2-5 seconds)
    const processingTime = 2000 + Math.random() * 3000;

    setTimeout(() => {
      // Simulate verification result (80% auto-verified, 15% review, 5% failed)
      const random = Math.random();
      if (random < 0.8) {
        setVerificationState('verified');
        // Auto-advance after 2 seconds
        setTimeout(() => onNext(), 2000);
      } else if (random < 0.95) {
        setVerificationState('review');
      } else {
        setVerificationState('failed');
      }
    }, processingTime);
  };

  const handleContactSupport = () => {
    // Support contact functionality to be implemented
  };

  // Permission request UI
  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
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
                Video Verification
              </p>
            </div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] transition-all duration-500 ease-out"
              style={{ width: '94%' }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-8 h-8 text-[#DC2626]" />
            </div>

            <h1 className="text-2xl font-semibold text-[#1D3557] mb-3">
              Camera access needed
            </h1>

            <p className="text-base text-[#6C757D] mb-8">
              We need camera access to verify your identity. This helps prevent fake profiles and keeps the community safe.
            </p>

            <button
              onClick={requestCameraPermission}
              className="w-full h-[52px] bg-[#E63946] hover:bg-[#D62828] text-white font-semibold text-base rounded-xl transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)]"
            >
              Enable Camera
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Processing state
  if (verificationState === 'processing') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="px-5 pt-4 pb-3">
            <div className="text-center">
              <p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">
                Video Verification
              </p>
            </div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] transition-all duration-500 ease-out"
              style={{ width: '94%' }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#E63946] animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-[#1D3557]">Verifying...</p>
          </div>
        </div>
      </div>
    );
  }

  // Verified state
  if (verificationState === 'verified') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="px-5 pt-4 pb-3">
            <div className="text-center">
              <p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">
                Video Verification
              </p>
            </div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] transition-all duration-500 ease-out"
              style={{ width: '94%' }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4 animate-[scaleIn_0.3s_ease-out]">
              <Check className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-semibold text-[#1D3557]">Verification complete</p>
          </div>
        </div>
      </div>
    );
  }

  // Review state
  if (verificationState === 'review') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="px-5 pt-4 pb-3">
            <div className="text-center">
              <p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">
                Video Verification
              </p>
            </div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] transition-all duration-500 ease-out"
              style={{ width: '94%' }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#FEF3C7] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-[#F59E0B]" />
            </div>

            <h2 className="text-xl font-semibold text-[#1D3557] mb-3">
              Sent for manual review
            </h2>

            <p className="text-base text-[#6C757D] mb-8">
              Verification typically takes 2-4 hours
            </p>

            <button
              onClick={onNext}
              className="w-full h-[52px] bg-[#E63946] hover:bg-[#D62828] text-white font-semibold text-base rounded-xl transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  if (verificationState === 'failed') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="px-5 pt-4 pb-3">
            <div className="text-center">
              <p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">
                Video Verification
              </p>
            </div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] transition-all duration-500 ease-out"
              style={{ width: '94%' }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-[#DC2626]" />
            </div>

            <h2 className="text-xl font-semibold text-[#1D3557] mb-3">
              Photo mismatch detected
            </h2>

            <div className="space-y-3">
              <button
                onClick={handleRetake}
                className="w-full h-[52px] bg-[#E63946] hover:bg-[#D62828] text-white font-semibold text-base rounded-xl transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)]"
              >
                Retake
              </button>

              <button
                onClick={handleContactSupport}
                className="w-full h-[52px] bg-white hover:bg-[#FAFAFA] text-[#1D3557] font-semibold text-base rounded-xl transition-all border-2 border-[#E5E7EB]"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preview state
  if (verificationState === 'preview' && capturedVideo) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="px-5 pt-4 pb-3">
            <div className="text-center">
              <p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">
                Video Verification
              </p>
            </div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] transition-all duration-500 ease-out"
              style={{ width: '94%' }}
            />
          </div>
        </div>

        <div className="flex-1 px-5 py-8 max-w-[600px] w-full mx-auto">
          <div className="mb-6">
            <img
              src={capturedVideo}
              alt="Captured selfie"
              className="w-full h-[300px] object-cover rounded-2xl"
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleUseThis}
              className="w-full h-[52px] bg-[#E63946] hover:bg-[#D62828] text-white font-semibold text-base rounded-xl transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)]"
            >
              Use This
            </button>

            <button
              onClick={handleRetake}
              className="w-full h-[52px] bg-white hover:bg-[#FAFAFA] text-[#1D3557] font-semibold text-base rounded-xl transition-all border-2 border-[#E5E7EB]"
            >
              Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main camera view
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
              Video Verification
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] transition-all duration-500 ease-out"
            style={{ width: '94%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-6 max-w-[600px] w-full mx-auto pb-32">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-2">
          Quick selfie
        </h1>

        <p className="text-[15px] text-[#6C757D] mb-2">
          Confirm you match your photos
        </p>

        <p className="text-xs text-[#9CA3AF] mb-6">
          This prevents fake profiles and confirms you are who you say you are.
        </p>

        {/* Camera View */}
        <div className="mb-6 relative">
          <div
            className={`relative rounded-2xl overflow-hidden bg-black border-2 transition-colors ${
              faceDetected ? 'border-[#10B981]' : 'border-[#E5E7EB]'
            }`}
            style={{ height: '300px' }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Face Guide Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-48 h-64 rounded-[50%] border-4 transition-colors ${
                  faceDetected ? 'border-[#10B981]' : 'border-white/50'
                }`}
                style={{ borderStyle: 'dashed' }}
              />
            </div>

            {/* Face Detection Text */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className={`text-sm font-medium px-4 py-2 rounded-full inline-block ${
                faceDetected
                  ? 'bg-[#10B981] text-white'
                  : 'bg-black/50 text-white'
              }`}>
                {faceDetected ? 'Face detected ✓' : 'Position your face in the oval'}
              </p>
            </div>
          </div>

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] mb-6">
          <ol className="space-y-2 text-sm text-[#6C757D]">
            <li className="flex items-start">
              <span className="font-semibold text-[#1D3557] mr-2">1.</span>
              <span>Face camera directly</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-[#1D3557] mr-2">2.</span>
              <span>Ensure good lighting</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-[#1D3557] mr-2">3.</span>
              <span>Remove sunglasses</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-[#1D3557] mr-2">4.</span>
              <span>Hold still for 2 seconds</span>
            </li>
          </ol>
        </div>

        {/* Privacy Note */}
        <div className="bg-[#F3F4F6] rounded-xl p-4 border border-[#E5E7EB]">
          <p className="text-xs text-[#6C757D] leading-relaxed">
            This short video is used only for identity verification. It is not stored after review.
          </p>
        </div>
      </div>

      {/* Bottom Capture Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto flex justify-center">
          <button
            onClick={captureVideo}
            disabled={!faceDetected}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              faceDetected
                ? 'bg-[#E63946] hover:bg-[#D62828] active:scale-95 shadow-[0_4px_12px_rgba(230,57,70,0.3)]'
                : 'bg-[#E63946] opacity-40 cursor-not-allowed'
            }`}
            aria-label="Capture selfie"
          >
            <Camera className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default RegistrationScreen22;
