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

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-black/70 to-transparent" />

        {/* Bottom Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="text-[22px] font-bold mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {profile.name}, {profile.age}
          </h2>
          <p className="text-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {profile.city}, {profile.state}
          </p>
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

      {/* Actions Section */}
      <div className="border-t border-[#F3F4F6] bg-white p-4">
        <div className="flex items-center gap-2">
          {/* Pass Button */}
          <button
            onClick={(e) => handleActionClick(e, onPass)}
            className="flex-[3] h-12 rounded-xl border border-[#E5E7EB] bg-transparent text-[#6C757D] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#FAFAFA] transition-colors active:scale-[0.98]"
            aria-label="Pass"
          >
            <X className="w-5 h-5" />
            Pass
          </button>

          {/* Speed Date Button - Primary */}
          <button
            onClick={(e) => handleActionClick(e, onSpeedDate)}
            className="flex-[4] h-[52px] rounded-xl bg-[#E63946] text-white font-semibold flex flex-col items-center justify-center hover:bg-[#D62828] transition-colors active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)]"
            aria-label="Request Speed Date"
          >
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              <span className="text-[15px]">Speed Date</span>
            </div>
            <span className="text-xs text-white/90 mt-0.5">(200 credits)</span>
          </button>

          {/* Maybe Button */}
          <button
            onClick={(e) => handleActionClick(e, onMaybe)}
            className="flex-[3] h-12 rounded-xl border border-[#E5E7EB] bg-transparent text-[#6C757D] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#FAFAFA] transition-colors active:scale-[0.98]"
            aria-label="Maybe"
          >
            <Bookmark className="w-5 h-5" />
            Maybe
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
