import React, { useState, useEffect } from 'react';
import { PartnerPreferencesEditor } from './PartnerPreferencesEditor';
import { getUserProfile } from '../../services/profileService';
import { PartnerPreferences } from '../../types/profile';

export function PartnerPreferencesEditorPage() {
  const [preferences, setPreferences] = useState<PartnerPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const profile = await getUserProfile();
      setPreferences(profile.partnerPreferences);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (newPreferences: PartnerPreferences) => {
    // In real app, this would call an API to save preferences
    setPreferences(newPreferences);
  };

  if (loading || !preferences) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E63946] border-t-transparent" />
      </div>
    );
  }

  return <PartnerPreferencesEditor preferences={preferences} onUpdate={handleUpdate} />;
}
