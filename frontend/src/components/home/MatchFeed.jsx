import { useState, useEffect } from 'react';
import { Bell, Menu } from 'lucide-react';
import MatchCard from './MatchCard';
import EmptyState from './EmptyState';
import DailyBatchStatus from './DailyBatchStatus';
import MatchCardSkeleton from './MatchCardSkeleton';

function MatchFeed() {
  const [dailyBatch, setDailyBatch] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [batchDate, setBatchDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [error, setError] = useState(null);
  const [actions, setActions] = useState({});

  // Check if we're online
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch daily batch on mount
  useEffect(() => {
    fetchDailyBatch();
  }, []);

  const fetchDailyBatch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check for cached batch first
      const cachedBatch = getCachedBatch();
      if (cachedBatch && isSameDay(cachedBatch.date, new Date())) {
        setDailyBatch(cachedBatch.profiles);
        setBatchDate(cachedBatch.date);
        setIsLoading(false);
        return;
      }

      // Fetch new batch from server
      const response = await fetch('/api/matches/daily-batch', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch daily batch');

      const data = await response.json();

      setDailyBatch(data.profiles || []);
      setBatchDate(new Date());

      // Cache batch for offline access
      cacheBatch({
        profiles: data.profiles,
        date: new Date()
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching daily batch:', err);

      // Try to load cached batch on error
      const cachedBatch = getCachedBatch();
      if (cachedBatch) {
        setDailyBatch(cachedBatch.profiles);
        setBatchDate(cachedBatch.date);
        setIsOffline(true);
      } else {
        setError(err.message);
      }

      setIsLoading(false);
    }
  };

  const handlePass = async (matchId) => {
    // Remove card from batch
    const newBatch = dailyBatch.filter(profile => profile.id !== matchId);
    setDailyBatch(newBatch);

    // Track action
    setActions(prev => ({ ...prev, [matchId]: 'passed' }));

    // Send to backend
    try {
      await fetch('/api/matches/pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ matchId, date: new Date() })
      });
    } catch (err) {
      console.error('Error logging pass:', err);
      // Queue for sync if offline
      if (!navigator.onLine) {
        queueAction({ type: 'pass', matchId, date: new Date() });
      }
    }

    // Analytics
    trackEvent('match_passed', { matchId, position: currentIndex });
  };

  const handleMaybe = async (matchId) => {
    // Track action
    setActions(prev => ({ ...prev, [matchId]: 'maybe' }));

    // Send to backend
    try {
      await fetch('/api/matches/maybe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ matchId, date: new Date() })
      });

      // Show toast
      showToast('Added to Maybe list');
    } catch (err) {
      console.error('Error adding to maybe:', err);
      // Queue for sync if offline
      if (!navigator.onLine) {
        queueAction({ type: 'maybe', matchId, date: new Date() });
      }
    }

    // Analytics
    trackEvent('match_maybe', { matchId, position: currentIndex });
  };

  const handleSpeedDate = (matchId) => {
    // Open speed date request modal
    // This will be handled by parent component or routing
    trackEvent('speed_date_clicked', { matchId, position: currentIndex });
  };

  const handleRefresh = async () => {
    // Check if it's a new day
    if (batchDate && isSameDay(batchDate, new Date())) {
      showToast("Today's batch is current");
      return;
    }

    // Fetch new batch
    await fetchDailyBatch();
  };

  // Helper functions
  const getCachedBatch = () => {
    try {
      const cached = localStorage.getItem('daily_batch');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const cacheBatch = (batch) => {
    try {
      localStorage.setItem('daily_batch', JSON.stringify(batch));
    } catch (err) {
      console.error('Error caching batch:', err);
    }
  };

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const queueAction = (action) => {
    try {
      const queue = JSON.parse(localStorage.getItem('action_queue') || '[]');
      queue.push(action);
      localStorage.setItem('action_queue', JSON.stringify(queue));
    } catch (err) {
      console.error('Error queueing action:', err);
    }
  };

  const showToast = (message) => {
    // Simple toast implementation - can be enhanced
    console.log('Toast:', message);
  };

  const trackEvent = (eventName, data) => {
    // Analytics tracking
    console.log('Track:', eventName, data);
  };

  // Calculate remaining profiles
  const remainingProfiles = dailyBatch.filter(
    profile => !actions[profile.id] || actions[profile.id] !== 'passed'
  );

  const isExhausted = remainingProfiles.length === 0 && !isLoading;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-[#FEF3C7] border-b border-[#FCD34D] px-5 py-3">
          <p className="text-sm text-[#92400E] text-center">
            {dailyBatch.length > 0
              ? 'Viewing offline. Some features unavailable.'
              : 'You\'re offline. Connect to internet to see today\'s matches.'}
          </p>
        </div>
      )}

      {/* Daily Batch Header - Sticky */}
      <div className="bg-white border-b border-[#E5E7EB] px-5 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-[#1D3557] mb-1">
          Today's matches
        </h1>
        <DailyBatchStatus
          remaining={remainingProfiles.length}
          total={dailyBatch.length}
          isExhausted={isExhausted}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {isLoading ? (
          <div className="px-5 py-6 space-y-4">
            <MatchCardSkeleton />
            <MatchCardSkeleton />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center px-5 py-12">
            <p className="text-base text-[#DC2626] mb-4">Unable to load matches</p>
            <p className="text-sm text-[#6C757D] mb-6">Check your connection and try again</p>
            <button
              onClick={fetchDailyBatch}
              className="px-6 h-12 bg-[#E63946] text-white font-semibold rounded-xl hover:bg-[#D62828] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : isExhausted ? (
          <EmptyState onUpdatePreferences={() => {}} />
        ) : (
          <div className="px-5 py-6 space-y-4">
            {remainingProfiles.map((profile) => (
              <MatchCard
                key={profile.id}
                profile={profile}
                onPass={() => handlePass(profile.id)}
                onMaybe={() => handleMaybe(profile.id)}
                onSpeedDate={() => handleSpeedDate(profile.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchFeed;
