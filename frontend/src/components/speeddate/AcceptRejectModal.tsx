import { useState } from 'react';
import { X, Video, Heart, AlertCircle, Calendar } from 'lucide-react';
import SchedulePicker, { TimeSlot } from './SchedulePicker';

interface AcceptRejectModalProps {
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  matchLocation: string;
  compatibility: number;
  suggestedSlots: string[];
  hoursLeft: number;
  onClose: () => void;
  onAccept: (selectedSlot: TimeSlot) => void;
  onDecline: () => void;
}

function AcceptRejectModal({
  matchName,
  matchAge,
  matchPhoto,
  matchLocation,
  compatibility,
  suggestedSlots,
  hoursLeft,
  onClose,
  onAccept,
  onDecline,
}: AcceptRejectModalProps) {
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

  const handleAccept = async () => {
    if (selectedSlots.length === 0) {
      alert('Please select at least one time slot');
      return;
    }

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onAccept(selectedSlots[0]); // Accept with first selected slot
  };

  const handleDecline = async () => {
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onDecline();
  };

  if (showDeclineConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeclineConfirm(false)} />

        {/* Decline Confirmation */}
        <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1D3557] mb-2">Decline Request?</h2>
            <p className="text-[#6C757D]">
              Are you sure you want to decline {matchName}'s speed date request? This can't be undone.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDecline}
              disabled={processing}
              className="w-full bg-red-600 text-white py-3.5 px-6 rounded-xl font-semibold
                         hover:bg-red-700 active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Declining...' : 'Yes, Decline'}
            </button>
            <button
              onClick={() => setShowDeclineConfirm(false)}
              className="w-full text-[#6C757D] hover:text-[#1D3557] font-medium py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <Heart size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1D3557]">Speed Date Request</h2>
              <p className="text-sm text-[#6C757D]">{matchName} wants to meet you!</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Urgency Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Calendar size={20} className="text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">
                {hoursLeft < 24 ? `${hoursLeft} hours left to respond` : `${Math.floor(hoursLeft / 24)} days left`}
              </p>
              <p className="text-xs text-amber-700">Request expires if not accepted</p>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <img src={matchPhoto} alt={matchName} className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-[#1D3557]">{matchName}, {matchAge}</h3>
                <p className="text-sm text-[#6C757D]">{matchLocation}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-semibold text-green-600">❤️ {compatibility}% Match</span>
                </div>
              </div>
            </div>
          </div>

          {/* Their Suggested Slots */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Video size={18} className="text-blue-600" />
              <p className="font-semibold text-blue-900">{matchName}'s Available Times:</p>
            </div>
            <div className="space-y-1">
              {suggestedSlots.map((slot, index) => (
                <div key={index} className="text-sm text-blue-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  {slot}
                </div>
              ))}
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="font-semibold text-green-900 mb-3">What happens next:</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Choose your preferred time</p>
                  <p className="text-xs text-green-700">Pick from {matchName}'s suggested slots or suggest your own</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">10-minute video call</p>
                  <p className="text-xs text-green-700">Have a quick face-to-face conversation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Share feedback</p>
                  <p className="text-xs text-green-700">Let us know if you'd like to connect further</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Picker */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#1D3557] mb-1">Choose Your Time</h3>
            <p className="text-sm text-[#6C757D] mb-4">Select a time that works for you</p>
            <SchedulePicker onSlotsChange={setSelectedSlots} maxSlots={1} />
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              disabled={selectedSlots.length === 0 || processing}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-base
                         hover:bg-green-700 active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? 'Confirming...' : 'Accept & Confirm Time'}
            </button>
            <button
              onClick={() => setShowDeclineConfirm(true)}
              className="w-full text-red-600 hover:text-red-700 font-medium py-2"
            >
              Decline Request
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-center text-[#6C757D] mt-4">
            By accepting, both parties will be notified and the call will be scheduled
          </p>
        </div>
      </div>
    </div>
  );
}

export default AcceptRejectModal;
