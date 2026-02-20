import React, { useState, useEffect } from 'react';
import { ProfilePreview } from './ProfilePreview';
import { getUserProfile } from '../../services/profileService';
import { UserProfile } from '../../types/profile';

export function ProfilePreviewPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9B59B6] border-t-transparent" />
      </div>
    );
  }

  return <ProfilePreview profile={profile} />;
}
