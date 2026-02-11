import { Camera, Mic, Wifi, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

interface TechnicalIssueProps {
  issueType: string;
  onRetry: () => void;
  onEndCall: () => void;
}

function TechnicalIssue({ issueType, onRetry, onEndCall }: TechnicalIssueProps) {
  const getIssueConfig = () => {
    switch (issueType) {
      case 'camera_denied':
        return {
          icon: <Camera size={48} className="text-red-600" />,
          title: 'Camera Access Required',
          message: 'Camera access is required for speed dates. Please enable it in your browser settings.',
          action: 'Enable Camera',
          showRetry: true,
        };

      case 'mic_denied':
        return {
          icon: <Mic size={48} className="text-red-600" />,
          title: 'Microphone Access Required',
          message: 'Microphone access is required for speed dates. Please enable it in your browser settings.',
          action: 'Enable Microphone',
          showRetry: true,
        };

      case 'connection_lost':
        return {
          icon: <Wifi size={48} className="text-red-600" />,
          title: 'Connection Lost',
          message: 'We lost connection to the call. Trying to reconnect...',
          action: 'Retry Connection',
          showRetry: true,
        };

      case 'webrtc_unsupported':
        return {
          icon: <XCircle size={48} className="text-red-600" />,
          title: 'Browser Not Supported',
          message: "Your browser doesn't support video calls. Please use Chrome, Safari, or Firefox.",
          action: 'Learn More',
          showRetry: false,
        };

      case 'remote_video_failed':
        return {
          icon: <AlertTriangle size={48} className="text-amber-600" />,
          title: "Match's Camera Unavailable",
          message: "Your match's camera isn't working. You can continue with audio only or end the call.",
          action: 'Continue Audio Only',
          showRetry: false,
        };

      case 'no_local_stream':
        return {
          icon: <AlertTriangle size={48} className="text-red-600" />,
          title: 'Unable to Access Camera/Mic',
          message: 'We couldn\'t access your camera or microphone. Please check your device settings.',
          action: 'Retry',
          showRetry: true,
        };

      default:
        return {
          icon: <AlertTriangle size={48} className="text-red-600" />,
          title: 'Technical Issue',
          message: 'Something went wrong. Please try again or contact support.',
          action: 'Retry',
          showRetry: true,
        };
    }
  };

  const config = getIssueConfig();

  const handleAction = () => {
    if (issueType === 'webrtc_unsupported') {
      window.open('https://support.footloosenmore.com/video-requirements', '_blank');
    } else if (issueType === 'remote_video_failed') {
      onRetry(); // Continue with audio only
    } else {
      onRetry();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {config.icon}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#1D3557] mb-3">{config.title}</h2>

        {/* Message */}
        <p className="text-[#6C757D] mb-6">{config.message}</p>

        {/* Browser Permissions Help */}
        {(issueType === 'camera_denied' || issueType === 'mic_denied') && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-blue-900 mb-2">How to enable:</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click the lock icon in your browser's address bar</li>
              <li>Find {issueType === 'camera_denied' ? 'Camera' : 'Microphone'} permissions</li>
              <li>Select "Allow"</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        )}

        {/* Connection Lost - Auto Retry Info */}
        {issueType === 'connection_lost' && (
          <div className="mb-6">
            <div className="inline-block">
              <RefreshCw size={24} className="text-[#E63946] animate-spin" />
            </div>
            <p className="text-sm text-[#6C757D] mt-2">Attempting to reconnect automatically...</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {config.showRetry && (
            <button
              onClick={handleAction}
              className="w-full bg-[#E63946] text-white py-3.5 px-6 rounded-xl font-semibold
                         hover:bg-[#D62839] active:scale-95 transition-all"
            >
              {config.action}
            </button>
          )}

          {!config.showRetry && issueType !== 'remote_video_failed' && (
            <button
              onClick={handleAction}
              className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-xl font-semibold
                         hover:bg-blue-700 active:scale-95 transition-all"
            >
              {config.action}
            </button>
          )}

          {issueType === 'remote_video_failed' && (
            <button
              onClick={onRetry}
              className="w-full bg-[#06D6A0] text-white py-3.5 px-6 rounded-xl font-semibold
                         hover:bg-[#05C794] active:scale-95 transition-all"
            >
              Continue Audio Only
            </button>
          )}

          <button
            onClick={onEndCall}
            className="w-full text-red-600 hover:text-red-700 font-medium py-2"
          >
            End Call
          </button>

          {/* Contact Support */}
          <button
            onClick={() => window.open('mailto:support@footloosenmore.com', '_blank')}
            className="w-full text-[#6C757D] hover:text-[#1D3557] text-sm py-2"
          >
            Contact Support
          </button>
        </div>

        {/* Additional Info */}
        {issueType === 'connection_lost' && (
          <p className="text-xs text-[#6C757D] mt-4">
            Call timer is paused during reconnection. Max wait time: 30 seconds.
          </p>
        )}
      </div>
    </div>
  );
}

export default TechnicalIssue;
