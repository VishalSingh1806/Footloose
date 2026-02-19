import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Heart, AlertCircle } from 'lucide-react';
import { PartnerPreferences } from '../../types/profile';

interface PartnerPreferencesEditorProps {
  preferences: PartnerPreferences;
  onUpdate?: (preferences: PartnerPreferences) => void;
}

export function PartnerPreferencesEditor({
  preferences: initialPreferences,
  onUpdate,
}: PartnerPreferencesEditorProps) {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<PartnerPreferences>(initialPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleRangeChange = (
    field: 'ageRange' | 'heightRange',
    type: 'min' | 'max',
    value: number
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleMultiSelect = (field: keyof PartnerPreferences, value: string) => {
    const currentValues = preferences[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    setPreferences((prev) => ({
      ...prev,
      [field]: newValues,
    }));
    setHasChanges(true);
  };

  const handleSingleSelect = (field: keyof PartnerPreferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onUpdate?.(preferences);
      navigate(-1);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const religionOptions = [
    'Hindu',
    'Muslim',
    'Christian',
    'Sikh',
    'Buddhist',
    'Jain',
    'Other',
    'No Preference',
  ];

  const maritalStatusOptions = ['Never Married', 'Divorced', 'Widowed', 'Any'];

  const educationOptions = [
    'High School',
    'Diploma',
    'Bachelor\'s',
    'Master\'s',
    'Doctorate',
    'Any',
  ];

  const professionOptions = [
    'Business Owner',
    'Employed',
    'Self-Employed',
    'Student',
    'Homemaker',
    'Any',
  ];

  const dietOptions = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian', 'Any'];

  const smokingOptions = ['No', 'Occasionally', 'Any'];

  const drinkingOptions = ['No', 'Socially', 'Any'];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-[#1D3557]" />
          </button>
          <h1 className="text-xl font-bold text-[#1D3557]">Partner Preferences</h1>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[#E63946]"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-l-4 border-pink-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Heart size={20} className="text-pink-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-pink-900 mb-1">
                Find Your Perfect Match
              </p>
              <p className="text-xs sm:text-sm text-pink-800">
                Set your preferences to help us find compatible matches for you
              </p>
            </div>
          </div>
        </div>

        {/* Age Range */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-4">Age Range</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{preferences.ageRange.min} years</span>
              <span>{preferences.ageRange.max} years</span>
            </div>

            {/* Dual Range Slider */}
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div
                className="absolute h-full bg-[#E63946] rounded-full"
                style={{
                  left: `${((preferences.ageRange.min - 18) / (60 - 18)) * 100}%`,
                  right: `${100 - ((preferences.ageRange.max - 18) / (60 - 18)) * 100}%`,
                }}
              />
              <input
                type="range"
                min="18"
                max="60"
                value={preferences.ageRange.min}
                onChange={(e) => handleRangeChange('ageRange', 'min', parseInt(e.target.value))}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E63946] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#E63946] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
              <input
                type="range"
                min="18"
                max="60"
                value={preferences.ageRange.max}
                onChange={(e) => handleRangeChange('ageRange', 'max', parseInt(e.target.value))}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E63946] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#E63946] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Height Range */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-4">Height Range (cm)</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{preferences.heightRange.min} cm</span>
              <span>{preferences.heightRange.max} cm</span>
            </div>

            {/* Dual Range Slider */}
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div
                className="absolute h-full bg-[#E63946] rounded-full"
                style={{
                  left: `${((preferences.heightRange.min - 140) / (210 - 140)) * 100}%`,
                  right: `${100 - ((preferences.heightRange.max - 140) / (210 - 140)) * 100}%`,
                }}
              />
              <input
                type="range"
                min="140"
                max="210"
                value={preferences.heightRange.min}
                onChange={(e) => handleRangeChange('heightRange', 'min', parseInt(e.target.value))}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E63946] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#E63946] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
              <input
                type="range"
                min="140"
                max="210"
                value={preferences.heightRange.max}
                onChange={(e) => handleRangeChange('heightRange', 'max', parseInt(e.target.value))}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E63946] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#E63946] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Religion */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-4">Religion</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">Select all that apply</p>
          <div className="grid grid-cols-2 gap-2">
            {religionOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect('religion', option)}
                className={`px-3 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                  preferences.religion.includes(option)
                    ? 'border-[#E63946] bg-[#FFF5F5] text-[#E63946]'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Marital Status */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-4">Marital Status</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">Select all that apply</p>
          <div className="grid grid-cols-2 gap-2">
            {maritalStatusOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect('maritalStatus', option)}
                className={`px-3 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                  preferences.maritalStatus.includes(option)
                    ? 'border-[#E63946] bg-[#FFF5F5] text-[#E63946]'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-4">Education</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">Select all that apply</p>
          <div className="grid grid-cols-2 gap-2">
            {educationOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect('education', option)}
                className={`px-3 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                  preferences.education.includes(option)
                    ? 'border-[#E63946] bg-[#FFF5F5] text-[#E63946]'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Profession */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-4">Profession</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">Select all that apply</p>
          <div className="grid grid-cols-2 gap-2">
            {professionOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect('profession', option)}
                className={`px-3 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                  preferences.profession.includes(option)
                    ? 'border-[#E63946] bg-[#FFF5F5] text-[#E63946]'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Lifestyle Preferences */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-6">Lifestyle Preferences</h2>

          {/* Diet */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1D3557] mb-3">
              Diet Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dietOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('diet', option)}
                  className={`px-3 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                    preferences.diet.includes(option)
                      ? 'border-[#E63946] bg-[#FFF5F5] text-[#E63946]'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Smoking */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1D3557] mb-3">
              Smoking
            </label>
            <div className="grid grid-cols-2 gap-2">
              {smokingOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('smoking', option)}
                  className={`px-3 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                    preferences.smoking.includes(option)
                      ? 'border-[#E63946] bg-[#FFF5F5] text-[#E63946]'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Drinking */}
          <div>
            <label className="block text-sm font-semibold text-[#1D3557] mb-3">
              Drinking
            </label>
            <div className="grid grid-cols-2 gap-2">
              {drinkingOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('drinking', option)}
                  className={`px-3 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                    preferences.drinking.includes(option)
                      ? 'border-[#E63946] bg-[#FFF5F5] text-[#E63946]'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button (mobile sticky) */}
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:hidden">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="w-full bg-[#E63946] text-white py-3 rounded-xl font-bold hover:bg-[#D62839] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
