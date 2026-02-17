import { useState } from 'react';
import { Lock, Video, Crown, CheckCircle, X, Clock, AlertTriangle } from 'lucide-react';
import { ChatUnlockState } from '../../types/chat';

interface UnlockChatModalProps {
  matchName: string;
  matchPhoto: string;
  creditBalance: number;
  unlockState: ChatUnlockState;
  isPremium: boolean;
  speedDateDate?: string; // ISO string, shown if SPEED_DATE_SCHEDULED
  onRequestSpeedDate: () => void;
  onUnlockAfterSpeedDate: () => void; // 150 credits — post mutual-yes
  onPremiumBypass: () => void;        // 400 credits — premium only
  onAddCredits: () => void;
  onClose: () => void;
}

function UnlockChatModal({
  matchName,
  matchPhoto,
  creditBalance,
  unlockState,
  isPremium,
  speedDateDate,
  onRequestSpeedDate,
  onUnlockAfterSpeedDate,
  onPremiumBypass,
  onAddCredits,
  onClose,
}: UnlockChatModalProps) {
  const [confirmingBypass, setConfirmingBypass] = useState(false);

  const canAffordSpeedDate = creditBalance >= 200;
  const canAffordUnlock = creditBalance >= 150;
  const canAffordBypass = creditBalance >= 400;

  // ── Post speed-date unlock (mutual yes achieved) ────────────────────────────
  if (unlockState === 'UNLOCK_AVAILABLE') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full overflow-hidden">
          <div className="relative p-6 text-center border-b border-gray-200">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              aria-label="Close"
            >
              <X size={24} className="text-gray-600" />
            </button>

            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src={matchPhoto}
                  alt={matchName}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#06D6A0] rounded-full
                               flex items-center justify-center border-2 border-white">
                  <CheckCircle size={16} className="text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#1D3557] mb-2">Great Speed Date!</h2>
            <p className="text-gray-600">
              You and {matchName} both said yes.
              <br />
              Unlock chat to continue the conversation.
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-[#F4A261]/10 border border-[#F4A261]/30 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Your balance</p>
              <p className="text-2xl font-bold text-[#F4A261]">{creditBalance} credits</p>
            </div>

            {canAffordUnlock ? (
              <button
                onClick={onUnlockAfterSpeedDate}
                className="w-full bg-[#06D6A0] hover:bg-[#05b88a] text-white py-4 px-6
                           rounded-xl font-semibold text-lg active:scale-95 transition-all"
              >
                Unlock Chat — 150 credits
              </button>
            ) : (
              <>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-sm text-red-700">
                    You need 150 credits to unlock chat (you have {creditBalance}).
                  </p>
                </div>
                <button
                  onClick={onAddCredits}
                  className="w-full border-2 border-[#E63946] text-[#E63946] py-3 px-4 rounded-xl
                             font-semibold hover:bg-[#E63946]/5 active:scale-95 transition-all"
                >
                  Add Credits
                </button>
              </>
            )}
          </div>

          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 py-2 font-medium"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Speed date scheduled — waiting state ────────────────────────────────────
  if (unlockState === 'SPEED_DATE_SCHEDULED' || unlockState === 'SPEED_DATE_REQUESTED') {
    const isScheduled = unlockState === 'SPEED_DATE_SCHEDULED';
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full overflow-hidden">
          <div className="relative p-6 text-center border-b border-gray-200">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              aria-label="Close"
            >
              <X size={24} className="text-gray-600" />
            </button>

            <div className="flex justify-center mb-4">
              <div className="relative">
                <img src={matchPhoto} alt={matchName} className="w-20 h-20 rounded-full object-cover" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#2A9D8F] rounded-full
                               flex items-center justify-center border-2 border-white">
                  <Clock size={16} className="text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#1D3557] mb-2">
              {isScheduled ? 'Speed Date Scheduled' : 'Request Sent'}
            </h2>
            <p className="text-gray-600">
              {isScheduled
                ? `Your speed date with ${matchName} is confirmed.${speedDateDate ? ` See you then!` : ''}`
                : `Waiting for ${matchName} to accept your speed date request.`}
            </p>
            {isScheduled && speedDateDate && (
              <p className="mt-2 text-[#2A9D8F] font-semibold">
                {new Date(speedDateDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-500 text-center">
              Chat will be available to unlock after a successful speed date.
            </p>
          </div>

          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 py-2 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Premium bypass confirmation ─────────────────────────────────────────────
  if (confirmingBypass) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full overflow-hidden">
          <div className="p-6 text-center border-b border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={32} className="text-amber-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-[#1D3557] mb-2">Skip speed date?</h2>
            <p className="text-gray-600 text-sm">
              You'll miss the chance to see real chemistry first.
              Speed dates help verify authenticity and build genuine connection.
            </p>
            <p className="mt-3 text-amber-700 font-semibold">Cost: 400 credits</p>
          </div>

          <div className="p-6 space-y-3">
            <button
              onClick={() => setConfirmingBypass(false)}
              className="w-full bg-[#2A9D8F] hover:bg-[#238276] text-white py-3 px-4
                         rounded-xl font-semibold active:scale-95 transition-all"
            >
              Request Speed Date Instead
            </button>

            <button
              onClick={onPremiumBypass}
              disabled={!canAffordBypass}
              className="w-full border-2 border-amber-400 text-amber-700 py-3 px-4
                         rounded-xl font-semibold hover:bg-amber-50 active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canAffordBypass ? 'Yes, Unlock Chat (400 credits)' : 'Insufficient Credits'}
            </button>

            {!canAffordBypass && (
              <button
                onClick={onAddCredits}
                className="w-full border-2 border-[#E63946] text-[#E63946] py-3 px-4 rounded-xl
                           font-semibold hover:bg-[#E63946]/5 active:scale-95 transition-all"
              >
                Add Credits
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Default: NOT_MET (standard locked state) ────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative p-6 text-center border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-gray-100
                       flex items-center justify-center"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600" />
          </button>

          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={matchPhoto}
                alt={matchName}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#E63946] rounded-full
                             flex items-center justify-center border-2 border-white">
                <Lock size={16} className="text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#1D3557] mb-2">Chat Not Available Yet</h2>
          <p className="text-gray-600">
            You can unlock chat after a successful speed date.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
          {/* Credit Balance */}
          <div className="bg-[#F4A261]/10 border border-[#F4A261]/30 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Your balance</p>
            <p className="text-2xl font-bold text-[#F4A261]">{creditBalance} credits</p>
          </div>

          {/* How it works */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-[#1D3557] mb-3">Here's how it works:</h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-[#2A9D8F] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span>Request a speed date <span className="font-semibold text-[#2A9D8F]">(200 credits)</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-[#2A9D8F] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span>Meet face-to-face for 10 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-[#2A9D8F] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span>If you both say yes, unlock chat <span className="font-semibold text-[#2A9D8F]">(150 credits)</span></span>
              </li>
            </ol>
            <p className="mt-3 text-xs text-gray-500 italic">
              Speed dates prevent endless texting and help you see real chemistry first.
            </p>
          </div>

          {/* Speed Date CTA */}
          <button
            onClick={onRequestSpeedDate}
            disabled={!canAffordSpeedDate}
            className="w-full bg-[#E63946] hover:bg-[#D62839] text-white py-4 px-6
                       rounded-xl font-semibold text-base active:scale-95 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              <Video size={20} />
              {canAffordSpeedDate
                ? 'Request Speed Date — 200 credits'
                : `Need ${200 - creditBalance} more credits`}
            </span>
          </button>

          {!canAffordSpeedDate && (
            <button
              onClick={onAddCredits}
              className="w-full border-2 border-[#E63946] text-[#E63946] py-3 px-4 rounded-xl
                         font-semibold hover:bg-[#E63946]/5 active:scale-95 transition-all"
            >
              Add Credits
            </button>
          )}

          {/* Premium Bypass (only for premium users) */}
          {isPremium && (
            <div className="border-2 border-amber-400 rounded-xl p-4 bg-amber-50">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={18} className="text-amber-600" />
                <h4 className="font-semibold text-amber-800">Premium: Skip to Chat</h4>
              </div>
              <p className="text-sm text-amber-700 mb-1">
                Unlock directly without a speed date.
              </p>
              <p className="text-xs text-amber-600 mb-3">
                400 credits (2× cost) · Speed dates work better, but this is your choice.
              </p>
              <button
                onClick={() => setConfirmingBypass(true)}
                className="w-full bg-amber-400 hover:bg-amber-500 text-white py-2 px-4
                           rounded-lg font-semibold active:scale-95 transition-all"
              >
                Unlock Chat — 400 credits
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 py-2 font-medium"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default UnlockChatModal;
