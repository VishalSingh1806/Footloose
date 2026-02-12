import React, { useState, useEffect } from 'react';
import { VerificationCenter } from './VerificationCenter';
import { getUserProfile } from '../../services/profileService';
import { VerificationInfo } from '../../types/profile';

export function VerificationCenterPage() {
  const [verification, setVerification] = useState<VerificationInfo | null>(null);
  const [trustScore, setTrustScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerification();
  }, []);

  const loadVerification = async () => {
    try {
      const profile = await getUserProfile();
      setVerification(profile.verification);
      setTrustScore(profile.trustScore);
    } catch (error) {
      console.error('Error loading verification:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !verification) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E63946] border-t-transparent" />
      </div>
    );
  }

  return (
    <VerificationCenter
      verification={verification}
      trustScore={trustScore}
      onUpdate={loadVerification}
    />
  );
}
