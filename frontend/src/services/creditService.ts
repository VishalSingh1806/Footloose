import { CreditBalance, CreditUsage, CreditUsageType } from '../types/subscription';
import { subscriptionDB } from './subscriptionDB';
import { mockAPI } from './mockAPI';

const CURRENT_USER_ID = 'current_user'; // TODO: Get from auth context

// GST calculation
export function calculateGST(amount: number): { gst: number; total: number } {
  const gst = Math.round(amount * 0.18);
  const total = amount + gst;
  return { gst, total };
}

// Get credit balance (offline-first)
export async function getCreditBalance(): Promise<CreditBalance> {
  try {
    // Try IndexedDB first
    const cached = await subscriptionDB.getCreditBalance(CURRENT_USER_ID);
    if (cached) {
      return cached;
    }

    // Fallback to API
    const balance = await mockAPI.getCreditBalance(CURRENT_USER_ID);

    // Cache in IndexedDB
    await subscriptionDB.saveCreditBalance(balance);

    // Also save to localStorage for quick access
    localStorage.setItem('creditBalance', JSON.stringify(balance));

    return balance;
  } catch (error) {
    console.error('Error fetching credit balance:', error);

    // Last resort: localStorage
    const stored = localStorage.getItem('creditBalance');
    if (stored) {
      return JSON.parse(stored);
    }

    // Return default
    return {
      userId: CURRENT_USER_ID,
      balance: 0,
      lifetimeEarned: 0,
      lifetimeSpent: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Deduct credits with optimistic update
export async function deductCredits(
  amount: number,
  type: CreditUsageType,
  metadata?: { matchId?: string; matchName?: string }
): Promise<boolean> {
  try {
    const currentBalance = await getCreditBalance();

    // Check if sufficient balance
    if (currentBalance.balance < amount) {
      return false;
    }

    // Optimistic update - reduce balance immediately
    const newBalance: CreditBalance = {
      ...currentBalance,
      balance: currentBalance.balance - amount,
      lifetimeSpent: currentBalance.lifetimeSpent + amount,
      lastUpdated: new Date().toISOString(),
    };

    // Update localStorage immediately for UI
    localStorage.setItem('creditBalance', JSON.stringify(newBalance));

    // Create usage record
    const usage: CreditUsage = {
      id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: CURRENT_USER_ID,
      type,
      credits: amount,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    // Save to IndexedDB
    await subscriptionDB.saveCreditUsage(usage);
    await subscriptionDB.saveCreditBalance(newBalance);

    // If online, sync to backend
    if (navigator.onLine) {
      try {
        await mockAPI.deductCredits(CURRENT_USER_ID, amount);
      } catch (error) {
        console.error('Failed to sync credit deduction to backend:', error);
        // Queue for background sync
        await queueCreditDeduction(usage);
      }
    } else {
      // Offline - queue for later
      await queueCreditDeduction(usage);
    }

    return true;
  } catch (error) {
    console.error('Error deducting credits:', error);
    return false;
  }
}

// Add credits (after purchase)
export async function addCredits(amount: number): Promise<CreditBalance> {
  const currentBalance = await getCreditBalance();

  const newBalance: CreditBalance = {
    ...currentBalance,
    balance: currentBalance.balance + amount,
    lifetimeEarned: currentBalance.lifetimeEarned + amount,
    lastUpdated: new Date().toISOString(),
  };

  // Update localStorage
  localStorage.setItem('creditBalance', JSON.stringify(newBalance));

  // Save to IndexedDB
  await subscriptionDB.saveCreditBalance(newBalance);

  // Sync to backend if online
  if (navigator.onLine) {
    try {
      await mockAPI.updateCreditBalance(CURRENT_USER_ID, amount);
    } catch (error) {
      console.error('Failed to sync credit addition to backend:', error);
    }
  }

  return newBalance;
}

// Get credit usage history
export async function getCreditUsageHistory(limit?: number): Promise<CreditUsage[]> {
  try {
    const usage = await subscriptionDB.getCreditUsage(CURRENT_USER_ID, limit);
    return usage;
  } catch (error) {
    console.error('Error fetching credit usage:', error);
    return [];
  }
}

// Get usage breakdown by type
export async function getUsageBreakdown(days: number = 30) {
  const allUsage = await getCreditUsageHistory();

  // Filter by date range
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentUsage = allUsage.filter(
    u => new Date(u.timestamp) >= cutoffDate
  );

  // Group by type
  const breakdown: Record<string, { credits: number; count: number }> = {};

  recentUsage.forEach(u => {
    if (!breakdown[u.type]) {
      breakdown[u.type] = { credits: 0, count: 0 };
    }
    breakdown[u.type].credits += u.credits;
    breakdown[u.type].count += 1;
  });

  const totalCredits = recentUsage.reduce((sum, u) => sum + u.credits, 0);

  return {
    breakdown,
    totalCredits,
    transactions: recentUsage.length,
  };
}

// Queue credit deduction for offline sync
async function queueCreditDeduction(usage: CreditUsage): Promise<void> {
  const queue = JSON.parse(localStorage.getItem('pendingCreditDeductions') || '[]');
  queue.push(usage);
  localStorage.setItem('pendingCreditDeductions', JSON.stringify(queue));
}

// Sync pending credit deductions
export async function syncPendingDeductions(): Promise<void> {
  if (!navigator.onLine) return;

  const queue = JSON.parse(localStorage.getItem('pendingCreditDeductions') || '[]');
  if (queue.length === 0) return;

  console.log(`Syncing ${queue.length} pending credit deductions...`);

  const failed: CreditUsage[] = [];

  for (const usage of queue) {
    try {
      await mockAPI.deductCredits(CURRENT_USER_ID, usage.credits);
    } catch (error) {
      console.error('Failed to sync credit deduction:', error);
      failed.push(usage);
    }
  }

  // Update queue with only failed items
  localStorage.setItem('pendingCreditDeductions', JSON.stringify(failed));

  if (failed.length === 0) {
    console.log('All credit deductions synced successfully');
  }
}

// Initialize sync listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online - syncing pending credit deductions...');
    syncPendingDeductions();
  });
}
