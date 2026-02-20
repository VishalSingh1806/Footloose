import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { UserProfile } from '../../types/profile';
import { getUserProfile, updateProfile } from '../../services/profileService';

export function EditProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section');

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await getUserProfile();
    setProfile(data);
    setFormData(data);
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      navigate(-1);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('Discard unsaved changes?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9B59B6] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-[#1D3557]" />
          </button>
          <h1 className="text-xl font-bold text-[#1D3557]">
            {section ? `Edit ${section}` : 'Edit Profile'}
          </h1>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[#9B59B6]"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Bio Section */}
        {(!section || section === 'bio') && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-bold text-[#1D3557] mb-4">About Me</h2>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell others about yourself..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
              rows={6}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-2">
              {(formData.bio || '').length}/500 characters
            </p>
          </div>
        )}

        {/* Personal Info */}
        {(!section || section === 'personal') && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-bold text-[#1D3557] mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Height
                </label>
                <input
                  type="text"
                  value={formData.height || ''}
                  onChange={(e) => handleChange('height', e.target.value)}
                  placeholder="e.g., 5'8&quot;"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Weight (optional)
                </label>
                <input
                  type="text"
                  value={formData.weight || ''}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  placeholder="e.g., 75 kg"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Education */}
        {(!section || section === 'education') && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-bold text-[#1D3557] mb-4">Education & Career</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Education
                </label>
                <input
                  type="text"
                  value={formData.education || ''}
                  onChange={(e) => handleChange('education', e.target.value)}
                  placeholder="e.g., B.Tech"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Profession
                </label>
                <input
                  type="text"
                  value={formData.profession || ''}
                  onChange={(e) => handleChange('profession', e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Employer
                </label>
                <input
                  type="text"
                  value={formData.employer || ''}
                  onChange={(e) => handleChange('employer', e.target.value)}
                  placeholder="e.g., Tech Corp"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button (mobile sticky) */}
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:hidden">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="w-full bg-[#9B59B6] text-white py-3 rounded-xl font-bold hover:bg-[#D62839] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
