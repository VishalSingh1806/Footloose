/**
 * Accessibility Settings Component
 * Text size, high contrast, reduced motion, color blind modes
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Eye } from 'lucide-react';
import {
  getAccessibilitySettings,
  updateAccessibilitySettings,
} from '../../services/settingsService';
import type { AccessibilitySettings } from '../../types/settings';

const COLOR_BLIND_OPTIONS = [
  { value: 'none', label: 'None', description: 'Standard colors' },
  { value: 'protanopia', label: 'Protanopia', description: 'Red-blind' },
  { value: 'deuteranopia', label: 'Deuteranopia', description: 'Green-blind' },
  { value: 'tritanopia', label: 'Tritanopia', description: 'Blue-blind' },
];

const TAP_TARGET_OPTIONS = [
  { value: 'default', label: 'Default', description: '44x44 pixels' },
  { value: 'large', label: 'Large', description: '56x56 pixels' },
  { value: 'extra_large', label: 'Extra Large', description: '68x68 pixels' },
];

export default function AccessibilitySettingsComponent() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AccessibilitySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getAccessibilitySettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);
      await updateAccessibilitySettings(settings);
      setHasChanges(false);
      alert('Accessibility settings saved!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (updates: Partial<AccessibilitySettings>) => {
    if (!settings) return;
    setSettings({ ...settings, ...updates });
    setHasChanges(true);
  };

  if (isLoading || !settings) {
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
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-2">Accessibility</h1>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-[#d62839] disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Accessibility Info */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Eye size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Accessibility Options</h2>
          </div>
          <p className="text-sm text-white text-opacity-90">
            Customize the app to make it more comfortable and accessible for your needs.
          </p>
        </div>

        {/* Text Size */}
        <Section title="Text Size">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700">Aa</span>
              <span className="text-2xl text-gray-900">Aa</span>
              <span className="text-4xl text-gray-900">Aa</span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              step="1"
              value={settings.textSize}
              onChange={(e) => updateSetting({ textSize: parseInt(e.target.value) })}
              className="w-full accent-[#E63946]"
            />
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span>Small (12px)</span>
              <span className="font-semibold text-[#E63946]">
                Current: {settings.textSize}px
              </span>
              <span>Large (24px)</span>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p style={{ fontSize: `${settings.textSize}px` }} className="text-gray-900">
                This is a preview of the text size you selected.
              </p>
            </div>
          </div>
        </Section>

        {/* Visual Settings */}
        <Section title="Visual Settings">
          <ToggleRow
            label="High Contrast"
            description="Increase contrast for better visibility"
            checked={settings.highContrast}
            onChange={(checked) => updateSetting({ highContrast: checked })}
          />
          <ToggleRow
            label="Reduced Motion"
            description="Minimize animations and transitions"
            checked={settings.reducedMotion}
            onChange={(checked) => updateSetting({ reducedMotion: checked })}
          />
          <ToggleRow
            label="Focus Indicators"
            description="Show outlines around focused elements"
            checked={settings.focusIndicators}
            onChange={(checked) => updateSetting({ focusIndicators: checked })}
          />
        </Section>

        {/* Color Blind Mode */}
        <Section title="Color Blind Mode">
          <div className="p-4 space-y-2">
            {COLOR_BLIND_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="colorBlindMode"
                  checked={settings.colorBlindMode === option.value}
                  onChange={() => updateSetting({ colorBlindMode: option.value as any })}
                  className="w-5 h-5 text-[#E63946] focus:ring-[#E63946]"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
                {settings.colorBlindMode === option.value && (
                  <Check size={20} className="text-[#E63946]" />
                )}
              </label>
            ))}
          </div>
        </Section>

        {/* Interaction Settings */}
        <Section title="Interaction Settings">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tap/Click Timeout
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={settings.tapTimeout}
                onChange={(e) => updateSetting({ tapTimeout: parseFloat(e.target.value) })}
                className="w-full accent-[#E63946]"
              />
              <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                <span>0.1s</span>
                <span className="font-semibold text-[#E63946]">
                  {settings.tapTimeout.toFixed(1)}s
                </span>
                <span>2.0s</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Tap Target Size */}
        <Section title="Button & Tap Target Size">
          <div className="p-4 space-y-2">
            {TAP_TARGET_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="tapTargetSize"
                  checked={settings.tapTargetSize === option.value}
                  onChange={() => updateSetting({ tapTargetSize: option.value as any })}
                  className="w-5 h-5 text-[#E63946] focus:ring-[#E63946]"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
                {settings.tapTargetSize === option.value && (
                  <Check size={20} className="text-[#E63946]" />
                )}
              </label>
            ))}
          </div>
        </Section>

        {/* Feedback Settings */}
        <Section title="Feedback">
          <ToggleRow
            label="Sound Effects"
            description="Audio feedback for actions"
            checked={settings.soundEffects}
            onChange={(checked) => updateSetting({ soundEffects: checked })}
          />
          <ToggleRow
            label="Vibration Feedback"
            description="Haptic feedback for interactions"
            checked={settings.vibrationFeedback}
            onChange={(checked) => updateSetting({ vibrationFeedback: checked })}
          />
        </Section>

        {/* Screen Reader Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Screen Reader Support</h3>
          <p className="text-sm text-gray-600 mb-2">
            This app is compatible with screen readers including TalkBack (Android) and VoiceOver
            (iOS).
          </p>
          <p className="text-sm text-gray-600">
            All interactive elements have descriptive labels and proper focus management.
          </p>
        </div>

        {/* Reset to Defaults */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <button
            onClick={() => {
              if (
                window.confirm('Reset all accessibility settings to defaults?')
              ) {
                setSettings({
                  textSize: 16,
                  highContrast: false,
                  reducedMotion: false,
                  colorBlindMode: 'none',
                  tapTimeout: 0.3,
                  tapTargetSize: 'default',
                  soundEffects: true,
                  vibrationFeedback: true,
                  focusIndicators: false,
                });
                setHasChanges(true);
              }
            }}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Fixed Save Button */}
      {hasChanges && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 px-4 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-[#d62839] disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Check size={20} />
                Save Settings
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
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled,
}) => {
  return (
    <div className={`flex items-center justify-between p-4 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-offset-2 ${
        checked ? 'bg-[#E63946]' : 'bg-gray-300'
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
