import { useState } from 'react';
import { X, Video, Wallet, Check, AlertCircle, Calendar, Clock, Lock } from 'lucide-react';
import SchedulePicker, { TimeSlot } from './SchedulePicker';

interface RequestModalProps {
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  matchLocation: string;
  userCredits: number;
  requestCost: number;
  onClose: () => void;
  onSendRequest: (slots: TimeSlot[]) => void;
}

function RequestModal({
  matchName,
  matchAge,
  matchPhoto,
  matchLocation,
  userCredits,
  requestCost,
  onClose,
  onSendRequest,
}: RequestModalProps) {
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [sending, setSending] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);

  const hasEnoughCredits = userCredits >= requestCost;
  const canSend = hasEnoughCredits && selectedSlots.length > 0 && policyAgreed;

  const handleSend = async () => {
    if (!canSend) return;

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSendRequest(selectedSlots);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl
                    max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E63946]/10 rounded-full flex items-center justify-center">
              <Video size={24} className="text-[#E63946]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1D3557]">Request a Speed Date</h2>
              <p className="text-sm text-[#6C757D]">10-minute video call to see if there's chemistry</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info Card */}
          <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <img src={matchPhoto} alt={matchName} className="w-15 h-15 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-[#1D3557]">{matchName}, {matchAge}</h3>
                <p className="text-sm text-[#6C757D]">{matchLocation}</p>
              </div>
            </div>
          </div>

          {/* Credit Check */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wallet size={18} className="text-[#1D3557]" />
                <span className="text-[15px] text-[#1D3557]">Your balance: <strong>{userCredits} credits</strong></span>
              </div>
              {hasEnoughCredits ? (
                <Check size={20} className="text-green-600" />
              ) : (
                <AlertCircle size={20} className="text-red-600" />
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1D3557]">Speed Date Request:</span>
                <span className="text-lg font-bold text-[#E63946]">{requestCost} credits</span>
              </div>
              {!hasEnoughCredits && (
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Add Credits →
                </button>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="font-semibold text-blue-900 mb-2">Why Speed Dating Works:</p>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>✓ See real chemistry in 10 minutes</li>
              <li>✓ Verify authenticity face-to-face</li>
              <li>✓ Skip endless texting</li>
              <li>✓ Build genuine connection</li>
            </ul>
            <p className="text-xs text-blue-700 mt-2">⏱ Just 10 minutes of your time</p>
          </div>

          {/* Schedule Picker */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#1D3557] mb-1">Suggest Your Available Times</h3>
            <p className="text-sm text-[#6C757D] mb-4">{matchName} will pick one that works</p>
            <SchedulePicker onSlotsChange={setSelectedSlots} />
          </div>

          {/* Cancellation Policy */}
          <div className="mb-6 bg-blue-50 rounded-xl p-4" style={{ borderLeft: '4px solid #3B82F6' }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={20} className="text-blue-600 flex-shrink-0" />
              <h3 className="text-[15px] font-semibold text-[#1D3557]">Cancellation Policy</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1D3557]">Before booking: Free to change your mind</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1D3557]">Up to 24 hours before: Cancel for full refund</p>
                  <p className="text-xs text-blue-700">200 credits refunded immediately</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lock size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700">Within 24 hours: Event locked</p>
                  <p className="text-xs text-red-600">No cancellations or refunds after this point</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Video size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1D3557]">Event time: Join on time</p>
                  <p className="text-xs text-blue-700">No-shows are charged; the other person is refunded</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-blue-700 mt-3 italic">
              This policy ensures both people show up and prevents last-minute cancellations.
            </p>
          </div>

          {/* Policy Agreement Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-6 p-3 rounded-xl border-2
                            border-gray-200 hover:border-[#E63946] transition-colors">
            <input
              type="checkbox"
              checked={policyAgreed}
              onChange={(e) => setPolicyAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-[#E63946] rounded focus:ring-[#E63946]"
            />
            <span className="text-sm text-[#1D3557] font-medium">
              I understand the 24-hour lock policy and will attend if confirmed
            </span>
          </label>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleSend}
              disabled={!canSend || sending}
              className="w-full bg-[#E63946] text-white py-4 px-6 rounded-xl font-semibold text-base
                         hover:bg-[#D62839] active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? 'Sending...' : `Send Request (${requestCost} credits)`}
            </button>
            <button onClick={onClose} className="w-full text-[#6C757D] hover:text-[#1D3557] font-medium">
              Maybe Later
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-[#6C757D] mt-4">
            By requesting, you agree to our{' '}
            <button className="text-blue-600 hover:text-blue-700">Speed Dating Guidelines</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RequestModal;
