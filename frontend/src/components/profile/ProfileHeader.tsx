import { useState } from 'react';
import { MapPin, Star, Check, Crown } from 'lucide-react';
import { Match } from '../../services/matchService';
import PhotoCarousel from './PhotoCarousel';

interface ProfileHeaderProps {
  match: Match;
  isShortlisted: boolean;
  onToggleShortlist: () => void;
}

function ProfileHeader({
  match,
  isShortlisted,
  onToggleShortlist,
}: ProfileHeaderProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showPhotoCarousel, setShowPhotoCarousel] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPhotoIndex < match.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
    if (isRightSwipe && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div>
      {/* Photo Carousel */}
      <div
        className="relative h-96 bg-gray-200 cursor-pointer"
        onClick={() => setShowPhotoCarousel(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={match.photos[currentPhotoIndex]}
          alt={match.name}
          className="w-full h-full object-cover"
          loading="eager"
        />

        {/* Top-left badges */}
        <div className="absolute top-0 left-0 flex flex-col gap-2 z-10">
          {match.isNewlyJoined && (
            <div className="bg-[#9B59B6] text-white text-xs font-bold px-3 py-1.5 rounded-br-xl">
              NEWLY JOINED
            </div>
          )}
          {match.premium && (
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-br-xl flex items-center gap-1">
              <Crown size={12} fill="white" />
              <span>PREMIUM</span>
            </div>
          )}
          {match.verified && (
            <div className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-br-xl flex items-center gap-1">
              <Check size={12} />
              <span>VERIFIED</span>
            </div>
          )}
        </div>

        {/* Top-right - Photo count + Shortlist */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
          <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
            {currentPhotoIndex + 1} / {match.photos.length}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist();
            }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center
                       hover:scale-110 active:scale-95 transition-transform"
            aria-label={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
          >
            <Star
              size={20}
              className={isShortlisted ? 'text-[#8E44AD]' : 'text-gray-400'}
              fill={isShortlisted ? '#8E44AD' : 'none'}
            />
          </button>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Bottom info */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
          <h1 className="text-2xl font-bold mb-1 drop-shadow-lg">
            {match.name}, {match.age}
          </h1>
          <p className="text-sm opacity-90 mb-1">{match.lastActive}</p>
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin size={14} />
            <span>
              {match.location}, {match.country}
            </span>
          </div>
        </div>

        {/* Photo indicators */}
        {match.photos.length > 1 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {match.photos.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhotoIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentPhotoIndex ? 'bg-white w-4' : 'bg-white/60'
                }`}
                aria-label={`View photo ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Row */}
      <div className="px-4 py-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          <StatPill label={match.height} />
          <StatPill label={match.religion} />
          <StatPill label={match.education} />
          <StatPill label={match.annualIncome} />
          <StatPill label={match.maritalStatus} />
        </div>
      </div>

      {/* Photo Carousel Modal */}
      {showPhotoCarousel && (
        <PhotoCarousel
          photos={match.photos}
          initialIndex={currentPhotoIndex}
          userName={match.name}
          onClose={() => setShowPhotoCarousel(false)}
        />
      )}

      {/* Scrollbar hide styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function StatPill({ label }: { label: string }) {
  return (
    <div
      className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-2.5
                   text-sm font-medium text-[#1D3557] whitespace-nowrap shadow-sm"
    >
      {label}
    </div>
  );
}

export default ProfileHeader;
