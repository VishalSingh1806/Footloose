/**
 * WebRTC utility functions
 */

/**
 * Check if WebRTC is supported in the current browser
 */
export function isWebRTCSupported(): boolean {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    window.RTCPeerConnection
  );
}

/**
 * Check if camera/microphone permissions are granted
 */
export async function checkMediaPermissions(): Promise<{
  camera: PermissionState;
  microphone: PermissionState;
}> {
  try {
    const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
    const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

    return {
      camera: cameraPermission.state,
      microphone: micPermission.state,
    };
  } catch (error) {
    console.error('Failed to check permissions:', error);
    return {
      camera: 'prompt',
      microphone: 'prompt',
    };
  }
}

/**
 * Get available media devices
 */
export async function getMediaDevices(): Promise<{
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  speakers: MediaDeviceInfo[];
}> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();

    return {
      cameras: devices.filter((d) => d.kind === 'videoinput'),
      microphones: devices.filter((d) => d.kind === 'audioinput'),
      speakers: devices.filter((d) => d.kind === 'audiooutput'),
    };
  } catch (error) {
    console.error('Failed to enumerate devices:', error);
    return { cameras: [], microphones: [], speakers: [] };
  }
}

/**
 * Test camera and microphone access
 */
export async function testMediaAccess(): Promise<{
  success: boolean;
  error?: string;
  hasCamera: boolean;
  hasMicrophone: boolean;
}> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();

    // Stop tracks immediately after test
    stream.getTracks().forEach((track) => track.stop());

    return {
      success: true,
      hasCamera: videoTracks.length > 0,
      hasMicrophone: audioTracks.length > 0,
    };
  } catch (error) {
    let errorMessage = 'Unknown error';

    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permission denied';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera or microphone found';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Device already in use';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
      hasCamera: false,
      hasMicrophone: false,
    };
  }
}

/**
 * Monitor connection quality
 */
export async function getConnectionStats(
  peerConnection: RTCPeerConnection
): Promise<{
  packetsLost: number;
  jitter: number;
  bitrate: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}> {
  const stats = await peerConnection.getStats();
  let packetsLost = 0;
  let jitter = 0;
  let bitrate = 0;

  stats.forEach((report) => {
    if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
      packetsLost = report.packetsLost || 0;
      jitter = report.jitter || 0;
    }

    if (report.type === 'candidate-pair' && report.state === 'succeeded') {
      bitrate = (report.availableOutgoingBitrate || 0) / 1000; // Convert to kbps
    }
  });

  // Determine quality based on metrics
  let quality: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';

  if (packetsLost > 100 || jitter > 100 || bitrate < 500) {
    quality = 'poor';
  } else if (packetsLost > 50 || jitter > 50 || bitrate < 1000) {
    quality = 'fair';
  } else if (packetsLost > 10 || jitter > 20 || bitrate < 2000) {
    quality = 'good';
  }

  return { packetsLost, jitter, bitrate, quality };
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatCallDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check battery level (for low battery warning)
 */
export async function checkBatteryLevel(): Promise<{
  level: number;
  charging: boolean;
  lowBattery: boolean;
}> {
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        lowBattery: battery.level < 0.2 && !battery.charging,
      };
    }
  } catch (error) {
    console.error('Failed to check battery:', error);
  }

  return { level: 100, charging: false, lowBattery: false };
}

/**
 * Estimate network bandwidth
 */
export async function estimateNetworkSpeed(): Promise<{
  downlink: number; // Mbps
  effectiveType: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}> {
  const connection = (navigator as any).connection;

  if (connection) {
    const downlink = connection.downlink || 10; // Mbps
    const effectiveType = connection.effectiveType || '4g';

    let quality: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';

    if (downlink < 0.5 || effectiveType === 'slow-2g' || effectiveType === '2g') {
      quality = 'poor';
    } else if (downlink < 1.5 || effectiveType === '3g') {
      quality = 'fair';
    } else if (downlink < 5) {
      quality = 'good';
    }

    return { downlink, effectiveType, quality };
  }

  return { downlink: 10, effectiveType: '4g', quality: 'excellent' };
}
