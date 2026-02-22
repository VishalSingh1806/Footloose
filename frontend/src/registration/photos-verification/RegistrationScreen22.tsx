import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Camera, AlertCircle, Check, Loader2 } from 'lucide-react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// ── Eye landmark indices (MediaPipe 468-point model) ───────────────────────
const RIGHT_EYE_IDX = [33, 160, 158, 133, 153, 144];
const LEFT_EYE_IDX  = [362, 385, 387, 263, 373, 380];

// EAR thresholds — eyes closed below CLOSED, open above OPEN
const EAR_CLOSED = 0.18;
const EAR_OPEN   = 0.23;

function eyeAspectRatio(
  landmarks: { x: number; y: number }[],
  idx: number[],
): number {
  const [p1, p2, p3, p4, p5, p6] = idx.map(i => landmarks[i]);
  const a = Math.hypot(p2.x - p6.x, p2.y - p6.y);
  const b = Math.hypot(p3.x - p5.x, p3.y - p5.y);
  const c = Math.hypot(p1.x - p4.x, p1.y - p4.y);
  return (a + b) / (2 * c);
}

interface RegistrationScreen22Props {
  onNext: () => void;
  onBack: () => void;
}

type VerificationState = 'camera' | 'preview' | 'processing' | 'verified' | 'review' | 'failed';
type DetectorState = 'loading' | 'ready' | 'error';

type Point = { x: number; y: number };

const MIN_FACE_WIDTH_RATIO = 0.16;
const MIN_FACE_HEIGHT_RATIO = 0.20;
const MAX_FACE_CENTER_OFFSET = 0.28;

function getFaceBounds(landmarks: Point[]) {
  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;

  for (const p of landmarks) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}

function isFaceWellPositioned(landmarks: Point[]) {
  if (!landmarks.length) return false;
  const bounds = getFaceBounds(landmarks);
  const centeredX = Math.abs(bounds.centerX - 0.5) <= MAX_FACE_CENTER_OFFSET;
  const centeredY = Math.abs(bounds.centerY - 0.5) <= MAX_FACE_CENTER_OFFSET;

  return (
    bounds.width >= MIN_FACE_WIDTH_RATIO &&
    bounds.height >= MIN_FACE_HEIGHT_RATIO &&
    centeredX &&
    centeredY
  );
}

