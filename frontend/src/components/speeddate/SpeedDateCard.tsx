import { Calendar, Clock, MapPin, Lock, Unlock } from 'lucide-react';

export type SpeedDateStatus =
  | 'pending_sent'
  | 'pending_received'
  | 'confirmed'
  | 'completed'
  | 'declined'
  | 'cancelled'
  | 'noshow';

export type SpeedDateEventState =
  | 'SCHEDULED'
  | 'LOCKED'
  | 'LIVE'
  | 'COMPLETED'
  | 'COMPLETED_NOSHOW_A'
  | 'COMPLETED_NOSHOW_B'
  | 'CANCELLED_MUTUAL_NOSHOW'
  | 'CANCELLED_SYSTEM_FAILURE'
  | 'CANCELLED_USER';

export interface SpeedDate {
  id: string;
  matchId: string;
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  matchLocation: string;
  status: SpeedDateStatus;
  eventState?: SpeedDateEventState;
  eventTime?: string;  // ISO timestamp — actual event start time
  lockTime?: string;   // ISO timestamp — T-24h before event (set server-side)
  requestedAt?: string;
  confirmedDate?: string;
  confirmedTime?: string;
  suggestedSlots?: string[];
  hoursLeft?: number;
  startsIn?: string;
  feedbackGiven?: boolean;
  mutualInterest?: boolean;
  noShowCount?: number;   // Caller's running no-show total
}

interface SpeedDateCardProps {
  speedDate: SpeedDate;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
  onJoin?: () => void;
  onViewProfile?: () => void;
  onGiveFeedback?: () => void;
  onSendMessage?: () => void;
}

function isEventLocked(lockTime?: string): boolean {
  if (!lockTime) return false;
  return new Date() >= new Date(lockTime);
}

