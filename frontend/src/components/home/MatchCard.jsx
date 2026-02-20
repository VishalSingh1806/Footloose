import { Check, Image as ImageIcon, X, Video, Bookmark } from 'lucide-react';
import { useState } from 'react';

function MatchCard({ profile, onPass, onMaybe, onSpeedDate, onViewProfile }) {
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (onViewProfile) onViewProfile(profile.id);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation(); // Prevent card click
    action();
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative h-[400px] bg-[#E5E7EB]">
        {!imageError && profile.photos?.[0] ? (
          <img
            src={profile.photos[0]}
            alt={`Profile photo of ${profile.name}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F3F4F6]">
            <ImageIcon className="w-16 h-16 text-[#9CA3AF]" />
          </div>
        )}

        {/* Verification Badge - Top Left */}
        {profile.isVerified && (
          <div className="absolute top-4 left-4 w-7 h-7 bg-[#2A9D8F] rounded-full flex items-center justify-center border-2 border-white">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Photo Count - Top Right */}
        {profile.photos?.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-medium">{profile.photos.length}</span>
          </div>
        )}

        {/* Bottom Gradient Overlay — extended to cover action buttons */}
        <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-gradient-to-t from-black/80 to-transparent" />

        {/* Bottom Overlay Content: name/location + action buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h2 className="text-[22px] font-bold mb-0.5" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {profile.name}, {profile.age}
          </h2>
          <p className="text-sm mb-3" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {profile.city}, {profile.state}
          </p>

          {/* Action Buttons — inside the card photo */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Pass Button */}
            <button
              onClick={(e) => handleActionClick(e, onPass)}
              className="flex-[3] h-10 rounded-xl border border-white/40 bg-black/25 backdrop-blur-sm text-white text-sm font-medium flex items-center justify-center gap-1.5 active:scale-[0.96] transition-all"
              aria-label="Pass"
            >
              <X className="w-4 h-4" />
              Pass
            </button>

            {/* Speed Date Button - Primary */}
            <button
              onClick={(e) => handleActionClick(e, onSpeedDate)}
              className="flex-[4] h-10 rounded-xl bg-[#9B59B6] text-white font-semibold flex items-center justify-center gap-1.5 active:scale-[0.96] transition-all shadow-[0_2px_8px_rgba(155,89,182,0.4)]"
              aria-label="Request Speed Date"
            >
              <Video className="w-4 h-4" />
              <span className="text-[13px]">Speed Date</span>
            </button>

            {/* Maybe Button */}
            <button
              onClick={(e) => handleActionClick(e, onMaybe)}
              className="flex-[3] h-10 rounded-xl border border-white/40 bg-black/25 backdrop-blur-sm text-white text-sm font-medium flex items-center justify-center gap-1.5 active:scale-[0.96] transition-all"
              aria-label="Maybe"
            >
              <Bookmark className="w-4 h-4" />
              Maybe
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="p-4">
        {/* Row 1: Basic Info */}
        <div className="flex items-center gap-2 text-sm text-[#6C757D] mb-3">
          <span>{profile.height}</span>
          <span>•</span>
          <span>{profile.religion}</span>
          <span>•</span>
          <span className="truncate">{profile.profession}</span>
        </div>

        {/* Row 2: Bio Preview */}
        {profile.bio && (
          <p className="text-[15px] text-[#1D3557] leading-[1.5] line-clamp-2">
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  );
}

export default MatchCard;
