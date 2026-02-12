import React, { useState, useEffect } from 'react';
import { PrivacySettings } from './PrivacySettings';
import { getUserProfile } from '../../services/profileService';
import { PrivacySettings as PrivacySettingsType } from '../../types/profile';

export function PrivacySettingsPage() {
  const [settings, setSettings] = useState<PrivacySettingsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const profile = await getUserProfile();
      setSettings(profile.privacySettings);
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (newSettings: PrivacySettingsType) => {
    // In real app, this would call an API to save settings
    setSettings(newSettings);
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E63946] border-t-transparent" />
      </div>
    );
  }

  return <PrivacySettings settings={settings} onUpdate={handleUpdate} />;
}