function SpeedDateCard({
  speedDate,
  onAccept,
  onDecline,
  onCancel,
  onJoin,
  onViewProfile,
  onGiveFeedback,
  onSendMessage,
}: SpeedDateCardProps) {
  const locked = isEventLocked(speedDate.lockTime);

  const getStatusConfig = () => {
    switch (speedDate.status) {
      case 'pending_sent':
        return { color: '#F77F00', bgColor: '#FFF4E6', label: 'Pending', textColor: '#F77F00' };
      case 'pending_received':
        return { color: '#2563EB', bgColor: '#EFF6FF', label: 'Action Needed', textColor: '#2563EB' };
      case 'confirmed':
        return locked
          ? { color: '#DC2626', bgColor: '#FEE2E2', label: 'Locked', textColor: '#DC2626' }
          : { color: '#06D6A0', bgColor: '#D1FAE5', label: 'Confirmed', textColor: '#06D6A0' };
      case 'completed':
        return { color: '#6C757D', bgColor: '#F3F4F6', label: 'Completed', textColor: '#6C757D' };
      case 'declined':
        return { color: '#DC2626', bgColor: '#FEE2E2', label: 'Declined', textColor: '#DC2626' };
      case 'cancelled':
        return { color: '#6C757D', bgColor: '#F3F4F6', label: 'Cancelled', textColor: '#6C757D' };
      case 'noshow':
        return { color: '#DC2626', bgColor: '#FEE2E2', label: 'No-Show', textColor: '#DC2626' };
      default:
        return { color: '#6C757D', bgColor: '#F3F4F6', label: 'Unknown', textColor: '#6C757D' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
      style={{ borderLeft: `4px solid ${statusConfig.color}` }}
    >
      {/* Top Row - Profile + Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={speedDate.matchPhoto}
            alt={speedDate.matchName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-[#1D3557]">
              {speedDate.matchName}, {speedDate.matchAge}
            </h3>
            <div className="flex items-center gap-1 text-xs text-[#6C757D]">
              <MapPin size={12} />
              <span>{speedDate.matchLocation}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.textColor }}
        >
          {speedDate.status === 'confirmed' && (
            locked
              ? <Lock size={11} />
              : <Unlock size={11} />
          )}
          {statusConfig.label}
        </div>
      </div>

      {/* Date/Time (if confirmed) */}
      {speedDate.status === 'confirmed' && speedDate.confirmedDate && (
        <div className={`border rounded-lg p-3 mb-3 ${
          locked
            ? 'bg-red-50 border-red-200'
            : 'bg-green-50 border-green-200'
        }`}>
          <div className={`flex items-center gap-2 text-sm font-semibold ${
            locked ? 'text-red-700' : 'text-green-700'
          }`}>
            <Calendar size={16} />
            <span>{speedDate.confirmedDate}</span>
            <Clock size={16} className="ml-2" />
            <span>{speedDate.confirmedTime}</span>
          </div>
          {speedDate.startsIn && (
            <p className={`text-xs mt-1 ${locked ? 'text-red-600' : 'text-green-600'}`}>
              {locked ? 'Locked — ' : ''}Starts in {speedDate.startsIn}
            </p>
          )}
          {locked && (
            <p className="text-xs text-red-600 font-medium mt-1">
              No cancellations — join on time to avoid no-show charge
            </p>
          )}
        </div>
      )}

      {/* Status-specific Info */}
      {speedDate.status === 'pending_sent' && (
        <div className="text-sm text-[#6C757D] mb-3">
          <p>Waiting for response · {speedDate.hoursLeft}h left</p>
        </div>
      )}

      {speedDate.status === 'pending_received' && speedDate.suggestedSlots && (
        <div className="mb-3">
          <p className="text-xs text-[#6C757D] mb-1">Their available slots:</p>
          <p className="text-sm text-[#1D3557] font-medium">
            {speedDate.suggestedSlots.join(', ')}
          </p>
        </div>
      )}

      {speedDate.status === 'completed' && (
        <div className="flex items-center gap-2 mb-3">
          {speedDate.feedbackGiven ? (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
              <span>Feedback given</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm text-orange-600">
              <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-xs">!</span>
              <span>Feedback pending</span>
            </div>
          )}
          {speedDate.mutualInterest && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <span>❤️</span>
              <span>Mutual Interest</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {speedDate.status === 'pending_received' && (
          <>
            <button
              onClick={onAccept}
              className="flex-1 bg-[#06D6A0] text-white py-2.5 px-4 rounded-lg font-semibold
                         hover:bg-[#05C794] active:scale-95 transition-all"
            >
              Accept & Choose Time
            </button>
            <button
              onClick={onDecline}
              className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold
                         hover:bg-gray-50 active:scale-95 transition-all"
            >
              Decline
            </button>
          </>
        )}

        {speedDate.status === 'pending_sent' && (
          <button
            onClick={onCancel}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Cancel Request
          </button>
        )}

        {speedDate.status === 'confirmed' && (
          <>
            {speedDate.startsIn && speedDate.startsIn.includes('minute') ? (
              <button
                onClick={onJoin}
                className="flex-1 bg-[#E63946] text-white py-2.5 px-4 rounded-lg font-semibold
                           hover:bg-[#D62839] active:scale-95 transition-all animate-pulse"
              >
                Join Call Now
              </button>
            ) : locked ? (
              <div className="flex-1 flex items-center gap-2 text-sm text-red-600 font-medium py-2">
                <Lock size={14} />
                <span>Event locked — no cancellations</span>
              </div>
            ) : (
              <div className="flex gap-2 flex-1">
                <button
                  onClick={onViewProfile}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-semibold
                             hover:bg-gray-50 active:scale-95 transition-all"
                >
                  View Profile
                </button>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="px-4 py-2.5 border-2 border-red-300 text-red-600 rounded-lg font-semibold
                               hover:bg-red-50 active:scale-95 transition-all text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {speedDate.status === 'completed' && (
          <>
            {!speedDate.feedbackGiven && onGiveFeedback && (
              <button
                onClick={onGiveFeedback}
                className="flex-1 bg-[#E63946] text-white py-2.5 px-4 rounded-lg font-semibold
                           hover:bg-[#D62839] active:scale-95 transition-all"
              >
                Give Feedback
              </button>
            )}
            {speedDate.mutualInterest && onSendMessage && (
              <button
                onClick={onSendMessage}
                className="flex-1 bg-[#06D6A0] text-white py-2.5 px-4 rounded-lg font-semibold
                           hover:bg-[#05C794] active:scale-95 transition-all"
              >
                Send Message
              </button>
            )}
            {!speedDate.mutualInterest && speedDate.feedbackGiven && (
              <button
                onClick={onViewProfile}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-semibold
                           hover:bg-gray-50 active:scale-95 transition-all"
              >
                View Profile
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SpeedDateCard;
