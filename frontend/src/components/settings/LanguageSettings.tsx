/**
 * Language Settings Component
 * Language selection with radio buttons for supported Indian languages
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Globe } from 'lucide-react';
import { getLanguage, setLanguage } from '../../services/settingsService';
import type { SupportedLanguage, LanguageOption } from '../../types/settings';

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
];

export default function LanguageSettings() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      setIsLoading(true);
      const lang = await getLanguage();
      setSelectedLanguage(lang);
    } catch (error) {
      console.error('Failed to load language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (language: SupportedLanguage) => {
    try {
      setIsSaving(true);
      setSelectedLanguage(language);
      await setLanguage(language);
      alert('Language updated successfully! Some changes may require app restart.');
    } catch (error) {
      console.error('Failed to update language:', error);
      alert('Failed to update language. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E63946]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="flex-1 text-xl font-bold text-gray-900 ml-2">Language</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Language Info */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Globe size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Choose Your Language</h2>
          </div>
          <p className="text-sm text-white text-opacity-90">
            Select your preferred language for the app interface. More languages coming soon!
          </p>
        </div>

        {/* Language Selection */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Available Languages</h2>
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
            {LANGUAGE_OPTIONS.map((option) => (
              <LanguageOption
                key={option.code}
                option={option}
                isSelected={selectedLanguage === option.code}
                isDisabled={isSaving}
                onSelect={() => handleLanguageChange(option.code)}
              />
            ))}
          </div>
        </div>

        {/* Translation Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Translation Notice</h3>
          <p className="text-sm text-gray-600">
            We're continuously improving our translations. If you notice any issues or have
            suggestions, please let us know through the feedback form.
          </p>
        </div>

        {/* Language Support Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">What Gets Translated</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>App interface and navigation</span>
            </div>
            <div className="flex items-start gap-2">
              <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Settings and options</span>
            </div>
            <div className="flex items-start gap-2">
              <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Notifications and alerts</span>
            </div>
            <div className="flex items-start gap-2">
              <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Help and support content</span>
            </div>
          </div>
        </div>

        {/* User Content Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">User-Generated Content</h3>
          <p className="text-sm text-gray-600">
            Profiles, messages, and other user-generated content appear in the language chosen by
            each user. Use the app's built-in translation feature to translate messages.
          </p>
        </div>

        {/* Restart Notice */}
        {isSaving && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-[#E63946]">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E63946]"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Applying Changes...</h3>
                <p className="text-sm text-gray-600">
                  The app may need to refresh to apply language changes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components

interface LanguageOptionProps {
  option: LanguageOption;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

const LanguageOption: React.FC<LanguageOptionProps> = ({
  option,
  isSelected,
  isDisabled,
  onSelect,
}) => {
  return (
    <button
      onClick={onSelect}
      disabled={isDisabled}
      className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? 'border-[#E63946] bg-[#E63946]'
              : 'border-gray-300 bg-white'
          }`}
        >
          {isSelected && <Check size={16} className="text-white" />}
        </div>
        <div className="text-left">
          <div className="font-semibold text-gray-900">{option.name}</div>
          <div className="text-lg text-gray-600">{option.nativeName}</div>
        </div>
      </div>
      {isSelected && (
        <div className="px-3 py-1 bg-[#E63946] bg-opacity-10 rounded-full">
          <span className="text-xs font-semibold text-[#E63946]">Active</span>
        </div>
      )}
    </button>
  );
};
