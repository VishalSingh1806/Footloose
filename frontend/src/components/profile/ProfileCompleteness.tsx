import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, AlertCircle, X } from 'lucide-react';
import { ProfileCompleteness as ProfileCompletenessType } from '../../types/profile';

interface ProfileCompletenessProps {
  data: ProfileCompletenessType;
  onCompleteSection?: (section: string) => void;
  showBanner?: boolean;
  onDismissBanner?: () => void;
}

export function ProfileCompleteness({
  data,
  onCompleteSection,
  showBanner = false,
  onDismissBanner,
}: ProfileCompletenessProps) {
  const [expanded, setExpanded] = useState(false);

  const getColor = (percentage: number) => {
    if (percentage >= 80) return '#2A9D8F';
    if (percentage >= 60) return '#8E44AD';
    return '#9B59B6';
  };

  const color = getColor(data.overall);

  // Banner version (shown when incomplete)
  if (showBanner && data.overall < 100) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Progress Circle */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="4"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  fill="none"
                  stroke={color}
                  strokeWidth="4"
                  strokeDasharray={`${data.overall * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold text-[#1D3557]">
                  {data.overall}%
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-bold text-[#1D3557] mb-1">
                Your profile is {data.overall}% complete
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Complete your profile to get better matches
              </p>
              {data.missing.length > 0 && (
                <p className="text-xs text-gray-500">
                  Missing: {data.missing.slice(0, 2).join(', ')}
                  {data.missing.length > 2 && ` +${data.missing.length - 2} more`}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-2">
            {onCompleteSection && (
              <button
                onClick={() => onCompleteSection('all')}
                className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap"
              >
                Complete Now
              </button>
            )}
            {onDismissBanner && (
              <button
                onClick={onDismissBanner}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Card version (shown in profile)
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-[#1D3557]">
          Profile Completeness
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="8"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={`${data.overall * 2.83} 283`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-[#1D3557]">
              {data.overall}%
            </span>
            <span className="text-xs text-gray-500">Complete</span>
          </div>
        </div>
      </div>

      {/* Motivation */}
      <p className="text-xs sm:text-sm text-center text-gray-600 mb-4">
        Complete profiles get 5x more matches!
      </p>

      {/* Breakdown (expanded) */}
      {expanded && (
        <div className="space-y-2 pt-4 border-t border-gray-200">
          {Object.entries(data.breakdown).map(([key, value]) => {
            const maxValue = getMaxValueForSection(key);
            const isComplete = value === maxValue;
            const label = formatSectionName(key);

            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  {isComplete ? (
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                  ) : value > 0 ? (
                    <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                  ) : (
                    <X size={16} className="text-red-500 flex-shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm text-gray-700">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-[#1D3557]">
                    {value}%
                  </span>
                  {!isComplete && onCompleteSection && (
                    <button
                      onClick={() => onCompleteSection(key)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getMaxValueForSection(section: string): number {
  const maxValues: Record<string, number> = {
    basicDetails: 20,
    photos: 15,
    bio: 15,
    familyDetails: 10,
    education: 10,
    lifestyle: 10,
    partnerPreferences: 10,
    verification: 10,
  };
  return maxValues[section] || 0;
}

function formatSectionName(section: string): string {
  const names: Record<string, string> = {
    basicDetails: 'Basic Details',
    photos: 'Photos',
    bio: 'Bio & About Me',
    familyDetails: 'Family Details',
    education: 'Education & Career',
    lifestyle: 'Lifestyle & Hobbies',
    partnerPreferences: 'Partner Preferences',
    verification: 'Verification',
  };
  return names[section] || section;
}
