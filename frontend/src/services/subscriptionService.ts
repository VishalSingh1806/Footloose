import { SubscriptionPlan, UserSubscription } from '../types/subscription';
import { subscriptionDB } from './subscriptionDB';
import { mockAPI, SUBSCRIPTION_PLANS } from './mockAPI';

const CURRENT_USER_ID = 'current_user'; // TODO: Get from auth context

// Get all subscription plans
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  // In production, fetch from backend
  // For now, return mock plans
  return SUBSCRIPTION_PLANS;
}

// Get user's current subscription
export async function getUserSubscription(): Promise<UserSubscription | null> {
  try {
    // Try IndexedDB first
    const cached = await subscriptionDB.getSubscription(CURRENT_USER_ID);
    if (cached && cached.status === 'active') {
      // Check if expired
      if (new Date(cached.endDate) > new Date()) {
        return cached;
      }
    }

    // Fetch from API
    const subscription = await mockAPI.getUserSubscription(CURRENT_USER_ID);

    if (subscription) {
      // Cache in IndexedDB
      await subscriptionDB.saveSubscription(subscription);

      // Also save to localStorage
      localStorage.setItem('subscriptionTier', subscription.tier);
      localStorage.setItem('subscriptionStatus', subscription.status);
    } else {
      // No subscription - clear cache
      localStorage.setItem('subscriptionTier', 'free');
      localStorage.removeItem('subscriptionStatus');
    }

    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);

    // Fallback to localStorage
    const tier = localStorage.getItem('subscriptionTier') || 'free';
    if (tier === 'free') {
      return null;
    }

    // Try to get from IndexedDB
    const cached = await subscriptionDB.getSubscription(CURRENT_USER_ID);
    return cached;
  }
}

// Check if user is premium
export async function isPremiumUser(): Promise<boolean> {
  const subscription = await getUserSubscription();
  return subscription?.status === 'active' && subscription?.tier === 'premium';
}

// Create subscription (called after payment success)
export async function createSubscription(
  planId: string,
  billingCycle: 'monthly' | 'yearly'
): Promise<UserSubscription> {
  try {
    const subscription = await mockAPI.createSubscription(
      CURRENT_USER_ID,
      planId,
      billingCycle
    );

    // Save to IndexedDB
    await subscriptionDB.saveSubscription(subscription);

    // Update localStorage
    localStorage.setItem('subscriptionTier', subscription.tier);
    localStorage.setItem('subscriptionStatus', subscription.status);

    // Grant monthly credits if premium
    if (subscription.tier === 'premium') {
      const { addCredits } = await import('./creditService');
      await addCredits(1000); // Premium gets 1000 credits
    }

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// Cancel subscription
export async function cancelSubscription(reason: string): Promise<boolean> {
  try {
    const success = await mockAPI.cancelSubscription(CURRENT_USER_ID, reason);

    if (success) {
      const subscription = await getUserSubscription();
      if (subscription) {
        subscription.status = 'cancelled';
        subscription.cancelledAt = new Date().toISOString();
        subscription.cancellationReason = reason;
        subscription.autoRenew = false;

        // Update IndexedDB
        await subscriptionDB.saveSubscription(subscription);

        // Update localStorage
        localStorage.setItem('subscriptionStatus', 'cancelled');
      }
    }

    return success;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return false;
  }
}

// Update auto-renew setting
export async function updateAutoRenew(enabled: boolean): Promise<boolean> {
  try {
    const success = await mockAPI.updateAutoRenew(CURRENT_USER_ID, enabled);

    if (success) {
      const subscription = await getUserSubscription();
      if (subscription) {
        subscription.autoRenew = enabled;
        await subscriptionDB.saveSubscription(subscription);
      }
    }

    return success;
  } catch (error) {
    console.error('Error updating auto-renew:', error);
    return false;
  }
}

// Get subscription tier from localStorage (quick check)
export function getSubscriptionTierSync(): 'free' | 'premium' {
  return (localStorage.getItem('subscriptionTier') as 'free' | 'premium') || 'free';
}

// Check if subscription is expiring soon (within 7 days)
export async function isSubscriptionExpiringSoon(): Promise<boolean> {
  const subscription = await getUserSubscription();
  if (!subscription || subscription.status !== 'active') {
    return false;
  }

  const endDate = new Date(subscription.endDate);
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  return endDate <= sevenDaysFromNow;
}
