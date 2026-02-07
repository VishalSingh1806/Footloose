import { useState } from 'react';
import { X, Star, Video, Heart, Check, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  matchId: string;
  matchName: string;
  onDontShow: () => void;
  onShortlist: () => void;
  onSpeedDate: () => void;
  onSendInterest: () => void;
  isShortlisted?: boolean;
}

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

function ActionButtons({
  matchId,
  matchName,
  onDontShow,
  onShortlist,
  onSpeedDate,
  onSendInterest,
  isShortlisted = false,
}: ActionButtonsProps) {
  const [dontShowState, setDontShowState] = useState<ButtonState>('idle');
  const [shortlistState, setShortlistState] = useState<ButtonState>('idle');
  const [speedDateState, setSpeedDateState] = useState<ButtonState>('idle');
  const [interestState, setInterestState] = useState<ButtonState>('idle');
  const [shortlisted, setShortlisted] = useState(isShortlisted);

  const handleDontShow = async () => {
    setDontShowState('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setDontShowState('success');
      setTimeout(() => {
        onDontShow();
      }, 300);
    } catch (error) {
      setDontShowState('error');
      setTimeout(() => setDontShowState('idle'), 2000);
    }
  };

  const handleShortlist = async () => {
    setShortlistState('loading');
    setShortlisted(!shortlisted); // Optimistic update
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setShortlistState('success');
      setTimeout(() => setShortlistState('idle'), 1500);
      onShortlist();
    } catch (error) {
      setShortlisted(shortlisted); // Revert on error
      setShortlistState('error');
      setTimeout(() => setShortlistState('idle'), 2000);
    }
  };

  const handleSpeedDate = async () => {
    setSpeedDateState('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setSpeedDateState('success');
      setTimeout(() => setSpeedDateState('idle'), 1500);
      onSpeedDate();
    } catch (error) {
      setSpeedDateState('error');
      setTimeout(() => setSpeedDateState('idle'), 2000);
    }
  };

  const handleSendInterest = async () => {
    setInterestState('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call
      setInterestState('success');
      setTimeout(() => {
        setInterestState('idle');
        onSendInterest();
      }, 1500);
    } catch (error) {
      setInterestState('error');
      setTimeout(() => setInterestState('idle'), 2000);
    }
  };

  return (
    <div
      className="bg-white border-t border-gray-200 px-4 py-3
                    flex gap-2 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]"
    >
      {/* Don't Show Button */}
      <button
        onClick={handleDontShow}
        disabled={dontShowState === 'loading'}
        className="flex-1 h-11 rounded-lg border border-gray-300
                   flex items-center justify-center gap-2
                   text-gray-600 text-sm font-medium
                   hover:bg-gray-50 active:scale-95 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Don't show this profile"
      >
        {dontShowState === 'loading' ? (
          <Loader2 size={18} className="animate-spin" />
        ) : dontShowState === 'success' ? (
          <Check size={18} />
        ) : (
          <X size={18} />
        )}
        <span className="hidden sm:inline">
          {dontShowState === 'success' ? 'Hidden' : "Don't Show"}
        </span>
      </button>

      {/* Shortlist Button */}
      <button
        onClick={handleShortlist}
        disabled={shortlistState === 'loading'}
        className={`flex-1 h-11 rounded-lg border
                   flex items-center justify-center gap-2
                   text-sm font-medium
                   hover:bg-orange-50 active:scale-95 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed
                   ${
                     shortlisted
                       ? 'border-[#F4A261] bg-[#F4A261] text-white'
                       : 'border-[#F4A261] text-[#F4A261]'
                   }`}
        aria-label={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
      >
        {shortlistState === 'loading' ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Star size={18} fill={shortlisted ? 'white' : 'none'} />
        )}
        <span className="hidden sm:inline">
          {shortlisted ? 'Shortlisted' : 'Shortlist'}
        </span>
      </button>

      {/* Speed Date Button */}
      <button
        onClick={handleSpeedDate}
        disabled={speedDateState === 'loading'}
        className="flex-1 h-11 rounded-lg
                   bg-[#2A9D8F] text-white
                   flex items-center justify-center gap-2
                   text-sm font-semibold
                   hover:bg-[#238276] active:scale-95 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Request speed date"
      >
        {speedDateState === 'loading' ? (
          <Loader2 size={18} className="animate-spin" />
        ) : speedDateState === 'success' ? (
          <Check size={18} />
        ) : (
          <Video size={18} />
        )}
        <span className="hidden sm:inline">
          {speedDateState === 'success' ? 'Requested' : 'Speed Date'}
        </span>
      </button>

      {/* Send Interest Button */}
      <button
        onClick={handleSendInterest}
        disabled={interestState === 'loading'}
        className="flex-1 h-11 rounded-lg
                   bg-[#E63946] text-white
                   flex items-center justify-center gap-2
                   text-sm font-semibold
                   hover:bg-[#D62839] active:scale-95 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Send interest"
      >
        {interestState === 'loading' ? (
          <Loader2 size={18} className="animate-spin" />
        ) : interestState === 'success' ? (
          <Check size={18} />
        ) : (
          <Heart size={18} fill="white" />
        )}
        <span className="hidden sm:inline">
          {interestState === 'success' ? 'Sent' : 'Send Interest'}
        </span>
      </button>
    </div>
  );
}

export default ActionButtons;
