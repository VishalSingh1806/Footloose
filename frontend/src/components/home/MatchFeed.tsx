import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Edit2 } from 'lucide-react';
import MatchCard from './MatchCard';
import FilterBar, { FilterType } from './FilterBar';
import FilterModal from './FilterModal';
import NoMatches from './NoMatches';
import MatchCardSkeleton from './MatchCardSkeleton';
import DailyRecommendations from './DailyRecommendations';
import { Match, generateMockMatches } from '../../services/matchService';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

export interface MatchFilters {
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
  interests?: string[];
  minCompatibility?: number;
}

function MatchFeed() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [displayedMatches, setDisplayedMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['all']);
  const [filters, setFilters] = useState<MatchFilters>({});
  const [fromCache, setFromCache] = useState(false);
  const [removedMatches, setRemovedMatches] = useState<Set<string>>(new Set());
  const isOnline = useOnlineStatus();
  const { canInstall, promptInstall } = useInstallPrompt();

  // Pull-to-refresh
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    loadMatches();
  }, []);

  // Apply filters when activeFilters change
  useEffect(() => {
    applyActiveFilters();
  }, [activeFilters, matches, removedMatches]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockMatches = generateMockMatches(20);
      setMatches(mockMatches);
      setFromCache(!isOnline);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshMatches = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

  const applyActiveFilters = () => {
    let filtered = matches.filter((m) => !removedMatches.has(m.id));

    // Apply active filters
    if (!activeFilters.includes('all')) {
      if (activeFilters.includes('verified')) {
        filtered = filtered.filter((m) => m.verified);
      }
      if (activeFilters.includes('justJoined')) {
        filtered = filtered.filter((m) => m.isNewlyJoined);
      }
      if (activeFilters.includes('nearby')) {
        filtered = filtered.filter((m) => m.distance && m.distance < 50);
      }
      if (activeFilters.includes('premium')) {
        filtered = filtered.filter((m) => m.premium);
      }
      if (activeFilters.includes('highMatch')) {
        filtered = filtered.filter((m) => m.compatibility >= 80);
      }
    }

    setDisplayedMatches(filtered);
  };

  const handleFilterToggle = (filter: FilterType) => {
    if (filter === 'all') {
      setActiveFilters(['all']);
    } else {
      const newFilters = activeFilters.filter((f) => f !== 'all');
      if (newFilters.includes(filter)) {
        const updated = newFilters.filter((f) => f !== filter);
        setActiveFilters(updated.length === 0 ? ['all'] : updated);
      } else {
        setActiveFilters([...newFilters, filter]);
      }
    }
  };

  const handleApplyFilters = (newFilters: MatchFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleDontShow = (matchId: string) => {
    setRemovedMatches(new Set([...removedMatches, matchId]));
  };

  const handleShortlist = (matchId: string) => {
    console.log('Shortlisted:', matchId);
  };

  const handleSpeedDate = (matchId: string) => {
    console.log('Speed date requested:', matchId);
  };

  const handleSendInterest = (matchId: string) => {
    console.log('Interest sent:', matchId);
  };

  const handleInstallClick = async () => {
    const installed = await promptInstall();
    if (installed) {
      console.log('App installed successfully');
    }
  };

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY > 0) {
      const distance = e.touches[0].clientY - pullStartY;
      if (distance > 0 && distance < 150) {
        setPullDistance(distance);
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 80) {
      refreshMatches();
    }
    setPullStartY(0);
    setPullDistance(0);
  };

  // Calculate filter counts
  const filterCounts = {
    verified: matches.filter((m) => m.verified).length,
    justJoined: matches.filter((m) => m.isNewlyJoined).length,
    nearby: matches.filter((m) => m.distance && m.distance < 50).length,
    premium: matches.filter((m) => m.premium).length,
    highMatch: matches.filter((m) => m.compatibility >= 80).length,
  };

  const dailyRecommendations = displayedMatches.filter((m) => m.isDailyRecommendation);
  const hasDailyRecs = dailyRecommendations.length > 0;

  if (loading) {
    return (
      <div className="h-full bg-[#FAFAFA] overflow-hidden">
        <MatchCardSkeleton />
        <MatchCardSkeleton />
      </div>
    );
  }

  if (displayedMatches.length === 0) {
    return <NoMatches onRefresh={refreshMatches} />;
  }

  return (
    <div
      ref={containerRef}
      className="h-full bg-[#FAFAFA] overflow-auto relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div
          className="absolute top-0 left-0 right-0 flex justify-center items-center z-50"
          style={{
            height: pullDistance,
            opacity: pullDistance / 80,
          }}
        >
          <RefreshCw
            className={`text-[#E63946] ${refreshing ? 'animate-spin' : ''}`}
            size={24}
          />
        </div>
      )}

      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-[#F59E0B] text-white text-center py-2 px-4 text-sm">
          You're offline. Showing cached matches.
        </div>
      )}

      {/* Install prompt banner */}
      {canInstall && (
        <div className="bg-[#E63946] text-white p-4 flex items-center justify-between">
          <div className="flex-1">
            <p className="font-semibold">Install Footloose</p>
            <p className="text-sm opacity-90">Get the full app experience</p>
          </div>
          <button
            onClick={handleInstallClick}
            className="bg-white text-[#E63946] px-4 py-2 rounded-lg font-semibold text-sm"
          >
            Install
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-semibold text-[#1D3557]">My Matches</h1>
          <button
            className="flex items-center gap-1 text-[#E63946] text-sm font-medium"
            onClick={() => setShowFilterModal(true)}
          >
            <Edit2 size={14} />
          </button>
        </div>
        <p className="text-sm text-[#6C757D]">as per partner preferences</p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        activeFilters={activeFilters}
        onFilterToggle={handleFilterToggle}
        onOpenFilterModal={() => setShowFilterModal(true)}
        filterCounts={filterCounts}
      />

      {/* Match Counter */}
      <div className="bg-white px-4 py-3 text-sm text-[#6C757D] border-b border-gray-200">
        {hasDailyRecs ? (
          <span className="font-medium text-[#1D3557]">
            Daily Recommendations ({dailyRecommendations.length})
          </span>
        ) : (
          <span>
            <span className="font-semibold text-[#E63946]">{displayedMatches.length}</span> new
            matches today
          </span>
        )}
      </div>

      {/* Daily Recommendations Section */}
      {hasDailyRecs && <DailyRecommendations currentIndex={1} totalCount={dailyRecommendations.length} />}

      {/* Match Cards - Vertical Scroll */}
      <div className="pb-24">
        {displayedMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onDontShow={() => handleDontShow(match.id)}
            onShortlist={() => handleShortlist(match.id)}
            onSpeedDate={() => handleSpeedDate(match.id)}
            onSendInterest={() => handleSendInterest(match.id)}
            onCardClick={() => console.log('Navigate to full profile:', match.id)}
          />
        ))}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          currentFilters={filters}
          onApply={handleApplyFilters}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
}

export default MatchFeed;
