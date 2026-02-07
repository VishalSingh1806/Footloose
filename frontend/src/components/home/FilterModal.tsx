import { useState } from 'react';
import { X } from 'lucide-react';

export interface MatchFilters {
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
  interests?: string[];
  minCompatibility?: number;
}

interface FilterModalProps {
  currentFilters: MatchFilters;
  onApply: (filters: MatchFilters) => void;
  onClose: () => void;
}

function FilterModal({ currentFilters, onApply, onClose }: FilterModalProps) {
  const [filters, setFilters] = useState<MatchFilters>(currentFilters);

  const allInterests = [
    'Travel',
    'Photography',
    'Hiking',
    'Yoga',
    'Cooking',
    'Music',
    'Art',
    'Reading',
    'Fitness',
    'Dancing',
    'Gaming',
    'Sports',
  ];

  const handleInterestToggle = (interest: string) => {
    const currentInterests = filters.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];

    setFilters({ ...filters, interests: newInterests });
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    setFilters({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl
                    max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1D3557]">Filters</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center
                       transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Age Range */}
          <div>
            <label className="block text-sm font-semibold text-[#1D3557] mb-3">
              Age Range
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="18"
                max="100"
                placeholder="Min"
                value={filters.minAge || ''}
                onChange={(e) =>
                  setFilters({ ...filters, minAge: parseInt(e.target.value) || undefined })
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                min="18"
                max="100"
                placeholder="Max"
                value={filters.maxAge || ''}
                onChange={(e) =>
                  setFilters({ ...filters, maxAge: parseInt(e.target.value) || undefined })
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20"
              />
            </div>
          </div>

          {/* Distance */}
          <div>
            <label className="block text-sm font-semibold text-[#1D3557] mb-3">
              Maximum Distance: {filters.maxDistance || 50} km
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={filters.maxDistance || 50}
              onChange={(e) =>
                setFilters({ ...filters, maxDistance: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                       accent-[#E63946]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>5 km</span>
              <span>100 km</span>
            </div>
          </div>

          {/* Compatibility */}
          <div>
            <label className="block text-sm font-semibold text-[#1D3557] mb-3">
              Minimum Compatibility: {filters.minCompatibility || 70}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={filters.minCompatibility || 70}
              onChange={(e) =>
                setFilters({ ...filters, minCompatibility: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                       accent-[#E63946]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-semibold text-[#1D3557] mb-3">
              Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => {
                const isSelected = (filters.interests || []).includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${
                        isSelected
                          ? 'bg-[#E63946] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 px-6 rounded-lg font-semibold
                     border-2 border-gray-300 text-gray-700
                     hover:bg-gray-50 active:scale-95 transition-all"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 px-6 rounded-lg font-semibold
                     bg-[#E63946] text-white
                     hover:bg-[#D62839] active:scale-95 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
