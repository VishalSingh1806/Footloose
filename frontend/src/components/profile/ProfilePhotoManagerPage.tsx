import React, { useState, useEffect } from 'react';
import { ProfilePhotoManager } from './ProfilePhotoManager';
import { getUserProfile } from '../../services/profileService';
import { ProfilePhoto } from '../../types/profile';

export function ProfilePhotoManagerPage() {
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const profile = await getUserProfile();
      setPhotos(profile.photos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9B59B6] border-t-transparent" />
      </div>
    );
  }

  return <ProfilePhotoManager photos={photos} onUpdate={loadPhotos} />;
}
