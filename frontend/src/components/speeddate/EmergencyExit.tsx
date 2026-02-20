import { useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface EmergencyExitProps {
  matchName: string;
  callDuration: number; // in seconds
  onConfirmEnd: (reason: string, details: string) => void;
  onContinue: () => void;
}

const REASONS = [
  { value: 'technical', label: 'Technical issues (video/audio not working)' },
  { value: 'uncomfortable', label: 'Uncomfortable behavior' },
  { value: 'no_connection', label: 'Not feeling a connection' },
  { value: 'emergency', label: 'Personal emergency' },
  { value: 'other', label: 'Other' },
];

function getRefundNote(seconds: number): string {
  if (seconds < 120) {
    return 'You exited before 2 minutes — no refund will be issued.';
  } else if (seconds < 300) {
    return 'You exited between 2–5 minutes — refund eligibility will be determined automatically by the system.';
  }
  return 'You attended more than 5 minutes — this counts as attended. No refund applies.';
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} minute${mins !== 1 ? 's' : ''}${secs > 0 ? ` ${secs} seconds` : ''}`;
}

function EmergencyExit({ matchName, callDuration, onConfirmEnd, onContinue }: EmergencyExitProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [showReportPrompt, setShowReportPrompt] = useState(false);

  const handleReasonChange = (value: string) => {
    setSelectedReason(value);
    setShowReportPrompt(value === 'uncomfortable');
    setReportDetails('');
  };

  // Details required (min 10 chars) + must pick a reason
  const canSubmit =
    selectedReason.length > 0 &&
    details.trim().length >= 10 &&
    (selectedReason !== 'uncomfortable' || reportDetails.trim().length >= 10);

  const handleConfirmEnd = () => {
    if (!canSubmit) return;
    onConfirmEnd(selectedReason, details);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onContinue} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1D3557] mb-2">End Speed Date Early?</h2>
            <div className="flex items-center justify-center gap-2 text-[#6C757D]">
              <Clock size={16} />
              <span className="text-sm">You've been on call for {formatDuration(callDuration)}</span>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="mb-5">
            <h3 className="font-semibold text-[#1D3557] mb-3">Why are you leaving?</h3>
            <div className="space-y-2">
              {REASONS.map((reason) => (
                <label
                  key={reason.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedReason === reason.value
                      ? 'border-[#9B59B6] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => handleReasonChange(e.target.value)}
                    className="w-4 h-4 text-[#9B59B6] focus:ring-[#9B59B6]"
                  />
                  <span className="text-[#1D3557] font-medium text-sm">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Required Detail Text */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-[#1D3557] mb-2">
              Please describe briefly <span className="text-red-500">*</span>
              <span className="font-normal text-gray-500 ml-1">(required, min 10 characters)</span>
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Briefly describe why you're ending the call early..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#9B59B6]
                         focus:outline-none resize-none"
              rows={3}
              maxLength={500}
            />
            <p className={`text-xs mt-1 ${details.trim().length < 10 ? 'text-red-500' : 'text-gray-400'}`}>
              {details.trim().length}/500 characters
              {details.trim().length < 10 && details.length > 0 && ` — ${10 - details.trim().length} more needed`}
            </p>
          </div>

          {/* Safety Report (uncomfortable behavior) */}
          {showReportPrompt && (
            <div className="mb-5 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <h3 className="font-semibold text-red-900 mb-2">Safety Report</h3>
              <p className="text-sm text-red-800 mb-3">
                This will be flagged for immediate safety review. Please describe what happened:
              </p>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Describe the behavior in detail..."
                className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:border-red-500
                           focus:outline-none resize-none bg-white"
                rows={4}
                maxLength={500}
                required
              />
              <p className="text-xs text-red-700 mt-2">
                This report is kept confidential and reviewed immediately.
              </p>
            </div>
          )}

          {/* Refund Note */}
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-sm text-amber-900">{getRefundNote(callDuration)}</p>
            {callDuration < 120 && (
              <p className="text-xs text-amber-700 mt-1">
                Technical failures verified by our system receive automatic refunds.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleConfirmEnd}
              disabled={!canSubmit}
              className="w-full bg-red-600 text-white py-4 px-6 rounded-xl font-semibold
                         hover:bg-red-700 active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showReportPrompt ? 'End Call & Submit Report' : 'End Call Now'}
            </button>
            <button
              onClick={onContinue}
              className="w-full border-2 border-gray-300 text-[#1D3557] py-3 px-6 rounded-xl font-semibold
                         hover:bg-gray-50 active:scale-95 transition-all"
            >
              Continue Speed Date
            </button>
          </div>

          <p className="text-xs text-center text-[#6C757D] mt-4">
            Both participants see the call ended early. Your reason and details are kept private.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmergencyExit;
