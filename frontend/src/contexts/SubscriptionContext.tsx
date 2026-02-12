import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CreditBalance,
  CreditUsage,
  UserSubscription,
  SubscriptionTier,
  CreditUsageType,
} from '../types/subscription';
import {
  getCreditBalance,
  deductCredits as deductCreditsService,
  addCredits as addCreditsService,
  getCreditUsageHistory,
} from '../services/creditService';
import {
  getUserSubscription,
  isPremiumUser as checkPremium,
} from '../services/subscriptionService';

interface SubscriptionContextValue {
  // Credit state
  creditBalance: number;
  creditData: CreditBalance | null;
  creditUsage: CreditUsage[];

  // Subscription state
  subscription: UserSubscription | null;
  subscriptionTier: SubscriptionTier;
  isPremium: boolean;

  // Loading states
  loading: boolean;
  error: string | null;

  // Actions
  refreshBalance: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  refreshAll: () => Promise<void>;
  deductCredits: (
    amount: number,
    type: CreditUsageType,
    metadata?: { matchId?: string; matchName?: string }
  ) => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
  setError: (error: string | null) => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [creditData, setCreditData] = useState<CreditBalance | null>(null);
  const [creditUsage, setCreditUsage] = useState<CreditUsage[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load credit balance
      const balance = await getCreditBalance();
      setCreditData(balance);
      setCreditBalance(balance.balance);

      // Load subscription
      const sub = await getUserSubscription();
      setSubscription(sub);
      setSubscriptionTier(sub?.tier || 'free');
      setIsPremium(sub?.status === 'active' && sub?.tier === 'premium');

      // Load credit usage
      const usage = await getCreditUsageHistory(50);
      setCreditUsage(usage);
    } catch (err: any) {
      console.error('Error loading subscription data:', err);
      setError(err.message || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  // Refresh credit balance
  const refreshBalance = async () => {
    try {
      const balance = await getCreditBalance();
      setCreditData(balance);
      setCreditBalance(balance.balance);

      const usage = await getCreditUsageHistory(50);
      setCreditUsage(usage);
    } catch (err: any) {
      console.error('Error refreshing balance:', err);
      setError(err.message || 'Failed to refresh balance');
    }
  };

  // Refresh subscription
  const refreshSubscription = async () => {
    try {
      const sub = await getUserSubscription();
      setSubscription(sub);
      setSubscriptionTier(sub?.tier || 'free');
      setIsPremium(sub?.status === 'active' && sub?.tier === 'premium');
    } catch (err: any) {
      console.error('Error refreshing subscription:', err);
      setError(err.message || 'Failed to refresh subscription');
    }
  };

  // Refresh all data
  const refreshAll = async () => {
    await Promise.all([refreshBalance(), refreshSubscription()]);
  };

  // Deduct credits
  const deductCredits = async (
    amount: number,
    type: CreditUsageType,
    metadata?: { matchId?: string; matchName?: string }
  ): Promise<boolean> => {
    try {
      const success = await deductCreditsService(amount, type, metadata);

      if (success) {
        // Update local state immediately
        setCreditBalance(prev => prev - amount);

        // Refresh full data in background
        refreshBalance();
      }

      return success;
    } catch (err: any) {
      console.error('Error deducting credits:', err);
      setError(err.message || 'Failed to deduct credits');
      return false;
    }
  };

  // Add credits
  const addCredits = async (amount: number) => {
    try {
      await addCreditsService(amount);

      // Update local state immediately
      setCreditBalance(prev => prev + amount);

      // Refresh full data in background
      refreshBalance();
    } catch (err: any) {
      console.error('Error adding credits:', err);
      setError(err.message || 'Failed to add credits');
    }
  };

  // Load data on mount
  useEffect(() => {
    loadInitialData();

    // Set up online listener for sync
    const handleOnline = () => {
      console.log('Back online - refreshing subscription data...');
      refreshAll();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Listen for storage changes (sync across tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'creditBalance' && e.newValue) {
        const balance = JSON.parse(e.newValue);
        setCreditBalance(balance.balance);
        setCreditData(balance);
      } else if (e.key === 'subscriptionTier' && e.newValue) {
        setSubscriptionTier(e.newValue as SubscriptionTier);
        setIsPremium(e.newValue === 'premium');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value: SubscriptionContextValue = {
    creditBalance,
    creditData,
    creditUsage,
    subscription,
    subscriptionTier,
    isPremium,
    loading,
    error,
    refreshBalance,
    refreshSubscription,
    refreshAll,
    deductCredits,
    addCredits,
    setError,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}
