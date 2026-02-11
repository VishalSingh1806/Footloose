import { Mic, MicOff, Video, VideoOff, PhoneOff, RotateCw, Flag } from 'lucide-react';

interface VideoControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onSwitchCamera?: () => void;
  onEndCall: () => void;
  onReport?: () => void;
  showSwitchCamera?: boolean;
}

function VideoControls({
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera,
  onSwitchCamera,
  onEndCall,
  onReport,
  showSwitchCamera = true,
}: VideoControlsProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
      <div className="bg-black/70 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl">
        {/* Mute/Unmute Microphone */}
        <button
          onClick={onToggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
            ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-white hover:bg-gray-100'}
            active:scale-95`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <MicOff size={24} className="text-white" />
          ) : (
            <Mic size={24} className="text-gray-900" />
          )}
        </button>

        {/* Toggle Camera */}
        <button
          onClick={onToggleCamera}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
            ${isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-white hover:bg-gray-100'}
            active:scale-95`}
          aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
        >
          {isCameraOff ? (
            <VideoOff size={24} className="text-white" />
          ) : (
            <Video size={24} className="text-gray-900" />
          )}
        </button>

        {/* Switch Camera (mobile only) */}
        {showSwitchCamera && onSwitchCamera && (
          <button
            onClick={onSwitchCamera}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center
                       active:scale-95 transition-all"
            aria-label="Switch camera"
          >
            <RotateCw size={24} className="text-gray-900" />
          </button>
        )}

        {/* Divider */}
        <div className="w-px h-8 bg-white/20"></div>

        {/* End Call */}
        <button
          onClick={onEndCall}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center
                     active:scale-95 transition-all shadow-lg"
          aria-label="End call"
        >
          <PhoneOff size={28} className="text-white" />
        </button>

        {/* Report (optional) */}
        {onReport && (
          <>
            <div className="w-px h-8 bg-white/20"></div>
            <button
              onClick={onReport}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center
                         active:scale-95 transition-all"
              aria-label="Report"
            >
              <Flag size={20} className="text-white" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VideoControls;
