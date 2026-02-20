import { useState } from 'react';
import { Heart, Video, Star, MoreVertical, Check, Loader2 } from 'lucide-react';

interface ProfileActionsProps {
  matchName: string;
  interestSent: boolean;
  onSendInterest: () => void;
  onRequestSpeedDate: () => void;
  onShortlist: () => void;
  onMore: () => void;
  isShortlisted?: boolean;
}

type ButtonState = 'idle' | 'loading' | 'success';

function ProfileActions({
  matchName,
  interestSent,
  onSendInterest,
  onRequestSpeedDate,
  onShortlist,
  onMore,
  isShortlisted = false,
}: ProfileActionsProps) {
  const [interestState, setInterestState] = useState<ButtonState>('idle');
  const [speedDateState, setSpeedDateState] = useState<ButtonState>('idle');

  const handleSendInterest = async () => {
    setInterestState('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setInterestState('success');
      setTimeout(() => {
        onSendInterest();
      }, 1000);
    } catch (error) {
      setInterestState('idle');
    }
  };

  const handleSpeedDate = async () => {
    setSpeedDateState('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSpeedDateState('success');
      setTimeout(() => {
        onRequestSpeedDate();
        setSpeedDateState('idle');
      }, 1000);
    } catch (error) {
      setSpeedDateState('idle');
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200
                    px-5 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-30"
      style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      {/* Secondary Actions */}
      <div className="flex items-center justify-center gap-8 mb-4 text-sm">
        <button
          onClick={onShortlist}
          className="flex items-center gap-1.5 text-[#6C757D] hover:text-[#9B59B6] transition-colors"
        >
          <Star size={16} fill={isShortlisted ? '#8E44AD' : 'none'} />
          <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
        </button>
        <button
          onClick={onMore}
          className="flex items-center gap-1.5 text-[#6C757D] hover:text-[#9B59B6] transition-colors"
        >
          <MoreVertical size={16} />
          <span>More</span>
        </button>
      </div>

      {/* Primary Actions */}
      <div className="flex gap-4">
        {interestSent ? (
          <button
            disabled
            className="flex-1 h-14 bg-green-500 text-white rounded-xl font-semibold
                       flex items-center justify-center gap-2 px-4"
          >
            <Check size={22} />
            <span>Interest Sent</span>
          </button>
        ) : (
          <button
            onClick={handleSendInterest}
            disabled={interestState !== 'idle'}
            className="flex-1 h-14 bg-[#9B59B6] text-white rounded-xl font-semibold text-base
                       flex items-center justify-center gap-2 px-4
                       hover:bg-[#D62839] active:scale-95 transition-all
                       disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {interestState === 'loading' ? (
              <Loader2 size={22} className="animate-spin" />
            ) : interestState === 'success' ? (
              <Check size={22} />
            ) : (
              <Heart size={22} fill="white" />
            )}
            <span>
              {interestState === 'success' ? 'Sent!' : `Send Interest`}
            </span>
          </button>
        )}

        <button
          onClick={handleSpeedDate}
          disabled={speedDateState !== 'idle'}
          className="flex-1 h-14 bg-[#2A9D8F] text-white rounded-xl font-semibold text-base
                     flex items-center justify-center gap-2 px-4
                     hover:bg-[#238276] active:scale-95 transition-all
                     disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {speedDateState === 'loading' ? (
            <Loader2 size={22} className="animate-spin" />
          ) : speedDateState === 'success' ? (
            <Check size={22} />
          ) : (
            <Video size={22} />
          )}
          <span className="hidden sm:inline">
            {speedDateState === 'success' ? 'Requested!' : 'Speed Date'}
          </span>
          <span className="sm:hidden">
            {speedDateState === 'success' ? 'Sent!' : 'Date'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProfileActions;
