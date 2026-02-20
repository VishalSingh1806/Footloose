import { Check } from 'lucide-react';
import { TimeSlot } from './SchedulePicker';

interface RequestSentProps {
  matchName: string;
  creditsDeducted: number;
  newBalance: number;
  selectedSlots: TimeSlot[];
  onViewPending: () => void;
  onBackToMatches: () => void;
}

function RequestSent({
  matchName,
  creditsDeducted,
  newBalance,
  selectedSlots,
  onViewPending,
  onBackToMatches,
}: RequestSentProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Check size={48} className="text-white" strokeWidth={3} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-[#1D3557] mb-3">Request Sent!</h1>

        {/* Body Text */}
        <p className="text-[#6C757D] mb-2">
          Your speed date request has been sent to {matchName}.
        </p>
        <p className="text-sm text-[#6C757D] mb-6">
          She has 48 hours to accept and choose a time slot. You'll be notified once she responds.
        </p>

        {/* Timeline */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-[#1D3557]">Request sent</p>
              <p className="text-xs text-[#6C757D]">Just now</p>
            </div>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-white">2</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-500">Waiting for response</p>
              <p className="text-xs text-gray-400">48 hours</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-white">3</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-500">Speed date confirmed</p>
            </div>
          </div>
        </div>

        {/* Credits Info */}
        <div className="text-sm text-[#6C757D] mb-8">
          <p className="mb-1">{creditsDeducted} credits deducted</p>
          <p>New balance: <strong className="text-[#1D3557]">{newBalance} credits</strong></p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onViewPending}
            className="w-full bg-[#9B59B6] text-white py-3.5 px-6 rounded-xl font-semibold
                       hover:bg-[#D62839] active:scale-95 transition-all"
          >
            View Pending Requests
          </button>
          <button
            onClick={onBackToMatches}
            className="w-full text-[#6C757D] hover:text-[#1D3557] font-medium py-2"
          >
            Back to Matches
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestSent;
