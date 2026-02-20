import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { pushNotificationService } from '../../services/pushNotificationService';

interface NotificationPromptProps {
  onClose: () => void;
  onEnable: () => void;
}

function NotificationPrompt({ onClose, onEnable }: NotificationPromptProps) {
  const [isEnabling, setIsEnabling] = useState(false);

  const handleEnable = async () => {
    setIsEnabling(true);

    try {
      const subscription = await pushNotificationService.subscribe();

      if (subscription) {
        console.log('Push notifications enabled');
        onEnable();
      } else {
        alert('Failed to enable notifications. Please check your browser settings.');
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      alert('Failed to enable notifications. Please try again.');
    } finally {
      setIsEnabling(false);
    }
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 animate-slideUp">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-12 h-12 bg-[#9B59B6]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bell size={24} className="text-[#9B59B6]" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#1D3557] mb-1">
              Enable Notifications
            </h3>
            <p className="text-sm text-[#6C757D] mb-3">
              Get instant alerts when you receive new messages
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleEnable}
                disabled={isEnabling}
                className="flex-1 bg-[#9B59B6] hover:bg-[#D62839] text-white py-2 px-4 rounded-lg
                           font-semibold text-sm active:scale-95 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEnabling ? 'Enabling...' : 'Enable'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-[#6C757D] hover:text-[#1D3557] font-medium text-sm"
              >
                Not Now
              </button>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
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

export default NotificationPrompt;
