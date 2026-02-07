import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  ChevronDown,
  ChevronUp,
  Check,
  Crown,
  Camera,
} from 'lucide-react';
import { Match } from '../../services/matchService';
import ActionButtons from './ActionButtons';
import PhotoGallery from './PhotoGallery';
import CompatibilityBadge from './CompatibilityBadge';

interface MatchCardProps {
  match: Match;
  onDontShow: () => void;
  onShortlist: () => void;
  onSpeedDate: () => void;
  onSendInterest: () => void;
  onCardClick?: () => void;
}

type ExpandedSection =
  | 'personal'
  | 'family'
  | 'education'
  | 'lifestyle'
  | 'preferences'
  | null;

function MatchCard({
  match,
  onDontShow,
  onShortlist,
  onSpeedDate,
  onSendInterest,
  onCardClick,
}: MatchCardProps) {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const toggleSection = (section: ExpandedSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handlePhotoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPhotoGallery(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons or expandable sections
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('.expandable-section') ||
      target.closest('.photo-section')
    ) {
      return;
    }
    // Navigate to full profile
    navigate(`/match/${match.id}`);
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 mx-4
                   hover:shadow-xl transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Photo Section */}
        <div
          className="relative h-96 bg-gray-200 photo-section"
          onClick={handlePhotoClick}
        >
          <img
            src={match.photos[currentPhotoIndex]}
            alt={match.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Top-left badges */}
          <div className="absolute top-0 left-0 flex flex-col gap-2">
            {match.isNewlyJoined && (
              <div className="bg-[#E63946] text-white text-xs font-bold px-3 py-1.5 rounded-br-xl">
                NEWLY JOINED
              </div>
            )}
            {match.premium && (
              <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-br-xl flex items-center gap-1">
                <Crown size={12} fill="white" />
                <span>PREMIUM</span>
              </div>
            )}
          </div>

          {/* Top-right badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            {match.compatibility >= 85 && (
              <div className="bg-white/95 backdrop-blur-sm border-2 border-[#E63946] text-[#E63946] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                👍 MOST COMPATIBLE
              </div>
            )}
            {match.verified && (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={18} className="text-white" strokeWidth={3} />
              </div>
            )}
            {match.photos.length > 1 && (
              <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                <Camera size={14} />
                <span className="text-xs font-semibold">{match.photos.length}</span>
              </div>
            )}
          </div>

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

          {/* User ID, Age, Active Status */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl font-bold mb-1 drop-shadow-lg">
              {match.userId}, {match.age}
            </h2>
            <p className="text-sm opacity-90">{match.lastActive}</p>
          </div>

          {/* Photo indicators */}
          {match.photos.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
              {match.photos.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPhotoIndex(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentPhotoIndex ? 'bg-white w-4' : 'bg-white/60'
                  }`}
                  aria-label={`View photo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Info Section */}
        <div className="p-4 space-y-3">
          {/* Name */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[#1D3557]">{match.name}</h3>
          </div>

          {/* Physical attributes */}
          <div className="flex items-center gap-4 text-sm text-[#1D3557]">
            <span>{match.height}</span>
            <span>•</span>
            <span>{match.weight}</span>
            <span>•</span>
            <span>{match.complexion} complexion</span>
          </div>

          {/* Religion/Community */}
          <div className="text-sm text-[#1D3557]">
            {match.religion} • {match.community}
          </div>

          {/* Professional */}
          <div className="flex items-center gap-2 text-sm text-[#1D3557]">
            <GraduationCap size={16} className="text-[#6C757D]" />
            <span>{match.education} • {match.occupation}</span>
          </div>

          {/* Income + Location */}
          <div className="flex items-center gap-4 text-sm text-[#1D3557]">
            <div className="flex items-center gap-1">
              <Briefcase size={16} className="text-[#6C757D]" />
              <span>{match.annualIncome}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} className="text-[#6C757D]" />
              <span>{match.country}</span>
            </div>
          </div>

          {/* Compatibility Score */}
          <div className="pt-2">
            <CompatibilityBadge score={match.compatibility} />
          </div>

          {/* Profile managed by */}
          {match.profileManagedBy && (
            <p className="text-xs italic text-[#9CA3AF]">
              Profile managed by {match.profileManagedBy}
            </p>
          )}
        </div>

        {/* Expandable Sections */}
        <div className="border-t border-gray-200 expandable-section">
          {/* Personal Information */}
          <button
            onClick={() => toggleSection('personal')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-[#1D3557]">Personal Information</span>
            {expandedSection === 'personal' ? (
              <ChevronUp size={20} className="text-[#6C757D]" />
            ) : (
              <ChevronDown size={20} className="text-[#6C757D]" />
            )}
          </button>
          {expandedSection === 'personal' && (
            <div className="px-4 pb-4 bg-[#FFF5F5] space-y-2 text-sm">
              <InfoRow label="Marital Status" value={match.maritalStatus} />
              <InfoRow label="Age" value={`${match.age} years`} />
              <InfoRow label="Height" value={match.height} />
              <InfoRow label="Weight" value={match.weight} />
              <InfoRow label="Mother Tongue" value={match.motherTongue} />
              <InfoRow label="Physically Challenged" value={match.physicallyChallenged ? 'Yes' : 'No'} />
            </div>
          )}

          {/* Family Details */}
          <button
            onClick={() => toggleSection('family')}
            className="w-full px-4 py-3 flex items-center justify-between border-t border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-[#1D3557]">Family Details</span>
            {expandedSection === 'family' ? (
              <ChevronUp size={20} className="text-[#6C757D]" />
            ) : (
              <ChevronDown size={20} className="text-[#6C757D]" />
            )}
          </button>
          {expandedSection === 'family' && (
            <div className="px-4 pb-4 bg-[#FFF5F5] space-y-2 text-sm">
              <InfoRow label="Family Status" value={match.familyStatus} />
              <InfoRow label="Family Type" value={match.familyType} />
              <InfoRow label="Father" value={match.fatherOccupation} />
              <InfoRow label="Mother" value={match.motherOccupation} />
              <InfoRow label="Siblings" value={match.siblings} />
              <InfoRow label="Family Location" value={match.familyLocation} />
            </div>
          )}

          {/* Education & Career */}
          <button
            onClick={() => toggleSection('education')}
            className="w-full px-4 py-3 flex items-center justify-between border-t border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-[#1D3557]">Education & Career</span>
            {expandedSection === 'education' ? (
              <ChevronUp size={20} className="text-[#6C757D]" />
            ) : (
              <ChevronDown size={20} className="text-[#6C757D]" />
            )}
          </button>
          {expandedSection === 'education' && (
            <div className="px-4 pb-4 bg-[#FFF5F5] space-y-2 text-sm">
              <InfoRow label="Highest Qualification" value={match.education} />
              {match.educationDetail && <InfoRow label="College/University" value={match.educationDetail} />}
              <InfoRow label="Working As" value={match.occupation} />
              {match.occupationDetail && <InfoRow label="Organization" value={match.occupationDetail} />}
              <InfoRow label="Annual Income" value={match.annualIncome} />
            </div>
          )}

          {/* Lifestyle & Interests */}
          <button
            onClick={() => toggleSection('lifestyle')}
            className="w-full px-4 py-3 flex items-center justify-between border-t border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-[#1D3557]">Lifestyle & Interests</span>
            {expandedSection === 'lifestyle' ? (
              <ChevronUp size={20} className="text-[#6C757D]" />
            ) : (
              <ChevronDown size={20} className="text-[#6C757D]" />
            )}
          </button>
          {expandedSection === 'lifestyle' && (
            <div className="px-4 pb-4 bg-[#FFF5F5] space-y-2 text-sm">
              <InfoRow label="Eating Habits" value={match.eatingHabits} />
              <InfoRow label="Drinking" value={match.drinking} />
              <InfoRow label="Smoking" value={match.smoking} />
              <InfoRow label="Hobbies" value={match.hobbies.join(', ')} />
              <InfoRow label="Languages" value={match.languages.join(', ')} />
            </div>
          )}

          {/* Partner Preferences */}
          <button
            onClick={() => toggleSection('preferences')}
            className="w-full px-4 py-3 flex items-center justify-between border-t border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-[#1D3557]">Partner Preferences</span>
            {expandedSection === 'preferences' ? (
              <ChevronUp size={20} className="text-[#6C757D]" />
            ) : (
              <ChevronDown size={20} className="text-[#6C757D]" />
            )}
          </button>
          {expandedSection === 'preferences' && (
            <div className="px-4 pb-4 bg-[#FFF5F5] space-y-2 text-sm">
              <InfoRow label="Age" value={match.partnerPreferences.ageRange} />
              <InfoRow label="Height" value={match.partnerPreferences.heightRange} />
              <InfoRow label="Marital Status" value={match.partnerPreferences.maritalStatus.join(', ')} />
              <InfoRow label="Education" value={match.partnerPreferences.education.join(', ')} />
              <InfoRow label="Location" value={match.partnerPreferences.location.join(', ')} />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <ActionButtons
          matchId={match.id}
          matchName={match.name}
          onDontShow={onDontShow}
          onShortlist={onShortlist}
          onSpeedDate={onSpeedDate}
          onSendInterest={onSendInterest}
        />
      </div>

      {/* Photo Gallery Modal */}
      {showPhotoGallery && (
        <PhotoGallery
          photos={match.photos}
          initialIndex={currentPhotoIndex}
          userName={match.name}
          onClose={() => setShowPhotoGallery(false)}
        />
      )}
    </>
  );
}

// Helper component for info rows
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <span className="font-semibold text-gray-700 flex-shrink-0 w-40">{label}:</span>
      <span className="text-gray-600 text-right">{value}</span>
    </div>
  );
}

export default MatchCard;
