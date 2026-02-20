import { Heart, RefreshCw, SlidersHorizontal } from 'lucide-react';

interface NoMatchesProps {
  onRefresh: () => void;
}

function NoMatches({ onRefresh }: NoMatchesProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-6 bg-[#FAFAFA]">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 bg-[#9B59B6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="text-[#9B59B6]" size={48} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#1D3557] mb-3">
          You've Viewed All Available Profiles
        </h2>

        {/* Description */}
        <p className="text-[#6C757D] mb-8 leading-relaxed">
          We're constantly adding new profiles that match your preferences. Check back soon or
          adjust your partner preferences to view more profiles.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onRefresh}
            className="w-full bg-[#9B59B6] text-white py-3 px-6 rounded-lg font-semibold
                     flex items-center justify-center gap-2
                     hover:bg-[#D62839] active:scale-95 transition-all"
          >
            <RefreshCw size={20} />
            <span>Check for New Profiles</span>
          </button>

          <button
            className="w-full bg-white text-[#1D3557] py-3 px-6 rounded-lg font-semibold
                     border-2 border-[#E5E7EB] flex items-center justify-center gap-2
                     hover:border-[#9B59B6] hover:text-[#9B59B6] active:scale-95 transition-all"
          >
            <SlidersHorizontal size={18} />
            <span>Update Partner Preferences</span>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 space-y-3">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-left">
            <p className="text-sm text-[#1D3557]">
              <span className="font-semibold">💡 Tip:</span> Expanding your preferred age range,
              location radius, or education criteria may help you find more compatible matches.
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <p className="text-sm text-[#1D3557]">
              <span className="font-semibold">✨ Did you know?</span> Premium members get access to
              exclusive profiles and unlimited connections. Upgrade to find your perfect match
              faster!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoMatches;
