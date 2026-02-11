import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebRTCOptions {
  speedDateId: string;
  userId: string;
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onError?: (error: Error) => void;
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState;
  isConnected: boolean;
  error: Error | null;
  initializeMedia: () => Promise<void>;
  createOffer: () => Promise<void>;
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<void>;
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
  toggleAudio: () => void;
  toggleVideo: () => void;
  switchCamera: () => Promise<void>;
  cleanup: () => void;
}

export function useWebRTC({
  speedDateId,
  userId,
  onRemoteStream,
  onConnectionStateChange,
  onError,
}: UseWebRTCOptions): UseWebRTCReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [error, setError] = useState<Error | null>(null);
  const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('user');

  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const isConnected = connectionState === 'connected';

  // ICE configuration
  const iceConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      // Add TURN servers from environment
      // {
      //   urls: import.meta.env.VITE_TURN_SERVER,
      //   username: import.meta.env.VITE_TURN_USERNAME,
      //   credential: import.meta.env.VITE_TURN_CREDENTIAL,
      // },
    ],
  };

  // Initialize media devices
  const initializeMedia = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 720 },
          height: { ideal: 1280 },
          facingMode: currentFacingMode,
          frameRate: { ideal: 30, max: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      // Initialize peer connection if not exists
      if (!peerConnection.current) {
        const pc = new RTCPeerConnection(iceConfig);
        peerConnection.current = pc;

        // Add local tracks to peer connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Handle remote stream
        pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            setRemoteStream(event.streams[0]);
            onRemoteStream?.(event.streams[0]);
          }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
          const state = pc.connectionState;
          setConnectionState(state);
          onConnectionStateChange?.(state);

          if (state === 'failed' || state === 'disconnected') {
            // Attempt ICE restart
            console.log('Connection failed, attempting ICE restart');
          }
        };

        // Handle ICE candidates (will be handled by signaling)
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            // Send to signaling server
            // sendToSignalingServer({ type: 'ice-candidate', candidate: event.candidate });
            console.log('ICE candidate:', event.candidate);
          }
        };
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to access media devices');
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [currentFacingMode, onRemoteStream, onConnectionStateChange, onError]);

  // Create offer (caller)
  const createOffer = useCallback(async () => {
    if (!peerConnection.current) {
      throw new Error('Peer connection not initialized');
    }

    try {
      const offer = await peerConnection.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peerConnection.current.setLocalDescription(offer);

      // Send offer to signaling server
      // sendToSignalingServer({ type: 'offer', sdp: offer });
      console.log('Offer created:', offer);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create offer');
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [onError]);

  // Create answer (receiver)
  const createAnswer = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      if (!peerConnection.current) {
        throw new Error('Peer connection not initialized');
      }

      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        // Send answer to signaling server
        // sendToSignalingServer({ type: 'answer', sdp: answer });
        console.log('Answer created:', answer);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create answer');
        setError(error);
        onError?.(error);
        throw error;
      }
    },
    [onError]
  );

  // Add ICE candidate
  const addIceCandidate = useCallback(
    async (candidate: RTCIceCandidateInit) => {
      if (!peerConnection.current) {
        throw new Error('Peer connection not initialized');
      }

      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to add ICE candidate');
        console.error('Error adding ICE candidate:', error);
      }
    },
    []
  );

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }, [localStream]);

  // Switch camera (front/back)
  const switchCamera = useCallback(async () => {
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    setCurrentFacingMode(newFacingMode);

    // Stop current video track
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => track.stop());

      try {
        // Get new video stream with different facing mode
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 720 },
            height: { ideal: 1280 },
            facingMode: newFacingMode,
            frameRate: { ideal: 30, max: 30 },
          },
        });

        const newVideoTrack = videoStream.getVideoTracks()[0];

        // Replace track in peer connection
        if (peerConnection.current) {
          const sender = peerConnection.current
            .getSenders()
            .find((s) => s.track?.kind === 'video');
          if (sender) {
            await sender.replaceTrack(newVideoTrack);
          }
        }

        // Update local stream
        const audioTrack = localStream.getAudioTracks()[0];
        const newStream = new MediaStream([newVideoTrack, audioTrack]);
        setLocalStream(newStream);
      } catch (err) {
        console.error('Failed to switch camera:', err);
        // Revert facing mode if failed
        setCurrentFacingMode(currentFacingMode);
      }
    }
  }, [currentFacingMode, localStream]);

  // Cleanup
  const cleanup = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setRemoteStream(null);
    setConnectionState('closed');
  }, [localStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    localStream,
    remoteStream,
    connectionState,
    isConnected,
    error,
    initializeMedia,
    createOffer,
    createAnswer,
    addIceCandidate,
    toggleAudio,
    toggleVideo,
    switchCamera,
    cleanup,
  };
}
