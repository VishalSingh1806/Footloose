import { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface InstallPromptProps {
  onInstall: () => Promise<boolean>;
  onDismiss: () => void;
  variant?: 'banner' | 'modal';
}

/**
 * InstallPrompt Component
 *
 * Shows a prompt to install the PWA to home screen
 * Works on Android Chrome and iOS Safari
 */
function InstallPrompt({ onInstall, onDismiss, variant = 'banner' }: InstallPromptProps) {
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await onInstall();
    if (!success) {
      setIsInstalling(false);
    }
  };

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
          {/* Close Button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E63946] to-[#2A9D8F] rounded-2xl flex items-center justify-center">
              <Smartphone size={40} className="text-white" />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-[#1D3557] text-center mb-2">
            Install Footloose No More
          </h2>
          <p className="text-[#6C757D] text-center mb-6">
            Add to your home screen for quick access and a better experience. Works offline too!
          </p>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <p className="text-[#1D3557] font-medium">Fast & Native Feel</p>
                <p className="text-[#6C757D] text-sm">Launch instantly like a native app</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <p className="text-[#1D3557] font-medium">Works Offline</p>
                <p className="text-[#6C757D] text-sm">Access your matches anytime</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <p className="text-[#1D3557] font-medium">Push Notifications</p>
                <p className="text-[#6C757D] text-sm">Never miss a match or message</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full bg-[#E63946] hover:bg-[#D62839] text-white py-3 px-6 rounded-xl font-semibold
                         flex items-center justify-center gap-2 active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInstalling ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Installing...</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>Add to Home Screen</span>
                </>
              )}
            </button>
            <button
              onClick={onDismiss}
              className="w-full text-[#6C757D] hover:text-[#1D3557] py-2 font-medium"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Banner variant
  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 animate-slideUp">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-[#E63946] to-[#2A9D8F] rounded-xl flex items-center justify-center flex-shrink-0">
            <Download size={24} className="text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#1D3557] mb-1">
              Install App
            </h3>
            <p className="text-sm text-[#6C757D] mb-3">
              Add to home screen for quick access
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 bg-[#E63946] hover:bg-[#D62839] text-white py-2 px-4 rounded-lg font-semibold text-sm
                           active:scale-95 transition-all disabled:opacity-50"
              >
                {isInstalling ? 'Installing...' : 'Install'}
              </button>
              <button
                onClick={onDismiss}
                className="px-4 py-2 text-[#6C757D] hover:text-[#1D3557] font-medium text-sm"
              >
                Not Now
              </button>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;
