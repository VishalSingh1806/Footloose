import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Users,
  Ban,
  Download,
  Trash2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { PrivacySettings as PrivacySettingsType } from '../../types/profile';

interface PrivacySettingsProps {
  settings: PrivacySettingsType;
  onUpdate?: (settings: PrivacySettingsType) => void;
}

export function PrivacySettings({ settings: initialSettings, onUpdate }: PrivacySettingsProps) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PrivacySettingsType>(initialSettings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);

  const handleToggle = (field: keyof PrivacySettingsType) => {
    const newSettings = {
      ...settings,
      [field]: !settings[field],
    };
    setSettings(newSettings);
    onUpdate?.(newSettings);
  };

  const handleVisibilityChange = (
    field: 'photoVisibility' | 'contactVisibility' | 'lastSeenVisibility',
    value: 'everyone' | 'matches' | 'premium' | 'nobody'
  ) => {
    const newSettings = {
      ...settings,
      [field]: value,
    };
    setSettings(newSettings);
    onUpdate?.(newSettings);
  };

  const privacyToggles = [
    {
      id: 'showOnline',
      icon: Eye,
      title: 'Show Online Status',
      description: 'Let others see when you\'re active',
      value: settings.showOnline,
    },
    {
      id: 'showDistance',
      icon: Users,
      title: 'Show Distance',
      description: 'Display your distance to other users',
      value: settings.showDistance,
    },
    {
      id: 'allowMessages',
      icon: Lock,
      title: 'Allow Messages from Anyone',
      description: 'Anyone can message you (turn off to allow matches only)',
      value: settings.allowMessages,
    },
    {
      id: 'showInSearch',
      icon: Eye,
      title: 'Show in Search',
      description: 'Appear in search results',
      value: settings.showInSearch,
    },
    {
      id: 'incognito',
      icon: EyeOff,
      title: 'Incognito Mode',
      description: 'Browse profiles without being seen (Premium only)',
      value: settings.incognito,
      premium: true,
    },
  ];

  const visibilityOptions: Array<{
    value: 'everyone' | 'matches' | 'premium' | 'nobody';
    label: string;
  }> = [
    { value: 'everyone', label: 'Everyone' },
    { value: 'matches', label: 'Matches Only' },
    { value: 'premium', label: 'Premium Users' },
    { value: 'nobody', label: 'Nobody' },
  ];

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
          <h1 className="text-xl font-bold text-[#1D3557]">Privacy Settings</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Privacy Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Your Privacy Matters
              </p>
              <p className="text-xs sm:text-sm text-blue-800">
                Control who can see your profile and contact you. Changes take effect
                immediately.
              </p>
            </div>
          </div>
        </div>

        {/* General Privacy Toggles */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-4">General Privacy</h2>
          <div className="space-y-4">
            {privacyToggles.map((toggle) => {
              const Icon = toggle.icon;
              return (
                <div
                  key={toggle.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm sm:text-base font-semibold text-[#1D3557]">
                          {toggle.title}
                        </p>
                        {toggle.premium && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white text-xs font-bold rounded-full">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {toggle.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(toggle.id as keyof PrivacySettingsType)}
                    className={`w-12 h-7 sm:w-14 sm:h-8 rounded-full transition-colors relative flex-shrink-0 ${
                      toggle.value ? 'bg-[#2A9D8F]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full absolute top-1 transition-all ${
                        toggle.value ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Photo Visibility */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-4">Photo Visibility</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Choose who can see your photos
          </p>
          <div className="space-y-2">
            {visibilityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleVisibilityChange('photoVisibility', option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  settings.photoVisibility === option.value
                    ? 'border-[#9B59B6] bg-[#FFF5F5]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1D3557]">
                    {option.label}
                  </span>
                  {settings.photoVisibility === option.value && (
                    <div className="w-5 h-5 bg-[#9B59B6] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Visibility */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-4">Contact Visibility</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Choose who can see your contact details
          </p>
          <div className="space-y-2">
            {visibilityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleVisibilityChange('contactVisibility', option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  settings.contactVisibility === option.value
                    ? 'border-[#9B59B6] bg-[#FFF5F5]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1D3557]">
                    {option.label}
                  </span>
                  {settings.contactVisibility === option.value && (
                    <div className="w-5 h-5 bg-[#9B59B6] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Last Seen Visibility */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-4">Last Seen Visibility</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Choose who can see when you were last active
          </p>
          <div className="space-y-2">
            {visibilityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleVisibilityChange('lastSeenVisibility', option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  settings.lastSeenVisibility === option.value
                    ? 'border-[#9B59B6] bg-[#FFF5F5]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1D3557]">
                    {option.label}
                  </span>
                  {settings.lastSeenVisibility === option.value && (
                    <div className="w-5 h-5 bg-[#9B59B6] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Blocked Users */}
        <button
          onClick={() => setShowBlockedUsers(true)}
          className="w-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Ban size={24} className="text-gray-600" />
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-bold text-[#1D3557]">
                Blocked Users
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {settings.blockedUsers.length} users blocked
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>

        {/* Data & Account */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md space-y-4">
          <h2 className="text-lg font-bold text-[#1D3557]">Data & Account</h2>

          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Download size={20} className="text-gray-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-[#1D3557]">Download My Data</p>
                <p className="text-xs text-gray-600">Get a copy of your information</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-red-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-red-600">Delete Account</p>
                <p className="text-xs text-gray-600">Permanently remove your account</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Blocked Users Modal */}
      {showBlockedUsers && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#1D3557] mb-4">Blocked Users</h2>

              {settings.blockedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Ban size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No blocked users</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {settings.blockedUsers.map((userId) => (
                    <div
                      key={userId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                        <div>
                          <p className="text-sm font-semibold text-[#1D3557]">User {userId}</p>
                          <p className="text-xs text-gray-500">Blocked</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-[#9B59B6] text-white rounded-lg text-xs font-semibold hover:bg-[#D62839] transition-colors">
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowBlockedUsers(false)}
                className="w-full text-gray-600 py-3 font-semibold hover:text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>

              <h2 className="text-xl font-bold text-[#1D3557] mb-2 text-center">
                Delete Account?
              </h2>
              <p className="text-sm text-gray-600 mb-6 text-center">
                This action cannot be undone. All your data, matches, and messages will be
                permanently deleted.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-xs font-semibold text-red-900 mb-2">You will lose:</p>
                <ul className="text-xs text-red-800 space-y-1">
                  <li>• All your profile information</li>
                  <li>• All matches and connections</li>
                  <li>• All messages and chat history</li>
                  <li>• Premium subscription (non-refundable)</li>
                  <li>• Credit balance (non-refundable)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-red-500 text-white py-3 sm:py-4 rounded-xl font-bold hover:bg-red-600 transition-colors">
                  Delete My Account
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full text-gray-600 py-2 sm:py-3 font-semibold hover:text-gray-800 transition-colors"
                >
                  Keep My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
