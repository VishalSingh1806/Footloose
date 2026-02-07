import { Calendar, Clock, Video, Check, Bell, Share2, Download } from 'lucide-react';

interface SpeedDateConfirmedProps {
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  matchLocation: string;
  compatibility: number;
  confirmedDate: string;
  confirmedTime: string;
  dateISO: string; // For calendar integration
  onAddToCalendar: () => void;
  onSetReminder: () => void;
  onShare: () => void;
  onViewProfile: () => void;
  onClose: () => void;
}

function SpeedDateConfirmed({
  matchName,
  matchAge,
  matchPhoto,
  matchLocation,
  compatibility,
  confirmedDate,
  confirmedTime,
  onAddToCalendar,
  onSetReminder,
  onShare,
  onViewProfile,
  onClose,
}: SpeedDateConfirmedProps) {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <Check size={56} className="text-white" strokeWidth={3} />
          </div>
          {/* Confetti effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-ping opacity-30">🎉</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#1D3557] mb-3">
          It's a Match! 🎊
        </h1>
        <p className="text-lg text-[#6C757D] mb-8">
          Your speed date with {matchName} is confirmed
        </p>

        {/* User Card */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-6 border-2 border-green-200">
          <div className="flex items-center gap-4 mb-4">
            <img src={matchPhoto} alt={matchName} className="w-20 h-20 rounded-full object-cover border-4 border-green-500" />
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-[#1D3557]">{matchName}, {matchAge}</h3>
              <p className="text-sm text-[#6C757D]">{matchLocation}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm font-semibold text-green-600">❤️ {compatibility}% Match</span>
              </div>
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
          You'll receive notifications 24 hours and 1 hour before the call
        </p>
      </div>
    </div>
  );
}

export default SpeedDateConfirmed;
