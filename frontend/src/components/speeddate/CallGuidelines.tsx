import { useState } from 'react';
import { Video, Lock, CheckCircle } from 'lucide-react';

interface CallGuidelinesProps {
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  matchLocation: string;
  compatibility: number;
  onJoinCall: () => void;
  onNotReady: () => void;
}

function CallGuidelines({
  matchName,
  matchAge,
  matchPhoto,
  matchLocation,
  compatibility,
  onJoinCall,
  onNotReady,
}: CallGuidelinesProps) {
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 my-auto">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#9B59B6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video size={32} className="text-[#9B59B6]" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-[#1D3557] text-center mb-6">
          Speed Date Guidelines
        </h1>

        {/* Quick Rules */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#1D3557] mb-3">Quick Rules:</h2>
          <ol className="space-y-2">
            {[
              'Keep video on throughout',
              'Be respectful and kind',
              'Listen actively',
              'You have 10 minutes',
              'Report any inappropriate behavior',
            ].map((rule, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#9B59B6] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-[#1D3557] pt-0.5">{rule}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tips for Success */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-green-900 mb-2">Tips for Success:</h3>
          <div className="space-y-1 text-sm text-green-800">
            <p>✓ Smile and be yourself</p>
            <p>✓ Ask open-ended questions</p>
            <p>✓ Stay positive and curious</p>
          </div>
        </div>

        {/* Privacy Reminder */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 flex items-center gap-2">
          <Lock size={18} className="text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-900">This call is private and not recorded</p>
        </div>

        {/* Match Info */}
        <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src={matchPhoto}
              alt={matchName}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#9B59B6]"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-[#1D3557]">{matchName}, {matchAge}</h3>
              <p className="text-sm text-[#6C757D]">
                {compatibility}% Compatible • {matchLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToGuidelines}
            onChange={(e) => setAgreedToGuidelines(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-[#9B59B6] focus:ring-[#9B59B6]"
          />
          <span className="text-sm text-[#1D3557]">
            I agree to follow the guidelines and code of conduct
          </span>
        </label>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onJoinCall}
            disabled={!agreedToGuidelines}
            className="w-full bg-[#06D6A0] text-white py-4 px-6 rounded-xl font-semibold text-base
                       hover:bg-[#05C794] active:scale-95 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#06D6A0]
                       flex items-center justify-center gap-2"
          >
            <Video size={20} />
            Join Speed Date
          </button>
          <button
            onClick={onNotReady}
            className="w-full text-[#6C757D] hover:text-[#1D3557] font-medium py-2"
          >
            I'm not ready
          </button>
        </div>
      </div>
    </div>
  );
}

export default CallGuidelines;
