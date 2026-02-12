import {
  CreditPackage,
  SubscriptionPlan,
  RazorpayOrder,
  Transaction,
  UserSubscription,
  CreditBalance,
} from '../types/subscription';

// Mock credit packages
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'pack_500',
    credits: 500,
    price: 199,
    bonusCredits: 0,
    totalCredits: 500,
    badge: 'Starter',
  },
  {
    id: 'pack_1000',
    credits: 1000,
    price: 349,
    bonusCredits: 50,
    totalCredits: 1050,
    savingsPercent: 12,
    badge: 'Value',
  },
  {
    id: 'pack_1500',
    credits: 1500,
    price: 499,
    bonusCredits: 300,
    totalCredits: 1800,
    popular: true,
    savingsPercent: 20,
    badge: 'Most Popular',
  },
  {
    id: 'pack_3000',
    credits: 3000,
    price: 899,
    bonusCredits: 900,
    totalCredits: 3900,
    savingsPercent: 30,
    badge: 'Best Value',
  },
  {
    id: 'pack_5000',
    credits: 5000,
    price: 1399,
    bonusCredits: 2000,
    totalCredits: 7000,
    savingsPercent: 40,
    badge: '40% Bonus',
  },
  {
    id: 'pack_10000',
    credits: 10000,
    price: 2499,
    bonusCredits: 5000,
    totalCredits: 15000,
    savingsPercent: 50,
    badge: '50% Bonus',
  },
];

// Mock subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: 'free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyCredits: 0,
    features: [
      'Browse matches',
      'View compatibility scores',
      'See who viewed you (limited)',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tier: 'premium',
    monthlyPrice: 999,
    yearlyPrice: 9588, // ₹799/month * 12
    monthlyCredits: 1000,
    features: [
      '1000 credits every month',
      '50% discount on additional credits',
      'Unlimited likes and interests',
      'See who liked you',
      'Advanced search filters',
      'Profile boost (3x per month)',
      'Priority customer support',
      'Ad-free experience',
      'Undo accidental pass',
    ],
    popular: true,
  },
];

// Helper function to delay (simulate network)
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Mock API functions
export const mockAPI = {
  // Create payment order
  async createPaymentOrder(
    amount: number,
    type: string,
    metadata?: any
  ): Promise<RazorpayOrder> {
    await delay(500);
    return {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount * 100, // Razorpay uses paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      status: 'created',
    };
  },

  // Verify payment
  async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    await delay(300);
    // In production, backend validates signature
    return true;
  },

  // Get user subscription
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    await delay(200);
    // Check localStorage for mock subscription
    const stored = localStorage.getItem('userSubscription');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  },

  // Get transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    await delay(300);
    // Return empty array, will be populated from IndexedDB
    return [];
  },

  // Get credit balance
  async getCreditBalance(userId: string): Promise<CreditBalance> {
    await delay(200);
    const stored = localStorage.getItem('creditBalance');
    if (stored) {
      return JSON.parse(stored);
    }
    // Default balance
    return {
      userId,
      balance: 850, // Starting balance
      lifetimeEarned: 850,
      lifetimeSpent: 0,
      lastUpdated: new Date().toISOString(),
    };
  },

  // Update credit balance (after purchase)
  async updateCreditBalance(
    userId: string,
    credits: number
  ): Promise<CreditBalance> {
    await delay(300);
    const current = await this.getCreditBalance(userId);
    const updated: CreditBalance = {
      ...current,
      balance: current.balance + credits,
      lifetimeEarned: current.lifetimeEarned + credits,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem('creditBalance', JSON.stringify(updated));
    return updated;
  },

  // Deduct credits
  async deductCredits(
    userId: string,
    amount: number
  ): Promise<CreditBalance> {
    await delay(200);
    const current = await this.getCreditBalance(userId);
    const updated: CreditBalance = {
      ...current,
      balance: current.balance - amount,
      lifetimeSpent: current.lifetimeSpent + amount,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem('creditBalance', JSON.stringify(updated));
    return updated;
  },

  // Create subscription
  async createSubscription(
    userId: string,
    planId: string,
    billingCycle: 'monthly' | 'yearly'
  ): Promise<UserSubscription> {
    await delay(500);
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) throw new Error('Plan not found');

    const startDate = new Date();
    const endDate = new Date(startDate);
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription: UserSubscription = {
      id: `sub_${Date.now()}`,
      userId,
      planId,
      tier: plan.tier,
      status: 'active',
      billingCycle,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      autoRenew: true,
      nextBillingDate: endDate.toISOString(),
    };

    localStorage.setItem('userSubscription', JSON.stringify(subscription));
    return subscription;
  },

  // Cancel subscription
  async cancelSubscription(
    userId: string,
    reason: string
  ): Promise<boolean> {
    await delay(400);
    const stored = localStorage.getItem('userSubscription');
    if (stored) {
      const subscription = JSON.parse(stored);
      subscription.status = 'cancelled';
      subscription.cancelledAt = new Date().toISOString();
      subscription.cancellationReason = reason;
      subscription.autoRenew = false;
      localStorage.setItem('userSubscription', JSON.stringify(subscription));
    }
    return true;
  },

  // Update auto-renew
  async updateAutoRenew(
    userId: string,
    enabled: boolean
  ): Promise<boolean> {
    await delay(200);
    const stored = localStorage.getItem('userSubscription');
    if (stored) {
      const subscription = JSON.parse(stored);
      subscription.autoRenew = enabled;
      localStorage.setItem('userSubscription', JSON.stringify(subscription));
    }
    return true;
  },
};

// Helper to generate mock transactions for testing
export function generateMockTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = [];
  const types: ('credit_purchase' | 'subscription_purchase')[] = [
    'credit_purchase',
    'subscription_purchase',
  ];
  const statuses: ('success' | 'failed' | 'pending')[] = [
    'success',
    'success',
    'success',
    'failed',
  ];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = type === 'credit_purchase' ? 199 + i * 100 : 999;
    const gst = Math.round(amount * 0.18);

    transactions.push({
      id: `txn_${Date.now()}_${i}`,
      userId: 'current_user',
      type,
      amount,
      gst,
      totalAmount: amount + gst,
      credits: type === 'credit_purchase' ? 500 + i * 100 : 1000,
      status,
      paymentMethod: 'upi',
      razorpayOrderId: `order_${Date.now()}_${i}`,
      razorpayPaymentId: status === 'success' ? `pay_${Date.now()}_${i}` : undefined,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }

  return transactions;
}
