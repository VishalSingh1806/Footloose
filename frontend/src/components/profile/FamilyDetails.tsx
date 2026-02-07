import ProfileSection, { InfoRow } from './ProfileSection';
import { Match } from '../../services/matchService';

interface FamilyDetailsProps {
  match: Match;
}

function FamilyDetails({ match }: FamilyDetailsProps) {
  return (
    <ProfileSection title="Family Details">
      <InfoRow label="Family Status" value={match.familyStatus} />
      <InfoRow label="Family Type" value={match.familyType} />
      <InfoRow label="Father's Occupation" value={match.fatherOccupation} />
      <InfoRow label="Mother's Occupation" value={match.motherOccupation} />
      <InfoRow label="Siblings" value={match.siblings} />
      <InfoRow label="Family Location" value={match.familyLocation} noBorder />
    </ProfileSection>
  );
}

export default FamilyDetails;
