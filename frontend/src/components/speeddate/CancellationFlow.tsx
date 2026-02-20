import { useState } from 'react';
import { X, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

type CancellationStep = 'time_check' | 'reason' | 'confirm' | 'success';

const REASONS = [
  { value: 'schedule_conflict', label: 'Schedule conflict' },
  { value: 'not_interested', label: 'Not interested anymore' },
  { value: 'found_someone', label: 'Found someone else' },
  { value: 'technical_concerns', label: 'Technical concerns' },
  { value: 'personal_reasons', label: 'Personal reasons' },
  { value: 'other', label: 'Other' },
];

interface CancellationFlowProps {
  matchName: string;
  eventTime: string;       // ISO — event start time
  creditBalance: number;
  onConfirmCancel: (reason: string, details: string) => void;
  onClose: () => void;
}

function formatMsToHuman(ms: number): string {
  if (ms <= 0) return '0 minutes';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  return parts.join(', ');
}

function CancellationFlow({
  matchName,
  eventTime,
  creditBalance,
  onConfirmCancel,
  onClose,
}: CancellationFlowProps) {
  const [step, setStep] = useState<CancellationStep>('time_check');
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const eventMs = new Date(eventTime).getTime();
  const lockMs = eventMs - 24 * 60 * 60 * 1000;
  const msToLock = lockMs - Date.now();
  const msToEvent = eventMs - Date.now();
  const hoursToEvent = msToEvent / (1000 * 60 * 60);
  const isCloseToCuttoff = msToLock > 0 && msToLock < 2 * 60 * 60 * 1000; // < 2h to lock

  const handleConfirm = async () => {
    setCancelling(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate API call
    onConfirmCancel(selectedReason, details);
    setStep('success');
    setCancelling(false);
  };

  // ── Step: Success ────────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1D3557] mb-2">Speed Date Canceled</h2>
            <p className="text-green-700 font-semibold text-lg mb-1">200 credits refunded</p>
            <p className="text-gray-600 text-sm mb-4">
              {matchName} has been notified of the cancellation.
            </p>
            <div className="bg-[#8E44AD]/10 border border-[#8E44AD]/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">New balance</p>
              <p className="text-2xl font-bold text-[#8E44AD]">{creditBalance + 200} credits</p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-[#9B59B6] text-white py-3 px-6 rounded-xl font-semibold
                         hover:bg-[#D62839] active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Confirm ────────────────────────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full overflow-hidden">
          <div className="relative p-6 border-b border-gray-200">
            <button onClick={() => setStep('reason')} className="absolute top-4 left-4 text-gray-500 hover:text-gray-700">
              ← Back
            </button>
            <h2 className="text-xl font-bold text-[#1D3557] text-center">Confirm Cancellation</h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Refund Breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-[#1D3557] mb-3">Refund Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original charge</span>
                  <span className="font-medium text-[#1D3557]">200 credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancellation fee</span>
                  <span className="font-medium text-green-600">0 credits</span>
                </div>
                <div className="h-px bg-gray-200 my-1" />
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1D3557]">Refund amount</span>
                  <span className="font-bold text-green-600">200 credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Processing</span>
                  <span className="text-xs text-green-600">Immediate</span>
                </div>
              </div>
            </div>

            {isCloseToCuttoff && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-sm text-amber-800 font-medium">
                  ⚠ Event locks in {formatMsToHuman(msToLock)}. Cancel now to get your refund.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                disabled={cancelling}
                className="w-full bg-[#9B59B6] text-white py-4 px-6 rounded-xl font-semibold
                           hover:bg-[#D62839] active:scale-95 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Speed Date'}
              </button>
              <button
                onClick={onClose}
                className="w-full border-2 border-gray-300 text-[#1D3557] py-3 px-6 rounded-xl font-semibold
                           hover:bg-gray-50 active:scale-95 transition-all"
              >
                Keep Speed Date
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Reason ─────────────────────────────────────────────────────────────
  if (step === 'reason') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="relative p-6 border-b border-gray-200">
            <button onClick={() => setStep('time_check')} className="absolute top-4 left-4 text-gray-500 hover:text-gray-700">
              ← Back
            </button>
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <X size={20} className="text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-[#1D3557] text-center">Why are you canceling?</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              {REASONS.map((reason) => (
                <label
                  key={reason.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                    ${selectedReason === reason.value
                      ? 'border-[#9B59B6] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="cancel_reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-[#9B59B6] focus:ring-[#9B59B6]"
                  />
                  <span className="text-[#1D3557] font-medium text-sm">{reason.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1D3557] mb-2">
                Additional details <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Any additional context..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#9B59B6]
                           focus:outline-none resize-none"
                rows={3}
                maxLength={500}
              />
            </div>

            <button
              onClick={() => setStep('confirm')}
              disabled={!selectedReason}
              className="w-full bg-[#9B59B6] text-white py-4 px-6 rounded-xl font-semibold
                         hover:bg-[#D62839] active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Time Check (default) ───────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full overflow-hidden">
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={20} className="text-gray-600" />
          </button>
          <h2 className="text-xl font-bold text-[#1D3557] text-center">Cancel Speed Date</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Time Check */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Clock size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1D3557]">
                Your speed date is in {formatMsToHuman(msToEvent)}
              </p>
              <p className="text-sm text-green-700 font-medium mt-1">
                You can cancel for a full refund of 200 credits.
              </p>
            </div>
          </div>

          {/* Urgency Warning */}
          {isCloseToCuttoff && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">
                  Event locks in {formatMsToHuman(msToLock)}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Cancel now if you cannot attend, to get your full refund before the window closes.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => setStep('reason')}
              className="w-full bg-[#9B59B6] text-white py-4 px-6 rounded-xl font-semibold
                         hover:bg-[#D62839] active:scale-95 transition-all"
            >
              Cancel Speed Date
            </button>
            <button
              onClick={onClose}
              className="w-full border-2 border-gray-300 text-[#1D3557] py-3 px-6 rounded-xl font-semibold
                         hover:bg-gray-50 active:scale-95 transition-all"
            >
              Keep Speed Date
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancellationFlow;
