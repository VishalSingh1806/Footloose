import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Match, generateMockMatches } from '../../services/matchService';
import SpeedDateCallFlow from './SpeedDateCallFlow';

/**
 * Wrapper component for SpeedDateCallFlow
 * Fetches match data and handles navigation after call completion
 */
function SpeedDateCallWrapper() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();

  // For demo, get match from mock data
  // In production, fetch from API
  const [match] = useState<Match>(() => {
    const mockMatches = generateMockMatches(20);
    return mockMatches.find((m) => m.id === matchId) || mockMatches[0];
  });

  // Generate a unique speed date ID (in production, get from API)
  const speedDateId = `sd-${matchId}-${Date.now()}`;

  // Mock scheduled time (in production, get from actual scheduling)
  const scheduledDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const scheduledTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const handleComplete = () => {
    // Navigate back to matches page
    navigate('/matches');
  };

  const handleCancel = () => {
    // Navigate back to profile
    navigate(`/match/${matchId}`);
  };

  return (
    <SpeedDateCallFlow
      speedDateId={speedDateId}
      matchId={match.id}
      matchName={match.name}
      matchAge={match.age}
      matchPhoto={match.photos[0]}
      matchLocation={match.location}
      matchOccupation={match.occupation}
      compatibility={match.compatibility}
      scheduledTime={scheduledTime}
      scheduledDate={scheduledDate}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
}

export default SpeedDateCallWrapper;
