import { useState, useEffect } from 'react';
import { Check, Video, Mic, Volume2, Wifi, MapPin, Smile, Clock, AlertTriangle, X } from 'lucide-react';

interface PreDateChecklistProps {
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  startsIn: string; // e.g., "15 minutes"
  confirmedTime: string;
  onJoinCall: () => void;
  onCancel: () => void;
  onClose: () => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  checked: boolean;
}

function PreDateChecklist({
  matchName,
  matchAge,
  matchPhoto,
  startsIn,
  confirmedTime,
  onJoinCall,
  onCancel,
  onClose,
}: PreDateChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'camera', label: 'Camera is working', icon: <Video size={18} />, checked: false },
    { id: 'mic', label: 'Microphone is working', icon: <Mic size={18} />, checked: false },
    { id: 'audio', label: 'Audio is clear', icon: <Volume2 size={18} />, checked: false },
    { id: 'internet', label: 'Strong internet connection', icon: <Wifi size={18} />, checked: false },
    { id: 'location', label: 'In a quiet, well-lit spot', icon: <MapPin size={18} />, checked: false },
    { id: 'ready', label: 'Feeling confident & relaxed', icon: <Smile size={18} />, checked: false },
  ]);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(startsIn);

  // Simulate countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      // In real app, calculate actual time difference
      setTimeRemaining(startsIn);
    }, 1000);

    return () => clearInterval(interval);
  }, [startsIn]);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const allChecked = checklist.every((item) => item.checked);
  const checkedCount = checklist.filter((item) => item.checked).length;

  const handleCancelConfirm = () => {
    onCancel();
  };

  if (showCancelConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelConfirm(false)} />
        <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1D3557] mb-2">Cancel Speed Date?</h2>
            <p className="text-[#6C757D]">
              This will notify {matchName} and you may receive a partial credit refund based on cancellation timing.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleCancelConfirm}
              className="w-full bg-red-600 text-white py-3.5 px-6 rounded-xl font-semibold
                         hover:bg-red-700 active:scale-95 transition-all"
            >
              Yes, Cancel
            </button>
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="w-full text-[#6C757D] hover:text-[#1D3557] font-medium py-2"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30
                     flex items-center justify-center transition-all"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-3">
            <Clock size={18} />
            <span className="font-semibold">Starts in {timeRemaining}</span>
          </div>
          <h1 className="text-2xl font-bold">Pre-Call Checklist</h1>
          <p className="text-green-100 text-sm mt-1">Make sure everything is ready!</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-300"
            style={{ width: `${(checkedCount / checklist.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-green-100 text-center mt-2">
          {checkedCount} of {checklist.length} completed
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Match Info */}
        <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <img src={matchPhoto} alt={matchName} className="w-16 h-16 rounded-full object-cover border-2 border-green-500" />
            <div>
              <h3 className="font-bold text-lg text-[#1D3557]">{matchName}, {matchAge}</h3>
              <p className="text-sm text-[#6C757D]">Scheduled for {confirmedTime}</p>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3 mb-6">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                ${
                  item.checked
                    ? 'bg-green-50 border-green-500'
                    : 'bg-white border-gray-200 hover:border-green-300'
                }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                  ${item.checked ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                {item.checked && <Check size={16} className="text-white" strokeWidth={3} />}
              </div>
              <div className={`flex-shrink-0 ${item.checked ? 'text-green-600' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              <span className={`flex-1 text-left font-medium ${item.checked ? 'text-green-900' : 'text-[#1D3557]'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Smile size={18} />
            Quick Conversation Tips:
          </p>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Start with a warm smile and greeting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Ask about their interests and family values</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Be authentic and share your true self</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Listen actively and show genuine interest</span>
            </li>
          </ul>
        </div>

        {/* Technical Support */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <AlertTriangle size={18} />
            Having technical issues?
          </p>
          <p className="text-sm text-amber-800">
            If you're experiencing camera, microphone, or connection problems, try refreshing the page or
            rejoining the call. Contact support if issues persist.
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-6 bg-white space-y-3">
        <button
          onClick={onJoinCall}
          disabled={!allChecked}
          className="w-full bg-[#E63946] text-white py-4 px-6 rounded-xl font-bold text-lg
                     hover:bg-[#D62839] active:scale-95 transition-all shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E63946]
                     flex items-center justify-center gap-2"
        >
          <Video size={24} />
          {allChecked ? 'Join Call Now' : 'Complete Checklist to Join'}
        </button>
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="w-full text-red-600 hover:text-red-700 font-medium py-2"
        >
          Cancel Speed Date
        </button>
      </div>
    </div>
  );
}

export default PreDateChecklist;
