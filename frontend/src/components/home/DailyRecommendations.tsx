import { Sparkles } from 'lucide-react';

interface DailyRecommendationsProps {
  currentIndex: number;
  totalCount: number;
}

function DailyRecommendations({ currentIndex, totalCount }: DailyRecommendationsProps) {
  return (
    <div className="px-4 pt-4 pb-2">
      <div
        className="relative bg-gradient-to-r from-amber-50 to-orange-50
                      border-2 border-amber-200 rounded-lg p-4"
      >
        {/* Ribbon */}
        <div
          className="absolute -top-3 left-4 bg-gradient-to-r from-amber-500 to-orange-500
                        text-white px-4 py-1 rounded-full text-xs font-bold
                        flex items-center gap-1.5 shadow-md"
        >
          <Sparkles size={14} fill="white" />
          <span>TODAY'S TOP PICK</span>
        </div>

        {/* Content */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Daily Recommendations
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">
                Handpicked matches based on your preferences
              </p>
            </div>
            <div
              className="bg-white border border-amber-300 rounded-full
                         px-3 py-1.5 text-sm font-semibold text-amber-700"
            >
              {currentIndex} of {totalCount}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 bg-white/60 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full
                         transition-all duration-300 rounded-full"
              style={{ width: `${(currentIndex / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyRecommendations;
