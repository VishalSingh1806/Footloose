import { useState, useEffect, useRef } from 'react';
import ParticipantVideo from './ParticipantVideo';
import VideoControls from './VideoControls';
import CallTimer from './CallTimer';
import ConnectionQuality from './ConnectionQuality';
import EmergencyExit from './EmergencyExit';
import TechnicalIssue from './TechnicalIssue';
import { useBackButton } from '../../hooks/useBackButton';

interface VideoCallRoomProps {
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEndCall: (reason?: string) => void;
  onReport: () => void;
  onJoined?: (joinedAt: string) => void; // Server logs join timestamp for no-show detection
}

function VideoCallRoom({
  matchName,
  matchPhoto,
  localStream,
  remoteStream,
  onEndCall,
  onReport,
  onJoined,
}: VideoCallRoomProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'fair' | 'poor'>('excellent');
  const [showEmergencyExit, setShowEmergencyExit] = useState(false);
  const [showTechnicalIssue, setShowTechnicalIssue] = useState(false);
  const [technicalIssueType, setTechnicalIssueType] = useState<string>('');
  const [isRemoteSpeaking, setIsRemoteSpeaking] = useState(false);
  const [isLocalSpeaking, setIsLocalSpeaking] = useState(false);
  const [viewSwapped, setViewSwapped] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Track join timestamp and call duration for no-show detection and emergency exit logging
  const joinedAtRef = useRef<string>(new Date().toISOString());
  const callDurationRef = useRef<number>(0);

  // Handle Android back gesture during active call - show emergency exit
  useBackButton(() => setShowEmergencyExit(true));

  // Log join timestamp to server on mount (for no-show detection)
  useEffect(() => {
    const joinedAt = new Date().toISOString();
    joinedAtRef.current = joinedAt;
    onJoined?.(joinedAt);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track call duration in seconds
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      callDurationRef.current = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle mute toggle
  const handleToggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Handle camera toggle
  const handleToggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        const newState = !videoTrack.enabled;
        videoTrack.enabled = newState;
        setIsCameraOff(!newState);

        // Show warning if turning off camera
        if (!newState) {
          setShowTimeWarning(true);
          setWarningMessage('Turning camera off may violate guidelines');
          setTimeout(() => setShowTimeWarning(false), 3000);
        }
      }
    }
  };

  // Handle camera switch (front/back on mobile)
  const handleSwitchCamera = () => {
    // Implementation would involve getting new stream with different facingMode
    console.log('Switch camera');
  };

  // Handle end call
  const handleEndCall = () => {
    setShowEmergencyExit(true);
  };

  // Handle time warnings
  const handleTimeWarning = (secondsLeft: number) => {
    let message = '';
    if (secondsLeft === 300) message = '5 minutes left';
    else if (secondsLeft === 60) message = '1 minute remaining';
    else if (secondsLeft === 30) message = '30 seconds left';
    else if (secondsLeft === 10) message = '10 seconds left';

    if (message) {
      setWarningMessage(message);
      setShowTimeWarning(true);
      setTimeout(() => setShowTimeWarning(false), 2000);
    }
  };

  // Handle time up
  const handleTimeUp = () => {
    setWarningMessage("Time's up!");
    setShowTimeWarning(true);
    setTimeout(() => {
      onEndCall('completed');
    }, 5000); // 5 second grace period
  };

  // Simulate connection quality monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // In real app, monitor actual connection stats
      const random = Math.random();
      if (random < 0.7) setConnectionQuality('excellent');
      else if (random < 0.9) setConnectionQuality('fair');
      else setConnectionQuality('poor');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate speaking detection
  useEffect(() => {
    // In real app, use Web Audio API to detect audio levels
    const interval = setInterval(() => {
      setIsRemoteSpeaking(Math.random() > 0.7);
      setIsLocalSpeaking(Math.random() > 0.7);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Check for technical issues
  useEffect(() => {
    if (!localStream) {
      setTechnicalIssueType('no_local_stream');
      setShowTechnicalIssue(true);
    }
  }, [localStream]);

  const largeStream = viewSwapped ? localStream : remoteStream;
  const smallStream = viewSwapped ? remoteStream : localStream;
  const largeName = viewSwapped ? 'You' : matchName;
  const smallName = viewSwapped ? matchName : 'You';

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Large Video (Main View) */}
      <ParticipantVideo
        stream={largeStream}
        name={largeName}
        isMuted={viewSwapped ? isMuted : false}
        isSpeaking={viewSwapped ? isLocalSpeaking : isRemoteSpeaking}
        isLocalUser={viewSwapped}
        fallbackPhoto={viewSwapped ? undefined : matchPhoto}
        className="w-full h-full"
      />

      {/* Small Video (Picture-in-Picture) */}
      <div className="absolute bottom-32 right-4 w-28 h-40 sm:w-32 sm:h-44">
        <ParticipantVideo
          stream={smallStream}
          name={smallName}
          isMuted={viewSwapped ? false : isMuted}
          isSpeaking={viewSwapped ? isRemoteSpeaking : isLocalSpeaking}
          isLocalUser={!viewSwapped}
          fallbackPhoto={viewSwapped ? matchPhoto : undefined}
          className="w-full h-full rounded-xl border-2 border-white shadow-2xl cursor-pointer"
          onSwapView={() => setViewSwapped(!viewSwapped)}
        />
      </div>

      {/* Timer (Top Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <CallTimer
          initialSeconds={600}
          isPaused={isPaused}
          onTimeUp={handleTimeUp}
          onWarning={handleTimeWarning}
        />
      </div>

      {/* Connection Quality (Top Left) */}
      <div className="absolute top-4 left-4 z-20">
        <ConnectionQuality quality={connectionQuality} />
        {connectionQuality === 'poor' && (
          <p className="text-xs text-white mt-1 bg-black/60 px-2 py-1 rounded">
            Try turning off camera
          </p>
        )}
      </div>

      {/* Time Warning */}
      {showTimeWarning && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-black/80 backdrop-blur-sm
                        px-6 py-3 rounded-full text-white font-semibold animate-pulse">
          {warningMessage}
        </div>
      )}

      {/* Reconnecting Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-25">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="w-16 h-16 border-4 border-[#E63946] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#1D3557] font-semibold">Reconnecting...</p>
          </div>
        </div>
      )}

      {/* Video Controls */}
      <VideoControls
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onToggleMute={handleToggleMute}
        onToggleCamera={handleToggleCamera}
        onSwitchCamera={handleSwitchCamera}
        onEndCall={handleEndCall}
        onReport={onReport}
        showSwitchCamera={true}
      />

      {/* Emergency Exit Modal */}
      {showEmergencyExit && (
        <EmergencyExit
          matchName={matchName}
          callDuration={callDurationRef.current}
          onConfirmEnd={(reason, details) => {
            setShowEmergencyExit(false);
            onEndCall(`${reason}${details ? ': ' + details : ''}`);
          }}
          onContinue={() => setShowEmergencyExit(false)}
        />
      )}

      {/* Technical Issue Modal */}
      {showTechnicalIssue && (
        <TechnicalIssue
          issueType={technicalIssueType}
          onRetry={() => setShowTechnicalIssue(false)}
          onEndCall={() => onEndCall('technical_issue')}
        />
      )}
    </div>
  );
}

export default VideoCallRoom;
