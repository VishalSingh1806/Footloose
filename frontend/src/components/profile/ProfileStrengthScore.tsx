import React from 'react';
import { TrendingUp, Check, AlertCircle } from 'lucide-react';

interface ProfileStrengthScoreProps {
  score: number; // 0-100
  photoCount: number;
  bioLength: number;
  preferencesComplete: boolean;
  verified: boolean;
  onImprove?: () => void;
}

export function ProfileStrengthScore({
  score,
  photoCount,
  bioLength,
  preferencesComplete,
  verified,
  onImprove,
}: ProfileStrengthScoreProps) {
  const getColor = () => {
    if (score >= 80) return '#2A9D8F';
    if (score >= 60) return '#8E44AD';
    return '#9B59B6';
  };

  const getPhotoQuality = () => {
    if (photoCount >= 5) return { label: 'Excellent', status: 'check' };
    if (photoCount >= 3) return { label: 'Good', status: 'check' };
    return { label: 'Needs improvement', status: 'warning' };
  };

  const getBioQuality = () => {
    if (bioLength > 200) return { label: 'Excellent', status: 'check' };
    if (bioLength > 100) return { label: 'Good', status: 'check' };
    return { label: 'Too short', status: 'warning' };
  };

  const color = getColor();
  const photoQuality = getPhotoQuality();
  const bioQuality = getBioQuality();

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-[#1D3557]">
          Profile Strength
        </h3>
        <TrendingUp size={20} className="text-gray-400" />
      </div>

      {/* Score Circle */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28">
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
              strokeDasharray={`${score * 2.83} 283`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold" style={{ color }}>
              {score}
            </span>
            <span className="text-xs text-gray-500">/ 100</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 sm:space-y-3 mb-4">
        {/* Photos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {photoQuality.status === 'check' ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <AlertCircle size={18} className="text-amber-500" />
            )}
            <span className="text-xs sm:text-sm text-gray-700">Photos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-[#1D3557]">
              {photoQuality.label}
            </span>
            <span className="text-xs text-gray-500">({photoCount} photos)</span>
          </div>
        </div>

        {/* Bio */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {bioQuality.status === 'check' ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <AlertCircle size={18} className="text-amber-500" />
            )}
            <span className="text-xs sm:text-sm text-gray-700">Bio</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-[#1D3557]">
            {bioQuality.label}
          </span>
        </div>

        {/* Preferences */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {preferencesComplete ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <AlertCircle size={18} className="text-amber-500" />
            )}
            <span className="text-xs sm:text-sm text-gray-700">Preferences</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-[#1D3557]">
            {preferencesComplete ? 'Complete' : 'Incomplete'}
          </span>
        </div>

        {/* Verification */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {verified ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <AlertCircle size={18} className="text-amber-500" />
            )}
            <span className="text-xs sm:text-sm text-gray-700">Verification</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-[#1D3557]">
            {verified ? 'Complete' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Improve Button */}
      {score < 90 && onImprove && (
        <button
          onClick={onImprove}
          className="w-full bg-[#9B59B6] text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#D62839] transition-colors"
        >
          Improve Score
        </button>
      )}

      {/* Tip */}
      {score >= 90 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-xs sm:text-sm text-green-800 font-semibold">
            🎉 Excellent profile! Keep it updated.
          </p>
        </div>
      )}
    </div>
  );
}
