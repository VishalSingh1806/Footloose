import { useRef, useEffect } from 'react';
import { Video as VideoIcon, Volume2, VolumeX } from 'lucide-react';

interface ParticipantVideoProps {
  stream?: MediaStream | null;
  name: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
  isLocalUser?: boolean;
  fallbackPhoto?: string;
  className?: string;
  onSwapView?: () => void;
}

function ParticipantVideo({
  stream,
  name,
  isMuted = false,
  isSpeaking = false,
  isLocalUser = false,
  fallbackPhoto,
  className = '',
  onSwapView,
}: ParticipantVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const hasVideo = stream && stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled;

  return (
    <div
      className={`relative overflow-hidden bg-gray-900 ${className}`}
      onClick={onSwapView}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocalUser}
          className={`w-full h-full object-cover ${isLocalUser ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
          {fallbackPhoto ? (
            <img src={fallbackPhoto} alt={name} className="w-full h-full object-cover opacity-50" />
          ) : (
            <VideoIcon size={64} className="text-white/30" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-lg">Camera off</p>
          </div>
        </div>
      )}

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="absolute inset-0 border-4 border-green-500 pointer-events-none"></div>
      )}

      {/* Name Label */}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
        <span className="text-white font-semibold text-sm">{name}</span>
      </div>

      {/* Muted Indicator */}
      {isMuted && (
        <div className="absolute bottom-3 right-3 bg-red-600 rounded-full p-2">
          <VolumeX size={16} className="text-white" />
        </div>
      )}

      {/* Speaking Audio Waveform */}
      {isSpeaking && !isMuted && (
        <div className="absolute bottom-3 right-3 bg-green-600 rounded-full p-2 animate-pulse">
          <Volume2 size={16} className="text-white" />
        </div>
      )}

      {/* Tap to swap indicator (for PiP view) */}
      {onSwapView && className.includes('cursor-pointer') && (
        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
          Tap to swap
        </div>
      )}
    </div>
  );
}

export default ParticipantVideo;
