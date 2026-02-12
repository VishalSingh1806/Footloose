import { Lock, Video, Heart, Star, X } from 'lucide-react';

interface UnlockChatModalProps {
  matchName: string;
  matchPhoto: string;
  creditBalance: number;
  interestSent: boolean;
  onRequestSpeedDate: () => void;
  onSendInterest: () => void;
  onDirectUnlock: () => void;
  onAddCredits: () => void;
  onClose: () => void;
}

function UnlockChatModal({
  matchName,
  matchPhoto,
  creditBalance,
  interestSent,
  onRequestSpeedDate,
  onSendInterest,
  onDirectUnlock,
  onAddCredits,
  onClose,
}: UnlockChatModalProps) {
  const canAffordSpeedDate = creditBalance >= 200;
  const canAffordDirectUnlock = creditBalance >= 400;

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

          <h2 className="text-2xl font-bold text-[#1D3557] mb-2">
            Unlock Chat
          </h2>
          <p className="text-gray-600">
            Start chatting with {matchName} by:
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Credit Balance */}
          <div className="bg-[#F4A261]/10 border border-[#F4A261]/30 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Your balance</p>
            <p className="text-2xl font-bold text-[#F4A261]">{creditBalance} credits</p>
          </div>

          {/* Option 1: Speed Date */}
          <div className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#2A9D8F] transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2A9D8F]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Video size={20} className="text-[#2A9D8F]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1D3557] mb-1">
                  Complete Speed Date (Recommended)
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Have a 10-minute speed date to unlock chat
                </p>
                <p className="text-[#2A9D8F] font-bold">200 credits</p>
              </div>
            </div>
            <button
              onClick={onRequestSpeedDate}
              disabled={!canAffordSpeedDate}
              className="w-full mt-3 bg-[#2A9D8F] hover:bg-[#238276] text-white py-2 px-4
                         rounded-lg font-semibold active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canAffordSpeedDate ? 'Request Speed Date' : 'Insufficient Credits'}
            </button>
          </div>

          {/* Option 2: Mutual Interest */}
          <div className="border-2 border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#E63946]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart size={20} className="text-[#E63946]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1D3557] mb-1">
                  Both Send Interest
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Send interest and wait for mutual match
                </p>
                <p className="text-green-600 font-bold">Free</p>
              </div>
            </div>
            {interestSent ? (
              <div className="w-full mt-3 bg-gray-100 text-gray-600 py-2 px-4 rounded-lg
                             font-semibold text-center">
                Waiting for {matchName}'s response
              </div>
            ) : (
              <button
                onClick={onSendInterest}
                className="w-full mt-3 bg-[#E63946] hover:bg-[#D62839] text-white py-2 px-4
                           rounded-lg font-semibold active:scale-95 transition-all"
              >
                Send Interest
              </button>
            )}
          </div>

          {/* Option 3: Direct Unlock (Premium) */}
          <div className="border-2 border-[#F4A261] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#F4A261]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Star size={20} className="text-[#F4A261]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1D3557] mb-1">
                  Direct Chat Unlock <span className="text-xs text-[#F4A261]">(Premium)</span>
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Unlock chat directly without speed date
                </p>
                <p className="text-[#F4A261] font-bold">400 credits (2x)</p>
              </div>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg mt-2">
              ⚠️ Speed dates build better connections
            </p>
            <button
              onClick={onDirectUnlock}
              disabled={!canAffordDirectUnlock}
              className="w-full mt-3 bg-[#F4A261] hover:bg-[#E89451] text-white py-2 px-4
                         rounded-lg font-semibold active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canAffordDirectUnlock ? 'Unlock Chat Now' : 'Insufficient Credits'}
            </button>
          </div>

          {/* Add Credits */}
          {creditBalance < 400 && (
            <button
              onClick={onAddCredits}
              className="w-full border-2 border-[#E63946] text-[#E63946] py-3 px-4 rounded-xl
                         font-semibold hover:bg-[#E63946]/5 active:scale-95 transition-all"
            >
              Add Credits
            </button>
          )}

          {/* Education Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-[#1D3557] mb-2">
              Why speed dates work better:
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✓ Verify authenticity</li>
              <li>✓ See real chemistry</li>
              <li>✓ Save time</li>
              <li>✓ Build trust</li>
            </ul>
          </div>
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
