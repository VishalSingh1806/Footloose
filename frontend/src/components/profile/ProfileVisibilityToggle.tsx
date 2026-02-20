import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ProfileVisibilityToggleProps {
  isActive: boolean;
  onToggle: (active: boolean) => Promise<void>;
}

export function ProfileVisibilityToggle({
  isActive,
  onToggle,
}: ProfileVisibilityToggleProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState('');
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    if (isActive) {
      // Pausing - show confirmation
      setShowConfirm(true);
    } else {
      // Activating - just do it
      await activateProfile();
    }
  };

  const pauseProfile = async () => {
    setToggling(true);
    try {
      await onToggle(false);
      setShowConfirm(false);
      setReason('');
    } catch (error) {
      console.error('Error pausing profile:', error);
    } finally {
      setToggling(false);
    }
  };

  const activateProfile = async () => {
    setToggling(true);
    try {
      await onToggle(true);
    } catch (error) {
      console.error('Error activating profile:', error);
    } finally {
      setToggling(false);
    }
  };

  return (
    <>
      {/* Toggle Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
              isActive ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {isActive ? (
                <Eye size={20} className="text-green-600 sm:w-6 sm:h-6" />
              ) : (
                <EyeOff size={20} className="text-gray-600 sm:w-6 sm:h-6" />
              )}
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-[#1D3557]">
                Profile {isActive ? 'Active' : 'Paused'}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                {isActive
                  ? 'Your profile is visible to others'
                  : 'Your profile is hidden from search'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`w-12 h-7 sm:w-14 sm:h-8 rounded-full transition-colors relative ${
              isActive ? 'bg-[#2A9D8F]' : 'bg-gray-300'
            } ${toggling ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full absolute top-1 transition-all ${
                isActive ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Pause Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D3557] mb-2">
                Pause Your Profile?
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Your profile won't appear in search results
              </p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* What happens */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="text-sm font-semibold text-[#1D3557] mb-2">
                  What happens when you pause:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Your profile won't appear in search</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Existing matches can still message you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>You can still browse and view matches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>You can reactivate anytime</span>
                  </li>
                </ul>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Why are you pausing? (Optional)
                </label>
                <div className="space-y-2">
                  {['Taking a break', 'Found someone', 'Too busy', 'Other'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setReason(opt)}
                      className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                        reason === opt
                          ? 'border-[#9B59B6] bg-[#FFF5F5]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 sm:p-6 border-t border-gray-200 space-y-3">
              <button
                onClick={pauseProfile}
                disabled={toggling}
                className="w-full bg-[#9B59B6] text-white py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold hover:bg-[#D62839] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {toggling ? 'Pausing...' : 'Pause Profile'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={toggling}
                className="w-full text-gray-600 py-2 sm:py-3 text-sm sm:text-base font-semibold hover:text-gray-800 transition-colors"
              >
                Keep Active
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
