// Payment Method Types
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

// Subscription Tier
export type SubscriptionTier = 'free' | 'premium';

// Subscription Status
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

// Transaction Type
export type TransactionType =
  | 'credit_purchase'
  | 'subscription_purchase'
  | 'credit_deduction'
  | 'subscription_renewal';

// Transaction Status
export type TransactionStatus = 'pending' | 'success' | 'failed' | 'refunded';

// Credit Usage Type
export type CreditUsageType =
  | 'speed_date'
  | 'chat_unlock'
  | 'direct_unlock'
  | 'super_like'
  | 'profile_boost'
  | 'subscription_grant';

// Credit Package
export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  bonusCredits: number;
  totalCredits: number;
  strikePrice?: number;
  discount?: number;
  popular?: boolean;
  savingsPercent?: number;
  badge?: string;
}

// Subscription Plan
export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyCredits: number;
  features: string[];
  popular?: boolean;
}

// User Subscription
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  nextBillingDate?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

// Transaction
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  gst: number;
  totalAmount: number;
  credits?: number;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Credit Balance
export interface CreditBalance {
  userId: string;
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  lastUpdated: string;
}

// Credit Usage Record
export interface CreditUsage {
  id: string;
  userId: string;
  type: CreditUsageType;
  credits: number;
  matchId?: string;
  matchName?: string;
  timestamp: string;
}

// Razorpay Order
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

// Razorpay Payment Response
export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Transaction Filters
export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
}
