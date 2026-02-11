import { useState, useEffect, useRef } from 'react';
import { Video, X, Check, Mic, Wifi, Camera, Bell } from 'lucide-react';
import ConnectionQuality from './ConnectionQuality';
import { useBackButton } from '../../hooks/useBackButton';

interface CallWaitingProps {
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  matchOccupation: string;
  matchLocation: string;
  compatibility: number;
  timeRemaining: string;
  cameraWorking: boolean;
  micWorking: boolean;
  connectionQuality: 'excellent' | 'fair' | 'poor';
  localStream: MediaStream | null;
  onCancel: () => void;
  onSendReminder: () => void;
}

function CallWaiting({
  matchName,
  matchAge,
  matchPhoto,
  matchOccupation,
  matchLocation,
  compatibility,
  timeRemaining,
  cameraWorking,
  micWorking,
  connectionQuality,
  localStream,
  onCancel,
  onSendReminder,
}: CallWaitingProps) {
  const [waitingTime, setWaitingTime] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [reminderSent, setReminderSent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Draggable video preview
  const [videoPosition, setVideoPosition] = useState({ x: window.innerWidth - 152, y: window.innerHeight - 184 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Handle Android back gesture - show cancel confirmation
  useBackButton(() => setShowCancelConfirm(true));

  const conversationTips = [
    "💬 Ask: What's your favorite way to spend weekends?",
    "💬 Ask: What made you try Footloose No More?",
    "💬 Share: Tell them about your recent hobby or interest",
    "💬 Ask: What's most important to you in a relationship?",
    "💬 Share: Your favorite travel destination or dream trip",
    "💬 Ask: How do you like to stay active or healthy?",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setWaitingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tipRotation = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % conversationTips.length);
    }, 5000);

    return () => clearInterval(tipRotation);
  }, [conversationTips.length]);

  // Connect local stream to video element
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleSendReminder = () => {
    setReminderSent(true);
    onSendReminder();
  };

  // Handle drag start
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - videoPosition.x,
      y: clientY - videoPosition.y,
    });
  };

  // Handle drag move
  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;

    // Keep within screen bounds
    const maxX = window.innerWidth - 128; // video width
    const maxY = window.innerHeight - 160; // video height
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));

    setVideoPosition({ x: boundedX, y: boundedY });
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add event listeners for mouse/touch move and end
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

      const newX = clientX - dragOffset.x;
      const newY = clientY - dragOffset.y;

      const maxX = window.innerWidth - 128;
      const maxY = window.innerHeight - 160;
      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));

      setVideoPosition({ x: boundedX, y: boundedY });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset]);

  if (showCancelConfirm) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#1D3557] to-[#2A9D8F] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">Leave Waiting Room?</h2>
          <p className="text-[#6C757D] mb-6">
            Are you sure? This will count as a no-show and may affect your profile.
          </p>
          <div className="space-y-3">
            <button
              onClick={onCancel}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-semibold
                         hover:bg-red-700 active:scale-95 transition-all"
            >
              Yes, Leave
            </button>
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="w-full text-[#6C757D] hover:text-[#1D3557] font-medium py-2"
            >
              Stay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#1D3557] to-[#2A9D8F] flex flex-col">
      {/* Tech Check Status */}
      <div className="absolute top-4 right-4 space-y-2 z-10">
        <div className={`flex items-center gap-2 text-sm ${cameraWorking ? 'text-green-300' : 'text-red-300'}`}>
          {cameraWorking ? <Check size={16} /> : <X size={16} />}
          <Camera size={16} />
          <span>Camera</span>
        </div>
        <div className={`flex items-center gap-2 text-sm ${micWorking ? 'text-green-300' : 'text-red-300'}`}>
          {micWorking ? <Check size={16} /> : <X size={16} />}
          <Mic size={16} />
          <span>Mic</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ConnectionQuality quality={connectionQuality} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <Video size={48} className="text-white" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Status Text */}
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          Waiting for {matchName} to join...
        </h1>
        <p className="text-white/80 text-center mb-6">
          The call will start when both of you are ready
        </p>

        {/* Timer */}
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
          <p className="text-white font-semibold">Time remaining: {timeRemaining}</p>
        </div>

        {/* Profile Reminder */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-6 max-w-sm w-full">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={matchPhoto}
              alt={matchName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
            <div className="flex-1">
              <h3 className="font-bold text-white">{matchName}, {matchAge}</h3>
              <p className="text-sm text-white/80">{matchOccupation} • {matchLocation}</p>
              <p className="text-sm text-green-300 font-semibold">{compatibility}% Match</p>
            </div>
          </div>
        </div>

        {/* Tips Carousel */}
        <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 rounded-xl p-4 max-w-sm w-full mb-6">
          <p className="text-white text-center transition-all duration-500">
            {conversationTips[currentTipIndex]}
          </p>
        </div>
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black/40 to-transparent">
        <div className="flex gap-3 max-w-md mx-auto">
          {/* Cancel Button */}
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-semibold
                       shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <X size={20} />
            <span>Cancel</span>
          </button>

          {/* Send Reminder Button */}
          <button
            onClick={handleSendReminder}
            disabled={reminderSent || waitingTime < 30}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold
                       shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
          >
            <Bell size={20} />
            <span>{reminderSent ? 'Sent ✓' : 'Remind'}</span>
          </button>
        </div>
      </div>

      {/* Status Text */}
      {reminderSent && (
        <div className="absolute bottom-20 left-0 right-0 text-center">
          <p className="text-white/80 text-sm">Reminder sent to {matchName}</p>
        </div>
      )}

      {/* Your Video Preview (draggable) */}
      <div
        ref={videoContainerRef}
        className="absolute w-32 h-40 bg-black rounded-xl overflow-hidden border-2 border-white shadow-lg cursor-move active:cursor-grabbing"
        style={{
          left: `${videoPosition.x}px`,
          top: `${videoPosition.y}px`,
          touchAction: 'none',
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {localStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1] pointer-events-none"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center pointer-events-none">
            <Video size={32} className="text-white/50" />
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-semibold pointer-events-none">
          You
        </div>
        <div className="absolute top-1 right-1 bg-white/20 px-1.5 py-0.5 rounded text-[10px] text-white font-semibold pointer-events-none">
          Drag
        </div>
      </div>
    </div>
  );
}

export default CallWaiting;
