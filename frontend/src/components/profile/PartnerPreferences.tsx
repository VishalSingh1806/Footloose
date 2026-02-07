import ProfileSection, { InfoRow } from './ProfileSection';
import { Match } from '../../services/matchService';

interface PartnerPreferencesProps {
  match: Match;
}

function PartnerPreferences({ match }: PartnerPreferencesProps) {
  return (
    <ProfileSection title="Partner Preferences">
      <InfoRow label="Age" value={match.partnerPreferences.ageRange} />
      <InfoRow label="Height" value={match.partnerPreferences.heightRange} />
      <InfoRow label="Marital Status" value={match.partnerPreferences.maritalStatus.join(', ')} />
      <InfoRow label="Education" value={match.partnerPreferences.education.join(', ')} />
      <InfoRow label="Location" value={match.partnerPreferences.location.join(', ')} noBorder />

      {/* Additional preferences text */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm text-[#6C757D] italic">
          "Looking for someone who values family, has a positive outlook on life, and is ready for
          a committed relationship. Professional stability and shared values are important to me."
        </p>
      </div>
    </ProfileSection>
  );
}

export default PartnerPreferences;