function RegistrationScreen22({ onNext, onBack }: RegistrationScreen22Props) {
  const [verificationState, setVerificationState] = useState<VerificationState>('camera');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [detectorState, setDetectorState] = useState<DetectorState>('loading');
  const [detectorError, setDetectorError] = useState('');
  const [faceInFrame, setFaceInFrame] = useState(false);
  const [livenessConfirmed, setLivenessConfirmed] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef   = useRef<HTMLVideoElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const landmarkerRef  = useRef<FaceLandmarker | null>(null);
  const animFrameRef   = useRef<number | null>(null);
  const eyeClosedRef   = useRef(false); // tracks blink state machine
  const processingTimeoutRef = useRef<number | null>(null);
  const advanceTimeoutRef = useRef<number | null>(null);
  const lastInferenceTimeRef = useRef(0);

  const clearPendingTimeouts = () => {
    if (processingTimeoutRef.current) {
      window.clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
    if (advanceTimeoutRef.current) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  };

  const stopActiveStream = () => {
    setStream(prev => {
      prev?.getTracks().forEach(track => track.stop());
      return null;
    });
  };

  // ── Initialise FaceLandmarker once on mount ──────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
        let landmarker: FaceLandmarker;

        try {
          landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: '/models/face_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
            minFaceDetectionConfidence: 0.5,
            minFacePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        } catch {
          landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: '/models/face_landmarker.task',
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
            minFaceDetectionConfidence: 0.5,
            minFacePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        }

        if (!cancelled) {
          landmarkerRef.current = landmarker;
          setDetectorState('ready');
          setDetectorError('');
        }
      } catch (err) {
        console.error('MediaPipe FaceLandmarker failed to load:', err);
        if (!cancelled) {
          setDetectorState('error');
          setDetectorError('Selfie checks could not start. Please refresh and try again.');
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      clearPendingTimeouts();
      landmarkerRef.current?.close();
    };
  }, []);

  // ── Start camera on mount ─────────────────────────────────────────────────
  useEffect(() => {
    checkCameraPermission();
  }, []);

  // ── Connect stream to video whenever stream or state changes ──────────────
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, verificationState]);

  // ── Clean up stream tracks when stream changes or on unmount ─────────────
  useEffect(() => {
    return () => {
      clearPendingTimeouts();
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  useEffect(() => {
    if (verificationState !== 'camera') {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      stopActiveStream();
    }
  }, [verificationState]);

  // ── Face detection + blink-detection loop ─────────────────────────────────
  useEffect(() => {
    if (!stream || verificationState !== 'camera' || detectorState !== 'ready') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const detect = () => {
      const video    = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (landmarker && video && video.readyState >= 2) {
        const now = performance.now();
        if (now - lastInferenceTimeRef.current < 150) {
          animFrameRef.current = requestAnimationFrame(detect);
          return;
        }
        lastInferenceTimeRef.current = now;
        const result = landmarker.detectForVideo(video, now);

        if (result.faceLandmarks.length > 0) {
          const lm = result.faceLandmarks[0];
          const faceReady = isFaceWellPositioned(lm);
          setFaceInFrame(faceReady);
          if (!faceReady) {
            setLivenessConfirmed(false);
            eyeClosedRef.current = false;
          } else {
            const leftEAR  = eyeAspectRatio(lm, LEFT_EYE_IDX);
            const rightEAR = eyeAspectRatio(lm, RIGHT_EYE_IDX);
            const avgEAR   = (leftEAR + rightEAR) / 2;

            if (avgEAR < EAR_CLOSED) {
            // Eye is closed — mark for blink
            eyeClosedRef.current = true;
            } else if (avgEAR > EAR_OPEN && eyeClosedRef.current) {
            // Eye re-opened after being closed → full blink complete
              eyeClosedRef.current = false;
              setLivenessConfirmed(true);
            }
          }
        } else {
          setFaceInFrame(false);
          setLivenessConfirmed(false);
          eyeClosedRef.current = false;
        }
      }

      animFrameRef.current = requestAnimationFrame(detect);
    };

    animFrameRef.current = requestAnimationFrame(detect);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [stream, verificationState, detectorState]);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setHasPermission(result.state === 'granted');
      if (result.state === 'granted') startCamera();
    } catch {
      // permissions.query not supported (e.g. iOS Safari) — attempt directly
      startCamera();
    }
  };

  const requestCameraPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      setHasPermission(true);
    } catch {
      setHasPermission(false);
    }
  };

  const startCamera = async () => {
    try {
      clearPendingTimeouts();
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
    } catch {
      setHasPermission(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !landmarkerRef.current) return;
    if (!livenessConfirmed) return;

    const liveCheck = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
    const currentFaceReady =
      liveCheck.faceLandmarks.length > 0 && isFaceWellPositioned(liveCheck.faceLandmarks[0]);

    if (!currentFaceReady) {
      setFaceInFrame(false);
      setLivenessConfirmed(false);
      return;
    }
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
      setVerificationState('preview');
    }
  };

  const handleRetake = () => {
    clearPendingTimeouts();
    setCapturedImage(null);
    setFaceInFrame(false);
    setLivenessConfirmed(false);
    eyeClosedRef.current = false;
    setVerificationState('camera');
    if (!stream) startCamera();
  };

  const handleUseThis = () => {
    if (!capturedImage) return;
    clearPendingTimeouts();
    setVerificationState('processing');
    processingTimeoutRef.current = window.setTimeout(() => {
      setVerificationState('review');
    }, 1200);
  };

  const handleContactSupport = () => {
    // Support contact to be implemented
  };

  // ── Derived UI values ─────────────────────────────────────────────────────
  const ovalColor = livenessConfirmed
    ? 'border-[#10B981]'
    : faceInFrame
    ? 'border-[#F59E0B]'
    : 'border-white/50';

  const containerBorder = livenessConfirmed
    ? 'border-[#10B981]'
    : faceInFrame
    ? 'border-[#F59E0B]'
    : 'border-[#E5E7EB]';

  const statusText = detectorState === 'error'
    ? 'Selfie check unavailable'
    : detectorState !== 'ready'
    ? 'Loading detector...'
    : livenessConfirmed
    ? 'Liveness confirmed'
    : faceInFrame
    ? 'Good! Now blink naturally'
    : 'Position your face in the oval';

  const statusBg = detectorState === 'error'
    ? 'bg-[#DC2626] text-white'
    : detectorState !== 'ready'
    ? 'bg-black/50 text-white'
    : livenessConfirmed
    ? 'bg-[#10B981] text-white'
    : faceInFrame
    ? 'bg-[#F59E0B] text-white'
    : 'bg-black/50 text-white';

  // ── Permission denied ─────────────────────────────────────────────────────
  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="px-5 pt-4 pb-3 relative">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-[#FAFAFA] rounded-lg transition-colors absolute left-3 top-3" aria-label="Go back">
              <ChevronLeft className="w-6 h-6 text-[#1D3557]" />
            </button>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">Video Verification</p>
            </div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out" style={{ width: '94%' }} />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-8 h-8 text-[#DC2626]" />
            </div>
            <h1 className="text-2xl font-semibold text-[#1D3557] mb-3">Camera access needed</h1>
            <p className="text-base text-[#6C757D] mb-8">
              We need camera access to verify your identity. This helps prevent fake profiles and keeps the community safe.
            </p>
            <button onClick={requestCameraPermission} className="w-full h-[52px] bg-[#9B59B6] hover:bg-[#8E44AD] text-white font-semibold text-base rounded-xl transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(155,89,182,0.2)]">
              Enable Camera
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Processing ────────────────────────────────────────────────────────────
  if (verificationState === 'processing') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="px-5 pt-4 pb-3">
            <div className="text-center"><p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">Video Verification</p></div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out" style={{ width: '94%' }} />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#9B59B6] animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-[#1D3557]">Verifying...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Verified ──────────────────────────────────────────────────────────────
  if (verificationState === 'verified') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="px-5 pt-4 pb-3">
            <div className="text-center"><p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">Video Verification</p></div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out" style={{ width: '94%' }} />
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

  // ── Manual review ─────────────────────────────────────────────────────────
  if (verificationState === 'review') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="px-5 pt-4 pb-3">
            <div className="text-center"><p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">Video Verification</p></div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out" style={{ width: '94%' }} />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#FEF3C7] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <h2 className="text-xl font-semibold text-[#1D3557] mb-3">Sent for manual review</h2>
            <p className="text-base text-[#6C757D] mb-8">Verification typically takes 2–4 hours</p>
            <button onClick={onNext} className="w-full h-[52px] bg-[#9B59B6] hover:bg-[#8E44AD] text-white font-semibold text-base rounded-xl transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(155,89,182,0.2)]">
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Failed ────────────────────────────────────────────────────────────────
  if (verificationState === 'failed') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="px-5 pt-4 pb-3">
            <div className="text-center"><p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">Video Verification</p></div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out" style={{ width: '94%' }} />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-[#DC2626]" />
            </div>
            <h2 className="text-xl font-semibold text-[#1D3557] mb-3">Photo mismatch detected</h2>
            <div className="space-y-3">
              <button onClick={handleRetake} className="w-full h-[52px] bg-[#9B59B6] hover:bg-[#8E44AD] text-white font-semibold text-base rounded-xl transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(155,89,182,0.2)]">
                Retake
              </button>
              <button onClick={handleContactSupport} className="w-full h-[52px] bg-white hover:bg-[#FAFAFA] text-[#1D3557] font-semibold text-base rounded-xl transition-all border-2 border-[#E5E7EB]">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Preview ───────────────────────────────────────────────────────────────
  if (verificationState === 'preview' && capturedImage) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="px-5 pt-4 pb-3">
            <div className="text-center"><p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">Video Verification</p></div>
          </div>
          <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out" style={{ width: '94%' }} />
          </div>
        </div>
        <div className="flex-1 px-5 py-8 max-w-[600px] w-full mx-auto">
          <div className="mb-6">
            <img src={capturedImage} alt="Captured selfie" className="w-full h-[300px] object-cover rounded-2xl" />
          </div>
          <div className="space-y-3">
            <button onClick={handleUseThis} className="w-full h-[52px] bg-[#9B59B6] hover:bg-[#8E44AD] text-white font-semibold text-base rounded-xl transition-all active:scale-[0.98] shadow-[0_2px_8px_rgba(155,89,182,0.2)]">
              Use This
            </button>
            <button onClick={handleRetake} className="w-full h-[52px] bg-white hover:bg-[#FAFAFA] text-[#1D3557] font-semibold text-base rounded-xl transition-all border-2 border-[#E5E7EB]">
              Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main camera view ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="px-5 pt-4 pb-3 relative">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-[#FAFAFA] rounded-lg transition-colors absolute left-3 top-3" aria-label="Go back">
            <ChevronLeft className="w-6 h-6 text-[#1D3557]" />
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">Video Verification</p>
          </div>
        </div>
        <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out" style={{ width: '94%' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-6 max-w-[600px] w-full mx-auto pb-32">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-2">Quick selfie</h1>
        <p className="text-[15px] text-[#6C757D] mb-2">Confirm you match your photos</p>
        <p className="text-xs text-[#9CA3AF] mb-6">
          This prevents fake profiles and confirms you are who you say you are.
        </p>

        {/* Camera View */}
        <div className="mb-6 relative">
          <div
            className={`relative rounded-2xl overflow-hidden bg-black border-2 transition-colors duration-300 ${containerBorder}`}
            style={{ height: '300px' }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Face guide oval */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-48 h-64 rounded-[50%] border-4 transition-colors duration-300 ${ovalColor}`}
                style={{ borderStyle: 'dashed' }}
              />
            </div>

            {/* Status pill */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className={`text-sm font-medium px-4 py-2 rounded-full inline-block transition-colors duration-300 ${statusBg}`}>
                {statusText}
              </p>
            </div>
          </div>

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] mb-6">
          <ol className="space-y-2 text-sm text-[#6C757D]">
            <li className="flex items-start"><span className="font-semibold text-[#1D3557] mr-2">1.</span><span>Face camera directly in good lighting</span></li>
            <li className="flex items-start"><span className="font-semibold text-[#1D3557] mr-2">2.</span><span>Remove sunglasses or face coverings</span></li>
            <li className="flex items-start">
              <span className="font-semibold text-[#1D3557] mr-2">3.</span>
              <span>
                When the oval turns <span className="text-[#F59E0B] font-semibold">amber</span>, blink naturally to confirm you're live
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-[#1D3557] mr-2">4.</span>
              <span>
                Capture unlocks once the oval turns <span className="text-[#10B981] font-semibold">green</span>
              </span>
            </li>
          </ol>
        </div>

        {detectorState === 'error' && (
          <div className="bg-[#FEF2F2] rounded-xl p-4 border border-[#FCA5A5] mb-6">
            <p className="text-sm text-[#DC2626]">
              {detectorError || 'Selfie checks could not start. Please refresh and try again.'}
            </p>
          </div>
        )}

        {/* Privacy note */}
        <div className="bg-[#F3F4F6] rounded-xl p-4 border border-[#E5E7EB]">
          <p className="text-xs text-[#6C757D] leading-relaxed">
            This photo is used only for identity verification. It is not stored after review.
          </p>
        </div>
      </div>

      {/* Capture button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto flex justify-center">
          <button
            onClick={capturePhoto}
            disabled={!livenessConfirmed || detectorState !== 'ready'}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              livenessConfirmed && detectorState === 'ready'
                ? 'bg-[#9B59B6] hover:bg-[#8E44AD] active:scale-95 shadow-[0_4px_12px_rgba(155,89,182,0.3)]'
                : 'bg-[#9B59B6] opacity-40 cursor-not-allowed'
            }`}
            aria-label="Capture selfie"
          >
            <Camera className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default RegistrationScreen22;
