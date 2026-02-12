import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { AlertTriangle, X } from 'lucide-react';

export function CreditsLowBanner() {
  const navigate = useNavigate();
  const { creditBalance } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  // Check if banner was dismissed today
  useEffect(() => {
    const dismissedDate = localStorage.getItem('creditsLowBannerDismissed');
    if (dismissedDate) {
      const today = new Date().toDateString();
      const dismissedDay = new Date(dismissedDate).toDateString();
      if (today === dismissedDay) {
        setDismissed(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('creditsLowBannerDismissed', new Date().toISOString());
  };

  // Show banner if credits < 200 (cost of 1 speed date) and not dismissed
  if (dismissed || creditBalance >= 200) {
    return null;
  }

  return (
    <div className="fixed bottom-16 sm:bottom-20 left-0 right-0 z-40 px-3 sm:px-4 animate-slideUp">
      <div className="max-w-7xl mx-auto">
        <div className="bg-amber-500 text-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4">
          <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <AlertTriangle size={20} className="flex-shrink-0 mt-0.5 sm:mt-0 sm:w-6 sm:h-6" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs sm:text-sm">Low Credit Balance!</p>
                <p className="text-xs text-white/90 line-clamp-1">
                  You have {creditBalance} credits left. Add more to keep connecting.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={() => navigate('/credits/purchase')}
                className="bg-white text-amber-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold hover:bg-amber-50 transition-colors whitespace-nowrap"
              >
                Add Credits
              </button>
              <button
                onClick={handleDismiss}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
