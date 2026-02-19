import { useState } from 'react';
import { ChevronLeft, MapPin, Heart, ChevronDown, ChevronUp, Edit2, Lock } from 'lucide-react';

interface RegistrationScreen23Props {
  onNext: () => void;
  onBack: () => void;
  profileData: {
    firstName?: string;
    lastName?: string;
    name?: string; // Legacy support
    age?: number;
    city?: string;
    state?: string;
    heightFeet?: number;
    heightInches?: number;
    religion?: string;
    role?: string;
    income?: string;
    photos?: string[];
    lifestylePhotos?: string[];
    gender?: string;
    familyBackground?: string;
    parentsOutlook?: string;
    whereYouLive?: string;
    partnerPriorities?: string[];
    relationshipIntent?: string;
    childrenPreference?: string;
  };
}

function RegistrationScreen23({ onNext, onBack, profileData }: RegistrationScreen23Props) {
  const [showModal, setShowModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    family: false,
    lookingFor: false,
  });
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const allPhotos = [
    ...(profileData.photos || []),
    ...(profileData.lifestylePhotos || []),
  ];

  const toggleSection = (section: 'family' | 'lookingFor') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = () => {
    setShowModal(true);
  };

  const confirmSubmit = () => {
    setShowModal(false);
    onNext();
  };

  // Get full name
  const getFullName = () => {
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName} ${profileData.lastName}`;
    }
    return profileData.name || 'User';
  };

  // Auto-generated about text based on profile data
  const generateAboutText = () => {
    const profession = profileData.role || 'professional';
    const city = profileData.city || 'the city';
    const firstName = profileData.firstName || 'I';
    return `${firstName === 'I' ? "I'm" : `${firstName} is`} a ${profession} living in ${city} who values family and meaningful connections. I enjoy a balanced lifestyle with time for fitness and friends. Looking for a serious relationship with someone who shares similar values and life goals.`;
  };

  // Generate lifestyle tags based on responses
  const lifestyleTags = [
    'Family-oriented',
    'Fitness enthusiast',
    'Ambitious',
    'Values experiences',
    'Career-focused',
    'Social',
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="px-5 pt-4 pb-3 relative">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-[#FAFAFA] rounded-lg transition-colors absolute left-3 top-3"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-[#1D3557]" />
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">
              Review
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] transition-all duration-500 ease-out"
            style={{ width: '97%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-6 pb-32 max-w-[600px] w-full mx-auto">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-2">
          Review your profile
        </h1>
        <p className="text-sm text-[#6C757D] mb-2">
          This is how your profile will appear after approval.
        </p>

        {/* Review Notice */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-[#1E40AF]">
            Your profile will be reviewed before becoming visible to others.
          </p>
        </div>

        {/* Profile Preview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden mb-6">

          {/* Header Section */}
          <div className="p-6 text-center border-b border-[#E5E7EB]">
            <div className="relative inline-block mb-4">
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-[#E5E7EB] border-4 border-white shadow-md">
                {allPhotos[0] ? (
                  <img
                    src={allPhotos[0]}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6C757D]">
                    No Photo
                  </div>
                )}
              </div>
              {/* Verification Badge */}
              <div className="absolute -top-1 -right-1 w-9 h-9 bg-[#2A9D8F] rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Name & Age */}
            <h2 className="text-xl font-semibold text-[#1D3557] mb-1">
              {getFullName()}, {profileData.age || '28'}
            </h2>

            {/* Location */}
            <div className="flex items-center justify-center gap-1 text-sm text-[#6C757D]">
              <MapPin className="w-4 h-4" />
              <span>{profileData.city || 'Mumbai'}, {profileData.state || 'Maharashtra'}</span>
            </div>

          </div>

          {/* Quick Info Pills */}
          <div className="p-4 border-b border-[#E5E7EB]">
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="px-3 py-1.5 bg-[#F3F4F6] rounded-full text-sm text-[#1D3557]">
                {profileData.heightFeet || 5}'{profileData.heightInches || 8}"
              </div>
              <div className="px-3 py-1.5 bg-[#F3F4F6] rounded-full text-sm text-[#1D3557]">
                {profileData.religion || 'Hindu'}
              </div>
              <div className="px-3 py-1.5 bg-[#F3F4F6] rounded-full text-sm text-[#1D3557]">
                {profileData.role || 'Software Engineer'}
              </div>
              <div className="px-3 py-1.5 bg-[#F3F4F6] rounded-full text-sm text-[#1D3557]">
                {profileData.income || '₹1L - ₹1.5L'}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="p-6 border-b border-[#E5E7EB]">
            <h3 className="text-base font-semibold text-[#1D3557] mb-3">About Me</h3>
            <p className="text-[15px] text-[#6C757D] leading-[1.6]">
              {generateAboutText()}
            </p>
          </div>

          {/* Lifestyle Tags */}
          <div className="p-6 border-b border-[#E5E7EB]">
            <h3 className="text-base font-semibold text-[#1D3557] mb-3">Lifestyle</h3>
            <div className="flex flex-wrap gap-2">
              {lifestyleTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-[#DBEAFE] text-[#1D4ED8] rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Family Background (Expandable) */}
          <div className="border-b border-[#E5E7EB]">
            <button
              onClick={() => toggleSection('family')}
              className="w-full p-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
            >
              <h3 className="text-base font-semibold text-[#1D3557]">Family Background</h3>
              {expandedSections.family ? (
                <ChevronUp className="w-5 h-5 text-[#6C757D]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#6C757D]" />
              )}
            </button>
            {expandedSections.family && (
              <div className="px-6 pb-6 space-y-3">
                <div>
                  <p className="text-sm font-medium text-[#1D3557] mb-1">Family Status</p>
                  <p className="text-sm text-[#6C757D]">{profileData.familyBackground || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1D3557] mb-1">Parents' Outlook</p>
                  <p className="text-sm text-[#6C757D]">{profileData.parentsOutlook || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1D3557] mb-1">Living Situation</p>
                  <p className="text-sm text-[#6C757D]">{profileData.whereYouLive || 'Not specified'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Looking For (Expandable) */}
          <div className="border-b border-[#E5E7EB]">
            <button
              onClick={() => toggleSection('lookingFor')}
              className="w-full p-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
            >
              <h3 className="text-base font-semibold text-[#1D3557]">What I'm Looking For</h3>
              {expandedSections.lookingFor ? (
                <ChevronUp className="w-5 h-5 text-[#6C757D]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#6C757D]" />
              )}
            </button>
            {expandedSections.lookingFor && (
              <div className="px-6 pb-6 space-y-3">
                <div>
                  <p className="text-sm font-medium text-[#1D3557] mb-2">Top Priorities</p>
                  <div className="flex flex-wrap gap-2">
                    {(profileData.partnerPriorities || ['Shared values', 'Good communication', 'Family-oriented']).map((priority, index) => (
                      <span key={index} className="px-3 py-1 bg-[#F3F4F6] rounded-full text-xs text-[#1D3557]">
                        {priority}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1D3557] mb-1">Relationship Intent</p>
                  <p className="text-sm text-[#6C757D]">{profileData.relationshipIntent || 'Serious relationship'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1D3557] mb-1">Thoughts on Children</p>
                  <p className="text-sm text-[#6C757D]">{profileData.childrenPreference || 'Not specified'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Photos Gallery */}
          {allPhotos.length > 0 && (
            <div className="p-6">
              <h3 className="text-base font-semibold text-[#1D3557] mb-3">Photos ({allPhotos.length})</h3>
              <div className="grid grid-cols-3 gap-2">
                {allPhotos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(photo)}
                    className="aspect-square rounded-lg overflow-hidden bg-[#E5E7EB] hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Non-editable Fields Info */}
        <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-4 mb-6 flex gap-3">
          <Lock className="w-5 h-5 text-[#92400E] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#92400E] leading-relaxed">
            Some fields like name, mobile number, and date of birth cannot be changed after approval. Contact support if you need to update these.
          </p>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-5 border-t border-[#E5E7EB] shadow-lg">
        <div className="max-w-[600px] mx-auto space-y-3">
          <button
            onClick={handleSubmit}
            className="w-full h-[52px] rounded-xl font-semibold text-base bg-[#E63946] hover:bg-[#D62828] text-white active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)] transition-all"
          >
            Submit for Review
          </button>
          <button
            onClick={onBack}
            className="w-full h-[44px] rounded-xl font-medium text-base bg-white border-2 border-[#E5E7EB] text-[#1D3557] hover:bg-[#FAFAFA] transition-all"
          >
            Go Back & Edit
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-5">
          <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full shadow-2xl">
            <h3 className="text-xl font-semibold text-[#1D3557] mb-3">
              Submit profile for review?
            </h3>
            <p className="text-sm text-[#6C757D] mb-6">
              You will be notified once approved.
            </p>
            <div className="space-y-3">
              <button
                onClick={confirmSubmit}
                className="w-full h-[48px] rounded-xl font-semibold text-base bg-[#E63946] hover:bg-[#D62828] text-white transition-all"
              >
                Yes, Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full text-sm text-[#6C757D] hover:text-[#1D3557] transition-colors"
              >
                Review Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-5"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-[500px] w-full">
            <img
              src={selectedPhoto}
              alt="Full size"
              className="w-full rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrationScreen23;
