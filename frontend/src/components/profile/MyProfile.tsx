import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  MoreVertical,
  Edit2,
  Heart,
  Eye,
  TrendingUp,
  Image,
  Shield,
  Lock,
  Share2,
  Pause,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { UserProfile, ProfileCompleteness as ProfileCompletenessType } from '../../types/profile';
import {
  getUserProfile,
  calculateProfileCompleteness,
  toggleProfileVisibility,
} from '../../services/profileService';
import { ProfileCompleteness } from './ProfileCompleteness';
import { ProfileStrengthScore } from './ProfileStrengthScore';
import { ProfileVisibilityToggle } from './ProfileVisibilityToggle';

export function MyProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completeness, setCompleteness] = useState<ProfileCompletenessType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [profileData, completenessData] = await Promise.all([
        getUserProfile(),
        calculateProfileCompleteness(),
      ]);
      setProfile(profileData);
      setCompleteness(completenessData);

      // Check if banner was dismissed
      const dismissed = localStorage.getItem('profileCompletenessBannerDismissed');
      if (dismissed) {
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (active: boolean) => {
    if (!profile) return;
    const updated = await toggleProfileVisibility(active);
    setProfile(updated);
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('profileCompletenessBannerDismissed', 'true');
  };

  if (loading || !profile || !completeness) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9B59B6] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Completeness Banner */}
      {showBanner && completeness.overall < 100 && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <ProfileCompleteness
            data={completeness}
            showBanner
            onDismissBanner={handleDismissBanner}
            onCompleteSection={() => navigate('/profile/edit')}
          />
        </div>
      )}

      {/* Photo Section */}
      <div className="relative">
        {/* Photo Carousel */}
        <div className="relative h-96 sm:h-[500px] bg-gray-200">
          {profile.photos.length > 0 ? (
            <img
              src={profile.photos[0].url}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Image size={48} className="mx-auto mb-2" />
                <p>No photos yet</p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold text-white ${
                profile.visibility === 'active'
                  ? 'bg-green-500'
                  : profile.visibility === 'paused'
                  ? 'bg-orange-500'
                  : 'bg-yellow-500'
              }`}
            >
              {profile.visibility === 'active'
                ? 'Active'
                : profile.visibility === 'paused'
                ? 'Paused'
                : 'Under Review'}
            </span>
          </div>

          {/* Edit Photos Button */}
          <button
            onClick={() => navigate('/profile/photos')}
            className="absolute bottom-4 right-4 bg-white text-[#1D3557] px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Edit2 size={18} />
            <span>Edit Photos</span>
          </button>
        </div>

        {/* Profile Info Overlay */}
        <div className="bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {profile.name}, {profile.age}
              </h1>
              <p className="text-base sm:text-lg mb-2">
                {profile.city}, {profile.state}
              </p>
              {profile.verified && (
                <div className="flex items-center gap-2 bg-green-500/90 px-3 py-1 rounded-full inline-flex">
                  <CheckCircle size={16} />
                  <span className="text-sm font-semibold">Verified</span>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Edit2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/profile/analytics')}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Heart size={24} className="text-[#9B59B6] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#1D3557]">24</p>
            <p className="text-xs text-gray-600">Likes</p>
          </button>

          <button
            onClick={() => navigate('/profile/analytics')}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Eye size={24} className="text-[#2A9D8F] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#1D3557]">1.2K</p>
            <p className="text-xs text-gray-600">Views</p>
          </button>

          <button
            onClick={() => navigate('/profile/analytics')}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <TrendingUp size={24} className="text-[#8E44AD] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#1D3557]">68%</p>
            <p className="text-xs text-gray-600">Match</p>
          </button>
        </div>

        {/* Profile Strength */}
        <ProfileStrengthScore
          score={profile.trustScore}
          photoCount={profile.photos.length}
          bioLength={profile.bio.length}
          preferencesComplete={completeness.breakdown.partnerPreferences === 10}
          verified={profile.verified}
          onImprove={() => navigate('/profile/edit')}
        />

        {/* Completeness */}
        {completeness.overall < 100 && (
          <ProfileCompleteness
            data={completeness}
            onCompleteSection={() => navigate('/profile/edit')}
          />
        )}

        {/* About Me */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#1D3557]">About Me</h2>
            <button
              onClick={() => navigate('/profile/edit?section=bio')}
              className="text-[#9B59B6] hover:text-[#D62839] transition-colors"
            >
              <Edit2 size={20} />
            </button>
          </div>
          {profile.bio ? (
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {profile.bio}
            </p>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Add a bio to tell others about yourself</p>
              <button
                onClick={() => navigate('/profile/edit?section=bio')}
                className="bg-[#9B59B6] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#D62839] transition-colors"
              >
                Add Bio
              </button>
            </div>
          )}
        </div>

        {/* Profile Sections */}
        {[
          { title: 'Personal Information', icon: '👤', section: 'personal' },
          { title: 'Religious Background', icon: '🕉️', section: 'religious' },
          { title: 'Family Details', icon: '👨‍👩‍👧', section: 'family' },
          { title: 'Education & Career', icon: '🎓', section: 'education' },
          { title: 'Lifestyle & Interests', icon: '🏃', section: 'lifestyle' },
          { title: 'Partner Preferences', icon: '💑', section: 'preferences' },
        ].map(({ title, icon, section }) => (
          <button
            key={section}
            onClick={() => navigate(`/profile/edit?section=${section}`)}
            className="w-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <h3 className="text-base sm:text-lg font-bold text-[#1D3557]">{title}</h3>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        ))}

        {/* Verification */}
        <button
          onClick={() => navigate('/profile/verification')}
          className="w-full bg-gradient-to-br from-green-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow border-2 border-green-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-green-600" />
              <div className="text-left">
                <h3 className="text-base sm:text-lg font-bold text-[#1D3557] mb-1">
                  Verification & Trust
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Trust Score: {profile.trustScore}/100
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </button>

        {/* Privacy */}
        <button
          onClick={() => navigate('/profile/privacy')}
          className="w-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Lock size={24} className="text-gray-600" />
            <h3 className="text-base sm:text-lg font-bold text-[#1D3557]">Privacy Settings</h3>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>

        {/* Profile Visibility Toggle */}
        <ProfileVisibilityToggle
          isActive={profile.visibility === 'active'}
          onToggle={handleToggleVisibility}
        />

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => {/* Share profile */}}
            className="w-full bg-white text-[#1D3557] py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all border border-gray-200 flex items-center justify-center gap-2"
          >
            <Share2 size={20} />
            <span>Share Profile</span>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="w-full text-gray-600 py-3 text-sm font-semibold hover:text-gray-800 transition-colors"
          >
            Account Settings
          </button>
        </div>
      </div>
    </div>
  );
}
