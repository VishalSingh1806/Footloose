import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical, AlertTriangle } from 'lucide-react';
import { Match, generateMockMatches } from '../../services/matchService';
import { useBackButton } from '../../hooks/useBackButton';
import ProfileHeader from './ProfileHeader';
import AboutMe from './AboutMe';
import ProfileSection, { InfoRow } from './ProfileSection';
import FamilyDetails from './FamilyDetails';
import LifestyleInfo from './LifestyleInfo';
import PartnerPreferences from './PartnerPreferences';
import ContactCard from './ContactCard';
import ProfileActions from './ProfileActions';
import ReportBlockModal from './ReportBlockModal';

function MatchProfileDetail() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();

  console.log('MatchProfileDetail rendering with matchId:', matchId);

  // For demo, get match from mock data
  const [match] = useState<Match>(() => {
    const mockMatches = generateMockMatches(20);
    return mockMatches.find((m) => m.id === matchId) || mockMatches[0];
  });

  const [isShortlisted, setIsShortlisted] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Mock contact unlocked status - in production this would be from API
  const contactUnlocked = false;

  const handleBack = () => {
    navigate('/matches');
  };

  // Handle Android back gesture
  useBackButton(handleBack);

  const handleToggleShortlist = () => {
    setIsShortlisted(!isShortlisted);
    console.log('Shortlist toggled:', !isShortlisted);
  };

  const handleSendInterest = () => {
    setInterestSent(true);
    console.log('Interest sent to:', match.name);
  };

  const handleRequestSpeedDate = () => {
    console.log('Speed date requested with:', match.name);
    // Navigate directly to speed date call for testing
    // In production, this would open a scheduling modal first
    navigate(`/speed-date-call/${match.id}`);
  };

  const handleReport = (reason: string, details?: string) => {
    console.log('Report submitted:', reason, details);
  };

  const handleBlock = () => {
    console.log('User blocked:', match.name);
    navigate(-1);
  };

  // Generate bio from match data
  const bio = `I'm a ${match.occupation.toLowerCase()} living in ${match.location}, passionate about personal growth and meaningful connections. I value family traditions while embracing modern values.

I enjoy spending my free time ${match.hobbies.slice(0, 2).join(' and ').toLowerCase()}. ${match.eatingHabits === 'Vegetarian' ? "I'm a vegetarian and" : 'I'} believe in staying healthy and active.

I come from a ${match.familyStatus.toLowerCase()} ${match.familyType.toLowerCase()} in ${match.familyLocation}. My family has been supportive of my career while maintaining our ${match.religion} values. I'm looking for a partner who shares similar values and is ready for a committed relationship.`;

  const lifestyleTags = [
    'Family-oriented',
    match.eatingHabits,
    `${match.drinking === 'Never' ? 'Non-' : ''}Drinker`,
    `${match.smoking === 'Never' ? 'Non-' : ''}Smoker`,
    'Values Experiences',
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-32">
      {/* Custom Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center
                     transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-[#1D3557]" />
        </button>

        <h1 className="text-lg font-semibold text-[#1D3557]">{match.name}</h1>

        <button
          onClick={() => setShowReportModal(true)}
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center
                     transition-colors"
          aria-label="More options"
        >
          <MoreVertical size={20} className="text-[#1D3557]" />
        </button>
      </div>

      {/* Profile Content */}
      <ProfileHeader
        match={match}
        isShortlisted={isShortlisted}
        onToggleShortlist={handleToggleShortlist}
      />

      {/* About Me */}
      <AboutMe bio={bio} lifestyleTags={lifestyleTags} />

      {/* Personal Information */}
      <ProfileSection title="Personal Information">
        <InfoRow label="Age" value={`${match.age} years`} />
        <InfoRow label="Height" value={match.height} />
        <InfoRow label="Weight" value={match.weight} />
        <InfoRow label="Marital Status" value={match.maritalStatus} />
        <InfoRow label="Mother Tongue" value={match.motherTongue} />
        <InfoRow label="Complexion" value={match.complexion} />
        <InfoRow label="Diet" value={match.eatingHabits} />
        <InfoRow label="Drinking" value={match.drinking} />
        <InfoRow label="Smoking" value={match.smoking} noBorder />
      </ProfileSection>

      {/* Religious Background */}
      <ProfileSection title="Religious Background">
        <InfoRow label="Religion" value={match.religion} />
        <InfoRow label="Community" value={match.community} />
        <InfoRow label="Mother Tongue" value={match.motherTongue} noBorder />
      </ProfileSection>

      {/* Family Details */}
      <FamilyDetails match={match} />

      {/* Education & Career */}
      <ProfileSection title="Education & Career">
        <InfoRow label="Highest Qualification" value={match.education} />
        {match.educationDetail && <InfoRow label="College/University" value={match.educationDetail} />}
        <InfoRow label="Working As" value={match.occupation} />
        {match.occupationDetail && <InfoRow label="Organization" value={match.occupationDetail} />}
        <InfoRow label="Annual Income" value={match.annualIncome} />
        <InfoRow label="Work Location" value={match.location} noBorder />
      </ProfileSection>

      {/* Lifestyle & Interests */}
      <LifestyleInfo match={match} />

      {/* Partner Preferences */}
      <PartnerPreferences match={match} />

      {/* Contact Card */}
      <ContactCard
        isUnlocked={contactUnlocked}
        contactInfo={
          contactUnlocked
            ? {
                mobile: '+91 98765 43210',
                email: `${match.name.toLowerCase()}@email.com`,
                whatsapp: '+91 98765 43210',
              }
            : undefined
        }
      />

      {/* Trust & Safety */}
      <ProfileSection title="Trust & Safety">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#6C757D]">Trust Score</span>
            <span className="text-lg font-bold text-green-600">95/100</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }} />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-[#1D3557]">Phone Verified</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-[#1D3557]">Email Verified</span>
          </div>
          {match.verified && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-[#1D3557]">ID Verified</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowReportModal(true)}
            className="w-full py-3 px-4 rounded-lg border-2 border-red-200 bg-red-50
                       text-red-600 hover:bg-red-100 hover:border-red-300 transition-all
                       flex items-center justify-center gap-2 font-semibold"
          >
            <AlertTriangle size={18} />
            <span>Report or Block this Profile</span>
          </button>
        </div>
      </ProfileSection>

      {/* Fixed Action Buttons */}
      <ProfileActions
        matchName={match.name}
        interestSent={interestSent}
        onSendInterest={handleSendInterest}
        onRequestSpeedDate={handleRequestSpeedDate}
        onShortlist={handleToggleShortlist}
        onMore={() => setShowReportModal(true)}
        isShortlisted={isShortlisted}
      />

      {/* Report/Block Modal */}
      {showReportModal && (
        <ReportBlockModal
          matchName={match.name}
          onClose={() => setShowReportModal(false)}
          onReport={handleReport}
          onBlock={handleBlock}
        />
      )}
    </div>
  );
}

export default MatchProfileDetail;
