import { useState, useEffect, useRef } from 'react';
import CallGuidelines from './CallGuidelines';
import CallWaiting from './CallWaiting';
import VideoCallRoom from './VideoCallRoom';
import CallEnded from './CallEnded';
import PostCallFeedback, { FeedbackData } from './PostCallFeedback';
import SpeedDateConfirmed from './SpeedDateConfirmed';

type CallState =
  | 'guidelines'
  | 'waiting'
  | 'connecting'
  | 'active'
  | 'ended'
  | 'feedback'
  | 'confirmed';

interface SpeedDateCallFlowProps {
  speedDateId: string;
  matchId: string;
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  matchLocation: string;
  matchOccupation: string;
  compatibility: number;
  scheduledTime: string;
  scheduledDate: string;
  onComplete: () => void;
  onCancel: () => void;
}

/**
 * SpeedDateCallFlow
 *
 * Complete integration of all video call components with WebRTC.
 *
 * FLOW:
 * 1. CallGuidelines → User reads and accepts guidelines
 * 2. CallWaiting → Waiting for other participant to join
 * 3. VideoCallRoom → Active 10-minute video call
 * 4. CallEnded → Quick interest decision
 * 5. PostCallFeedback → Detailed feedback form
 * 6. SpeedDateConfirmed → If mutual interest, show success
 *
 * WEBRTC INTEGRATION:
 * - Uses SimplePeer or native WebRTC
 * - Signaling via WebSocket
 * - P2P connection for video/audio
 * - Error handling for all scenarios
 */
