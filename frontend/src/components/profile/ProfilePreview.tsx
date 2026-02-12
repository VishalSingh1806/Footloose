import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Eye,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Utensils,
  Coffee,
  Book,
  CheckCircle,
} from 'lucide-react';
import { UserProfile } from '../../types/profile';

interface ProfilePreviewProps {
  profile: UserProfile;
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
  const navigate = useNavigate();

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
          <div className="flex items-center gap-2">
            <Eye size={20} className="text-[#1D3557]" />
            <h1 className="text-xl font-bold text-[#1D3557]">Preview</h1>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Preview Notice */}
      <div className="bg-blue-50 border-b-2 border-blue-200 px-4 py-3">
        <p className="text-xs sm:text-sm text-blue-900 text-center font-semibold">
          This is how other users see your profile
        </p>
      </div>

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
            <p className="text-gray-500">No photos</p>
          </div>
        )}

        {/* Photo indicators */}
        {profile.photos.length > 1 && (
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5">
            {profile.photos.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === 0 ? 'w-8 bg-white' : 'w-1 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Profile Info Overlay */}
        <div className="bg-gradient-to-t from-black/70 to-transparent absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {profile.name}, {profile.age}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} />
                <span className="text-base sm:text-lg">
                  {profile.city}, {profile.state}
                </span>
              </div>
              {profile.verified && (
                <div className="flex items-center gap-2 bg-green-500/90 px-3 py-1 rounded-full inline-flex">
                  <CheckCircle size={16} />
                  <span className="text-sm font-semibold">Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Info */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Briefcase size={20} className="text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Profession</p>
                <p className="text-sm font-semibold text-[#1D3557]">
                  {profile.profession || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap size={20} className="text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Education</p>
                <p className="text-sm font-semibold text-[#1D3557]">
                  {profile.education || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Heart size={20} className="text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Religion</p>
                <p className="text-sm font-semibold text-[#1D3557]">
                  {profile.religion || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Home size={20} className="text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Height</p>
                <p className="text-sm font-semibold text-[#1D3557]">
                  {profile.height || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        {profile.bio && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
            <h2 className="text-lg sm:text-xl font-bold text-[#1D3557] mb-3">About Me</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Personal Details */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg sm:text-xl font-bold text-[#1D3557] mb-4">Personal Details</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Marital Status</span>
              <span className="text-sm font-semibold text-[#1D3557]">
                {profile.maritalStatus || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Mother Tongue</span>
              <span className="text-sm font-semibold text-[#1D3557]">
                {profile.motherTongue || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Caste</span>
              <span className="text-sm font-semibold text-[#1D3557]">
                {profile.caste || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Annual Income</span>
              <span className="text-sm font-semibold text-[#1D3557]">
                {profile.income || 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        {/* Family Details */}
        {(profile.fatherOccupation || profile.motherOccupation || profile.siblings) && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
            <h2 className="text-lg sm:text-xl font-bold text-[#1D3557] mb-4">Family Details</h2>
            <div className="space-y-3">
              {profile.fatherOccupation && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Father's Occupation</span>
                  <span className="text-sm font-semibold text-[#1D3557]">
                    {profile.fatherOccupation}
                  </span>
                </div>
              )}
              {profile.motherOccupation && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Mother's Occupation</span>
                  <span className="text-sm font-semibold text-[#1D3557]">
                    {profile.motherOccupation}
                  </span>
                </div>
              )}
              {profile.siblings && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Siblings</span>
                  <span className="text-sm font-semibold text-[#1D3557]">
                    {profile.siblings}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lifestyle */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg sm:text-xl font-bold text-[#1D3557] mb-4">Lifestyle</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Utensils size={16} className="text-gray-600" />
                <span className="text-sm text-gray-600">Diet</span>
              </div>
              <span className="text-sm font-semibold text-[#1D3557]">
                {profile.diet || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Coffee size={16} className="text-gray-600" />
                <span className="text-sm text-gray-600">Drinking</span>
              </div>
              <span className="text-sm font-semibold text-[#1D3557]">
                {profile.drinking || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Coffee size={16} className="text-gray-600" />
                <span className="text-sm text-gray-600">Smoking</span>
              </div>
              <span className="text-sm font-semibold text-[#1D3557]">
                {profile.smoking || 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        {/* Interests & Hobbies */}
        {profile.hobbies && profile.hobbies.length > 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
            <h2 className="text-lg sm:text-xl font-bold text-[#1D3557] mb-4">
              Interests & Hobbies
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map((hobby, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full"
                >
                  <Book size={14} className="text-gray-600" />
                  <span className="text-sm text-gray-700">{hobby}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust Score */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1D3557] mb-1">Trust Score</h3>
              <p className="text-xs sm:text-sm text-gray-600">Verified & Trusted Profile</p>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-green-600">
              {profile.trustScore}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
