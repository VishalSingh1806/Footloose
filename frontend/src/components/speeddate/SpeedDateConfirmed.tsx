import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Check, Bell, Share2, Download, Lock, LockOpen } from 'lucide-react';

interface SpeedDateConfirmedProps {
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  matchLocation: string;
  confirmedDate: string;
  confirmedTime: string;
  eventTime: string;    // ISO timestamp — actual event start time
  onAddToCalendar: () => void;
  onSetReminder: () => void;
  onShare: () => void;
  onViewProfile: () => void;
  onCancel: () => void;  // Opens CancellationFlow modal
  onClose: () => void;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '0 minutes';
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (days === 0 && minutes > 0) parts.push(`${minutes} min`);
  return parts.join(', ') || 'less than a minute';
}

function SpeedDateConfirmed({
  matchName,
  matchAge,
  matchPhoto,
  matchLocation,
  confirmedDate,
  confirmedTime,
  eventTime,
  onAddToCalendar,
  onSetReminder,
  onShare,
  onViewProfile,
  onCancel,
  onClose,
}: SpeedDateConfirmedProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const eventMs = new Date(eventTime).getTime();
  const lockMs = eventMs - 24 * 60 * 60 * 1000; // T-24h
  const msToLock = lockMs - now;
  const msToEvent = eventMs - now;
  const isLocked = now >= lockMs;
  const isLessThan2h = msToEvent > 0 && msToEvent < 2 * 60 * 60 * 1000;
  const isLessThan1h = msToEvent > 0 && msToEvent < 60 * 60 * 1000;

  const eventCountdownColor = isLessThan1h
    ? 'text-red-600'
    : isLessThan2h
    ? 'text-amber-600'
    : 'text-green-700';

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-md w-full text-center py-4">
        {/* Success Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <Check size={56} className="text-white" strokeWidth={3} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-ping opacity-30">🎉</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#1D3557] mb-3">It's Confirmed! 🎊</h1>
        <p className="text-lg text-[#6C757D] mb-6">
          Your speed date with {matchName} is confirmed
        </p>

        {/* User Card */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-4 border-2 border-green-200 text-left">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={matchPhoto}
              alt={matchName}
              className="w-20 h-20 rounded-full object-cover border-4 border-green-500"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1D3557]">{matchName}, {matchAge}</h3>
              <p className="text-sm text-[#6C757D]">{matchLocation}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Calendar size={20} className="text-green-700" />
              <span className="font-bold text-green-900 text-lg">{confirmedDate}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock size={20} className="text-green-700" />
              <span className="font-bold text-green-900 text-lg">{confirmedTime}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-green-700">
              <Video size={16} />
              <span>10-minute video call</span>
            </div>
          </div>
        </div>

        {/* Countdown to Event */}
        {msToEvent > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Speed date starts in:</p>
            <p className={`text-2xl font-bold ${eventCountdownColor}`}>
              {formatCountdown(msToEvent)}
            </p>
            {isLessThan1h && (
              <p className="text-sm text-red-600 font-medium mt-1 animate-pulse">Join now!</p>
            )}
          </div>
        )}

        {/* Lock Status Card */}
        {isLocked ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4 text-left"
               style={{ borderLeft: '4px solid #DC2626' }}>
            <div className="flex items-center gap-2 mb-1">
              <Lock size={20} className="text-red-600" />
              <p className="font-semibold text-red-700">Event is locked</p>
            </div>
            <p className="text-sm text-red-600">
              No cancellations after the 24-hour mark. Join on time to avoid a no-show charge.
            </p>
          </div>
        ) : (
          <div className="bg-white border-2 border-green-200 rounded-xl p-4 mb-4 text-left">
            <div className="flex items-center gap-2 mb-1">
              <LockOpen size={20} className="text-green-600" />
              <p className="font-semibold text-green-700">
                You can cancel until{' '}
                {new Date(lockMs).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <p className="text-sm text-green-600 mb-2">
              {formatCountdown(msToLock)} remaining to cancel with a full refund
            </p>
            {msToLock < 2 * 60 * 60 * 1000 && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ⚠ Event locks soon. Cancel now to get your refund.
              </p>
            )}
            <button
              onClick={onCancel}
              className="mt-3 w-full border-2 border-red-300 text-red-600 py-2 px-4 rounded-lg
                         font-semibold hover:bg-red-50 active:scale-95 transition-all text-sm"
            >
              Cancel Speed Date
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={onAddToCalendar}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-500
                       hover:bg-green-50 transition-all active:scale-95 flex flex-col items-center gap-2"
          >
            <Download size={24} className="text-green-600" />
            <span className="text-sm font-semibold text-[#1D3557]">Add to Calendar</span>
          </button>
          <button
            onClick={onSetReminder}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-500
                       hover:bg-green-50 transition-all active:scale-95 flex flex-col items-center gap-2"
          >
            <Bell size={24} className="text-green-600" />
            <span className="text-sm font-semibold text-[#1D3557]">Set Reminder</span>
          </button>
        </div>

        {/* Preparation Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
          <p className="font-semibold text-blue-900 mb-3">🎯 Quick Tips:</p>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Test your camera and mic 5 minutes before</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Find a quiet, well-lit spot</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Review {matchName}'s profile beforehand</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Be yourself and have fun!</span>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          <button
            onClick={onViewProfile}
            className="w-full bg-[#E63946] text-white py-4 px-6 rounded-xl font-semibold text-base
                       hover:bg-[#D62839] active:scale-95 transition-all shadow-lg"
          >
            View {matchName}'s Profile
          </button>
          <button
            onClick={onShare}
            className="w-full border-2 border-gray-300 text-[#1D3557] py-3 px-6 rounded-xl font-semibold
                       hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share with Friends
          </button>
          <button
            onClick={onClose}
            className="w-full text-[#6C757D] hover:text-[#1D3557] font-medium py-2"
          >
            Back to Speed Dates
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-[#6C757D] mt-6">
          You'll receive push notifications 1 hour and 5 minutes before the call
        </p>
      </div>
    </div>
  );
}

export default SpeedDateConfirmed;
