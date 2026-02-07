import ProfileSection, { InfoRow } from './ProfileSection';
import { Match } from '../../services/matchService';

interface LifestyleInfoProps {
  match: Match;
}

function LifestyleInfo({ match }: LifestyleInfoProps) {
  return (
    <ProfileSection title="Lifestyle & Interests">
      <InfoRow label="Hobbies" value={match.hobbies.join(', ')} />
      <InfoRow label="Interests" value={match.interests.join(', ')} />
      <InfoRow label="Languages Known" value={match.languages.join(', ')} />
      <InfoRow label="Eating Habits" value={match.eatingHabits} />
      <InfoRow label="Drinking" value={match.drinking} />
      <InfoRow label="Smoking" value={match.smoking} noBorder />
    </ProfileSection>
  );
}

export default LifestyleInfo;
