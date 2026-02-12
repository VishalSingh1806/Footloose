import { useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface EmergencyExitProps {
  matchName: string;
  callDuration: number; // in seconds
  onConfirmEnd: (reason: string) => void;
  onContinue: () => void;
}

function EmergencyExit({ matchName, callDuration, onConfirmEnd, onContinue }: EmergencyExitProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minute${mins !== 1 ? 's' : ''}${secs > 0 ? ` ${secs} seconds` : ''}`;
  };

  const reasons = [
    { value: 'technical', label: 'Technical issues' },
    { value: 'inappropriate', label: 'Uncomfortable/inappropriate behavior' },
    { value: 'no_connection', label: 'Not feeling a connection' },
    { value: 'emergency', label: 'Personal emergency' },
    { value: 'other', label: 'Other' },
  ];

  const handleReasonChange = (value: string) => {
    setSelectedReason(value);
    if (value === 'inappropriate') {
      setShowReportForm(true);
    } else {
      setShowReportForm(false);
      setReportDetails('');
    }
  };

  const handleConfirmEnd = () => {
    const finalReason = selectedReason === 'other' ? otherReason : selectedReason;
    const details = showReportForm ? reportDetails : '';
    onConfirmEnd(finalReason + (details ? `: ${details}` : ''));
  };

  const canSubmit = selectedReason && (selectedReason !== 'other' || otherReason.trim());

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

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
            <p className="text-sm text-amber-900">
              Ending early may affect your trust score and future match quality.
            </p>
          </div>

          {/* Reason Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#1D3557] mb-3">Why are you leaving?</h3>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <label
                  key={reason.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${
                      selectedReason === reason.value
                        ? 'border-[#E63946] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => handleReasonChange(e.target.value)}
                    className="w-4 h-4 text-[#E63946] focus:ring-[#E63946]"
                  />
                  <span className="text-[#1D3557] font-medium">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Other Reason Text Input */}
          {selectedReason === 'other' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1D3557] mb-2">
                Please specify:
              </label>
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Tell us why you're leaving..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E63946]
                           focus:outline-none resize-none"
                rows={3}
                maxLength={200}
              />
            </div>
          )}

          {/* Report Form */}
          {showReportForm && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <h3 className="font-semibold text-red-900 mb-2">Report Details</h3>
              <p className="text-sm text-red-800 mb-3">
                Your safety is our priority. Please describe what happened:
              </p>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Describe the inappropriate behavior..."
                className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:border-red-500
                           focus:outline-none resize-none bg-white"
                rows={4}
                maxLength={500}
                required
              />
              <p className="text-xs text-red-700 mt-2">
                This report will be reviewed immediately and kept confidential.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleConfirmEnd}
              disabled={!canSubmit}
              className="w-full bg-red-600 text-white py-4 px-6 rounded-xl font-semibold
                         hover:bg-red-700 active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
            >
              {showReportForm ? 'End Call & Submit Report' : 'End Call Now'}
            </button>
            <button
              onClick={onContinue}
              className="w-full border-2 border-gray-300 text-[#1D3557] py-3 px-6 rounded-xl font-semibold
                         hover:bg-gray-50 active:scale-95 transition-all"
            >
              Continue Speed Date
            </button>
          </div>

          {/* Bottom Note */}
          <p className="text-xs text-center text-[#6C757D] mt-4">
            Both users will see the call ended early, but your reason is private.
            {callDuration < 120 && ' You may receive a 50% credit refund.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmergencyExit;
