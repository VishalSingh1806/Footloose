import { useState } from 'react';
import { X, AlertTriangle, Ban, Check } from 'lucide-react';

interface ReportBlockModalProps {
  matchName: string;
  onClose: () => void;
  onReport: (reason: string, details?: string) => void;
  onBlock: () => void;
}

function ReportBlockModal({ matchName, onClose, onReport, onBlock }: ReportBlockModalProps) {
  const [action, setAction] = useState<'main' | 'report' | 'block'>('main');
  const [selectedReason, setSelectedReason] = useState('');
  const [otherDetails, setOtherDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reportReasons = [
    'Fake Profile',
    'Inappropriate Content',
    'Scam/Fraud',
    'Harassment',
    'Misleading Information',
    'Other',
  ];

  const handleReportSubmit = async () => {
    if (!selectedReason) return;

    await onReport(selectedReason, selectedReason === 'Other' ? otherDetails : undefined);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleBlockSubmit = async () => {
    await onBlock();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl
                    max-h-[80vh] overflow-y-auto shadow-2xl animate-slideUp"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-[#1D3557]">
            {action === 'report' ? 'Report Profile' : action === 'block' ? 'Block User' : 'More Options'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center
                       transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">
                {action === 'report' ? 'Report Submitted' : 'User Blocked'}
              </h3>
              <p className="text-sm text-[#6C757D]">
                {action === 'report'
                  ? 'Thank you for helping keep our community safe.'
                  : "You won't see this profile anymore."}
              </p>
            </div>
          ) : action === 'main' ? (
            <div className="space-y-3">
              <button
                onClick={() => setAction('report')}
                className="w-full p-4 rounded-lg border-2 border-gray-200
                           flex items-center gap-4 hover:border-[#E63946] hover:bg-red-50 transition-all"
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#1D3557]">Report Profile</h3>
                  <p className="text-sm text-[#6C757D]">Report inappropriate or fake content</p>
                </div>
              </button>

              <button
                onClick={() => setAction('block')}
                className="w-full p-4 rounded-lg border-2 border-gray-200
                           flex items-center gap-4 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Ban size={24} className="text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#1D3557]">Block User</h3>
                  <p className="text-sm text-[#6C757D]">You won't see their profile anymore</p>
                </div>
              </button>
            </div>
          ) : action === 'report' ? (
            <div>
              <p className="text-sm text-[#6C757D] mb-4">
                Please select a reason for reporting {matchName}'s profile:
              </p>

              <div className="space-y-2 mb-6">
                {reportReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all
                      ${
                        selectedReason === reason
                          ? 'border-[#E63946] bg-red-50 text-[#E63946]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {selectedReason === 'Other' && (
                <textarea
                  value={otherDetails}
                  onChange={(e) => setOtherDetails(e.target.value)}
                  placeholder="Please provide details..."
                  className="w-full p-3 border-2 border-gray-200 rounded-lg resize-none
                           focus:outline-none focus:border-[#E63946] mb-4"
                  rows={4}
                />
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setAction('main')}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold
                           border-2 border-gray-300 text-gray-700
                           hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleReportSubmit}
                  disabled={!selectedReason || (selectedReason === 'Other' && !otherDetails)}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold
                           bg-[#E63946] text-white
                           hover:bg-[#D62839] active:scale-95 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Report
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[#6C757D] mb-6">
                Are you sure you want to block {matchName}? You won't be able to see their profile anymore, and they won't be able to contact you.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setAction('main')}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold
                           border-2 border-gray-300 text-gray-700
                           hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockSubmit}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold
                           bg-gray-600 text-white
                           hover:bg-gray-700 active:scale-95 transition-all"
                >
                  Block User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportBlockModal;