function SpeedDateCallFlow({
  speedDateId,
  matchId,
  matchName,
  matchAge,
  matchPhoto,
  matchLocation,
  matchOccupation,
  compatibility,
  scheduledTime,
  scheduledDate,
  onComplete,
  onCancel,
}: SpeedDateCallFlowProps) {
  const [callState, setCallState] = useState<CallState>('guidelines');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [userDecision, setUserDecision] = useState<boolean | null>(null);
  const [mutualInterest, setMutualInterest] = useState(false);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const callStartTime = useRef<number>(0);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize media devices and WebRTC
  useEffect(() => {
    if (callState === 'waiting' || callState === 'active') {
      initializeMediaDevices();
    }

    return () => {
      cleanupMedia();
    };
  }, [callState]);

  // Track call duration
  useEffect(() => {
    if (callState === 'active' && !durationInterval.current) {
      callStartTime.current = Date.now();
      durationInterval.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - callStartTime.current) / 1000);
        setCallDuration(elapsed);
      }, 1000);
    }

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
    };
  }, [callState]);

  /**
   * Initialize camera and microphone
   */
  const initializeMediaDevices = async () => {
    try {
      console.log('Requesting camera and microphone access...');

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 720 },
          height: { ideal: 1280 },
          facingMode: 'user',
          frameRate: { ideal: 30, max: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log('Media access granted:', stream.getTracks());
      setLocalStream(stream);

      // Initialize WebRTC peer connection
      if (callState === 'waiting') {
        initializeWebRTC(stream);
      }
    } catch (error: any) {
      console.error('Failed to get media devices:', error);

      let errorMessage = 'Unable to access camera or microphone.\n\n';

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += 'Permission denied. Please allow camera and microphone access in your browser settings.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage += 'No camera or microphone found on your device.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage += 'Camera or microphone is already in use by another application.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Camera settings not supported by your device.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'HTTPS is required for camera access. Please use a secure connection.';
      } else {
        errorMessage += `Error: ${error.message}`;
      }

      alert(errorMessage);

      // Go back to guidelines or cancel
      onCancel();
    }
  };

  /**
   * Initialize WebRTC peer connection
   */
  const initializeWebRTC = async (stream: MediaStream) => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // Add TURN servers for production
        // { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' },
      ],
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnection.current = pc;

    // Add local stream tracks to peer connection
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        // Both participants connected, start call
        setCallState('active');
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer via signaling server
        sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
          speedDateId,
        });
      }
    };

    // Monitor connection state
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        // Handle disconnection
        console.error('Connection lost');
      }
    };

    // Create and send offer (simplified - in production, use proper signaling)
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Send offer to remote peer via signaling server
    sendSignalingMessage({
      type: 'offer',
      sdp: offer.sdp,
      speedDateId,
    });
  };

  /**
   * Send signaling message to server
   * In production, this would use WebSocket
   */
  const sendSignalingMessage = (message: any) => {
    // Implement WebSocket signaling
    console.log('Sending signaling message:', message);
    // ws.send(JSON.stringify(message));
  };

  /**
   * Cleanup media streams and peer connection
   */
  const cleanupMedia = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (remoteStream) {
      setRemoteStream(null);
    }
  };

  /**
   * Handle joining call from guidelines
   */
  const handleJoinCall = () => {
    setCallState('waiting');
  };

  /**
   * Handle not ready
   */
  const handleNotReady = () => {
    // Show reschedule dialog
    alert('Reschedule dialog would appear here');
    onCancel();
  };

  /**
   * Handle call ended
   */
  const handleCallEnd = (reason?: string) => {
    cleanupMedia();
    setCallState('ended');

    // Log call analytics
    console.log('Call ended:', {
      speedDateId,
      duration: callDuration,
      reason,
    });

    // Send to backend
    // api.updateSpeedDate(speedDateId, { status: 'completed', duration: callDuration });
  };

  /**
   * Handle interest decision from CallEnded
   */
  const handleQuickDecision = (interested: boolean | null) => {
    setUserDecision(interested);
    setCallState('feedback');
  };

  /**
   * Handle feedback submission
   */
  const handleFeedbackSubmit = async (feedback: FeedbackData) => {
    console.log('Feedback submitted:', feedback);

    // Send to backend
    // await api.submitSpeedDateFeedback(speedDateId, feedback);

    // Check for mutual interest (in production, get from backend)
    // For demo, randomly decide
    const otherUserInterested = Math.random() > 0.5;
    const mutual = feedback.interestLevel === 'interested' && otherUserInterested;
    setMutualInterest(mutual);

    if (mutual) {
      setCallState('confirmed');
    } else {
      onComplete();
    }
  };

  /**
   * Handle feedback skip
   */
  const handleFeedbackSkip = () => {
    onComplete();
  };

  /**
   * Handle cancel from waiting room
   */
  const handleCancelWaiting = () => {
    cleanupMedia();
    onCancel();
  };

  /**
   * Handle send reminder
   */
  const handleSendReminder = () => {
    console.log('Sending reminder to', matchName);
    // Send push notification via backend
    // api.sendSpeedDateReminder(speedDateId, matchId);
  };

  /**
   * Handle report during call
   */
  const handleReport = () => {
    // Open report modal
    alert('Report modal would open here');
  };

  // Render current state
  return (
    <>
      {callState === 'guidelines' && (
        <CallGuidelines
          matchName={matchName}
          matchAge={matchAge}
          matchPhoto={matchPhoto}
          matchLocation={matchLocation}
          compatibility={compatibility}
          onJoinCall={handleJoinCall}
          onNotReady={handleNotReady}
        />
      )}

      {callState === 'waiting' && (
        <CallWaiting
          matchName={matchName}
          matchAge={matchAge}
          matchPhoto={matchPhoto}
          matchOccupation={matchOccupation}
          matchLocation={matchLocation}
          compatibility={compatibility}
          timeRemaining="09:45"
          cameraWorking={!!localStream?.getVideoTracks()[0]?.enabled}
          micWorking={!!localStream?.getAudioTracks()[0]?.enabled}
          connectionQuality="excellent"
          localStream={localStream}
          onCancel={handleCancelWaiting}
          onSendReminder={handleSendReminder}
        />
      )}

      {callState === 'active' && (
        <VideoCallRoom
          matchName={matchName}
          matchAge={matchAge}
          matchPhoto={matchPhoto}
          localStream={localStream}
          remoteStream={remoteStream}
          onEndCall={handleCallEnd}
          onReport={handleReport}
        />
      )}

      {callState === 'ended' && (
        <CallEnded
          matchName={matchName}
          matchAge={matchAge}
          matchPhoto={matchPhoto}
          callDuration={callDuration}
          onDecision={handleQuickDecision}
          onSkip={() => setCallState('feedback')}
        />
      )}

      {callState === 'feedback' && (
        <PostCallFeedback
          matchName={matchName}
          matchAge={matchAge}
          matchPhoto={matchPhoto}
          matchLocation={matchLocation}
          initialInterest={userDecision}
          onSubmit={handleFeedbackSubmit}
          onSkip={handleFeedbackSkip}
        />
      )}

      {callState === 'confirmed' && mutualInterest && (
        <SpeedDateConfirmed
          matchName={matchName}
          matchAge={matchAge}
          matchPhoto={matchPhoto}
          matchLocation={matchLocation}
          compatibility={compatibility}
          confirmedDate={scheduledDate}
          confirmedTime={scheduledTime}
          dateISO={new Date().toISOString()}
          onAddToCalendar={() => console.log('Add to calendar')}
          onSetReminder={() => console.log('Set reminder')}
          onShare={() => console.log('Share')}
          onViewProfile={() => console.log('View profile')}
          onClose={onComplete}
        />
      )}
    </>
  );
}

export default SpeedDateCallFlow;
