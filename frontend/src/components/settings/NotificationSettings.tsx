/**
 * Notification Settings Component
 * Control all notification preferences: push, email, SMS, sounds
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from '../../services/settingsService';
import type { NotificationPreferences } from '../../types/settings';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

export default function NotificationSettings() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const prefs = await getNotificationPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;

    try {
      setIsSaving(true);
      await updateNotificationPreferences(preferences);
      setHasChanges(false);
      // Show success toast
      alert('Notification preferences saved!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = (updates: Partial<NotificationPreferences>) => {
    if (!preferences) return;
    setPreferences({ ...preferences, ...updates });
    setHasChanges(true);
  };

  const updatePushPreference = (key: keyof NotificationPreferences['push'], value: boolean) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      push: { ...preferences.push, [key]: value },
    });
    setHasChanges(true);
  };

  const updateQuietHours = (updates: Partial<NotificationPreferences['quietHours']>) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      quietHours: { ...preferences.quietHours, ...updates },
    });
    setHasChanges(true);
  };

  const updateEmailPreference = (key: keyof NotificationPreferences['email'], value: any) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      email: { ...preferences.email, [key]: value },
    });
    setHasChanges(true);
  };

  const updateSMSPreference = (key: keyof NotificationPreferences['sms'], value: boolean) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      sms: { ...preferences.sms, [key]: value },
    });
    setHasChanges(true);
  };

  const updateSoundsPreference = (key: keyof NotificationPreferences['sounds'], value: any) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      sounds: { ...preferences.sounds, [key]: value },
    });
    setHasChanges(true);
  };

  const updateInAppPreference = (key: keyof NotificationPreferences['inApp'], value: boolean) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      inApp: { ...preferences.inApp, [key]: value },
    });
    setHasChanges(true);
  };

  const toggleQuietHoursDay = (day: string) => {
    if (!preferences) return;
    const days = preferences.quietHours.days.includes(day)
      ? preferences.quietHours.days.filter((d) => d !== day)
      : [...preferences.quietHours.days, day];
    updateQuietHours({ days });
  };

  if (isLoading || !preferences) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9B59B6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-2">Notifications</h1>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-[#9B59B6] text-white rounded-lg font-semibold hover:bg-[#d62839] disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Master Toggle */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <ToggleRow
            label="Allow Notifications"
            description="Master switch for all notifications"
            checked={preferences.masterEnabled}
            onChange={(checked) => updatePreference({ masterEnabled: checked })}
            highlight
          />
        </div>

        {/* Push Notifications */}
        <Section title="Push Notifications">
          <ToggleRow
            label="New Matches"
            description="When someone matches with you"
            checked={preferences.push.newMatches}
            onChange={(checked) => updatePushPreference('newMatches', checked)}
            disabled={!preferences.masterEnabled}
          />
          <ToggleRow
            label="Speed Date Requests"
            description="When someone requests a speed date"
            checked={preferences.push.speedDateRequests}
            onChange={(checked) => updatePushPreference('speedDateRequests', checked)}
            disabled={!preferences.masterEnabled}
          />
          <ToggleRow
            label="Speed Date Reminders"
            description="1 hour and 5 minutes before"
            checked={preferences.push.speedDateReminders}
            onChange={(checked) => updatePushPreference('speedDateReminders', checked)}
            disabled={!preferences.masterEnabled}
          />
          <ToggleRow
            label="New Messages"
            description="When you receive a message"
            checked={preferences.push.newMessages}
            onChange={(checked) => updatePushPreference('newMessages', checked)}
            disabled={!preferences.masterEnabled}
          />
          <ToggleRow
            label="Profile Views"
            description="When someone views your profile"
            checked={preferences.push.profileViews}
            onChange={(checked) => updatePushPreference('profileViews', checked)}
            disabled={!preferences.masterEnabled}
          />
          <ToggleRow
            label="Likes"
            description="When someone likes your profile"
            checked={preferences.push.likesReceived}
            onChange={(checked) => updatePushPreference('likesReceived', checked)}
            disabled={!preferences.masterEnabled}
          />
          <ToggleRow
            label="Interests"
            description="When someone sends interest"
            checked={preferences.push.interestsReceived}
            onChange={(checked) => updatePushPreference('interestsReceived', checked)}
            disabled={!preferences.masterEnabled}
          />
          <ToggleRow
            label="Offers & Updates"
            description="Special offers, new features"
            checked={preferences.push.promotional}
            onChange={(checked) => updatePushPreference('promotional', checked)}
            disabled={!preferences.masterEnabled}
          />
        </Section>

        {/* Quiet Hours */}
        <Section title="Quiet Hours">
          <ToggleRow
            label="Enable Quiet Hours"
            description="Don't disturb during these times"
            checked={preferences.quietHours.enabled}
            onChange={(checked) => updateQuietHours({ enabled: checked })}
            disabled={!preferences.masterEnabled}
          />

          {preferences.quietHours.enabled && (
            <div className="p-4 space-y-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <input
                    type="time"
                    value={preferences.quietHours.startTime}
                    onChange={(e) => updateQuietHours({ startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <input
                    type="time"
                    value={preferences.quietHours.endTime}
                    onChange={(e) => updateQuietHours({ endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleQuietHoursDay(day)}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                        preferences.quietHours.days.includes(day)
                          ? 'bg-[#9B59B6] text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      {DAY_LABELS[day]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  During quiet hours
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="quietMode"
                      checked={preferences.quietHours.mode === 'mute_all'}
                      onChange={() => updateQuietHours({ mode: 'mute_all' })}
                      className="text-[#9B59B6] focus:ring-[#9B59B6]"
                    />
                    <span className="text-sm text-gray-700">Mute all notifications</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="quietMode"
                      checked={preferences.quietHours.mode === 'mute_promotional'}
                      onChange={() => updateQuietHours({ mode: 'mute_promotional' })}
                      className="text-[#9B59B6] focus:ring-[#9B59B6]"
                    />
                    <span className="text-sm text-gray-700">Mute only promotional</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="quietMode"
                      checked={preferences.quietHours.mode === 'important_only'}
                      onChange={() => updateQuietHours({ mode: 'important_only' })}
                      className="text-[#9B59B6] focus:ring-[#9B59B6]"
                    />
                    <span className="text-sm text-gray-700">
                      Allow important only (matches, dates)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* Email Notifications */}
        <Section title="Email Notifications">
          <ToggleRow
            label="Daily Match Digest"
            description={`Daily email with new matches at ${preferences.email.dailyDigestTime}`}
            checked={preferences.email.dailyDigest}
            onChange={(checked) => updateEmailPreference('dailyDigest', checked)}
          />
          <ToggleRow
            label="Weekly Summary"
            description={`Your weekly activity report on ${preferences.email.weeklySummaryDay}`}
            checked={preferences.email.weeklySummary}
            onChange={(checked) => updateEmailPreference('weeklySummary', checked)}
          />
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <div className="font-medium text-gray-900">Activity Updates</div>
                <div className="text-sm text-gray-500">Likes, views, messages</div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={preferences.email.activityFrequency}
                  onChange={(e) =>
                    updateEmailPreference(
                      'activityFrequency',
                      e.target.value as 'realtime' | 'batched'
                    )
                  }
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9B59B6]"
                >
                  <option value="realtime">Real-time</option>
                  <option value="batched">Batched</option>
                </select>
                <Toggle
                  checked={preferences.email.activityUpdates}
                  onChange={(checked) => updateEmailPreference('activityUpdates', checked)}
                />
              </div>
            </div>
          </div>
          <ToggleRow
            label="Promotional Emails"
            description="Offers, tips, news"
            checked={preferences.email.promotional}
            onChange={(checked) => updateEmailPreference('promotional', checked)}
          />
        </Section>

        {/* SMS Notifications */}
        <Section title="SMS Notifications">
          <ToggleRow
            label="SMS Alerts"
            description="Speed date reminders, security alerts"
            checked={preferences.sms.importantAlerts}
            onChange={(checked) => updateSMSPreference('importantAlerts', checked)}
          />
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-500">Standard SMS rates may apply</p>
          </div>
        </Section>

        {/* Sounds & Vibration */}
        <Section title="Sounds & Vibration">
          <ToggleRow
            label="Notification Sound"
            description="Plays sound on notification"
            checked={preferences.sounds.enabled}
            onChange={(checked) => updateSoundsPreference('enabled', checked)}
          />
          <ToggleRow
            label="Vibration"
            description="Vibrate on notification"
            checked={preferences.sounds.vibration}
            onChange={(checked) => updateSoundsPreference('vibration', checked)}
          />
        </Section>

        {/* In-App Notifications */}
        <Section title="In-App">
          <ToggleRow
            label="In-App Banners"
            description="Shows banner when app is open"
            checked={preferences.inApp.banners}
            onChange={(checked) => updateInAppPreference('banners', checked)}
          />
          <ToggleRow
            label="Badge Count"
            description="Shows unread count on app icon"
            checked={preferences.inApp.badgeCount}
            onChange={(checked) => updateInAppPreference('badgeCount', checked)}
          />
        </Section>
      </div>

      {/* Fixed Save Button */}
      {hasChanges && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 px-4 bg-[#9B59B6] text-white rounded-lg font-semibold hover:bg-[#d62839] disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Check size={20} />
                Save Preferences
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Helper Components

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">{title}</h2>
      <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
};

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  highlight?: boolean;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled,
  highlight,
}) => {
  return (
    <div
      className={`flex items-center justify-between p-4 ${
        disabled ? 'opacity-50' : ''
      } ${highlight ? 'bg-blue-50' : ''}`}
    >
      <div className="flex-1">
        <div className={`font-medium ${highlight ? 'text-lg' : ''} text-gray-900`}>
          {label}
        </div>
        {description && <div className="text-sm text-gray-500 mt-0.5">{description}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
};

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled }) => {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:ring-offset-2 ${
        checked ? 'bg-[#9B59B6]' : 'bg-gray-300'
      } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};
