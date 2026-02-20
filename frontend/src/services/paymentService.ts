import {
  RazorpayOrder,
  RazorpayPaymentResponse,
  TransactionType,
  Transaction,
} from '../types/subscription';
import { mockAPI, CREDIT_PACKAGES } from './mockAPI';
import { calculateGST } from './creditService';
import { subscriptionDB } from './subscriptionDB';

const CURRENT_USER_ID = 'current_user'; // TODO: Get from auth context

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay SDK dynamically
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Get payment description based on type
function getPaymentDescription(type: TransactionType, metadata?: any): string {
  switch (type) {
    case 'credit_purchase':
      return `Purchase ${metadata?.credits || ''} credits`;
    case 'subscription_purchase':
      return `Premium subscription (${metadata?.billingCycle || 'monthly'})`;
    default:
      return 'Footloose No More - Payment';
  }
}

// Create payment order
async function createPaymentOrder(
  amount: number,
  type: TransactionType,
  metadata?: any
): Promise<RazorpayOrder> {
  // Calculate GST
  const { gst, total } = calculateGST(amount);

  // Create transaction record
  const transaction: Transaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: CURRENT_USER_ID,
    type,
    amount,
    gst,
    totalAmount: total,
    status: 'pending',
    metadata,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save pending transaction
  await subscriptionDB.saveTransaction(transaction);

  // Create order via API
  const order = await mockAPI.createPaymentOrder(total, type, metadata);

  // Update transaction with order ID
  transaction.razorpayOrderId = order.id;
  await subscriptionDB.saveTransaction(transaction);

  return order;
}

// Initiate payment with Razorpay
export async function initiatePayment(
  amount: number,
  type: TransactionType,
  metadata?: any
): Promise<RazorpayPaymentResponse | null> {
  try {
    // Load Razorpay SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // Create order
    const order = await createPaymentOrder(amount, type, metadata);

    // Calculate total with GST
    const { total } = calculateGST(amount);

    // Open Razorpay modal
    return new Promise((resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy', // Use test key for development
        amount: total * 100, // Razorpay uses paise
        currency: 'INR',
        name: 'Footloose No More',
        description: getPaymentDescription(type, metadata),
        image: '/icon-192.png', // App logo
        order_id: order.id,
        handler: (response: RazorpayPaymentResponse) => {
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
        },
        prefill: {
          name: metadata?.userName || '',
          email: metadata?.userEmail || '',
          contact: metadata?.userPhone || '',
        },
        theme: {
          color: '#9B59B6', // Primary color
        },
        notes: {
          type,
          userId: CURRENT_USER_ID,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
}

// Verify payment
export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  try {
    // In production, backend validates signature
    const verified = await mockAPI.verifyPayment(orderId, paymentId, signature);

    if (verified) {
      // Update transaction status
      const transactions = await subscriptionDB.getTransactions(CURRENT_USER_ID);
      const transaction = transactions.find(t => t.razorpayOrderId === orderId);

      if (transaction) {
        transaction.status = 'success';
        transaction.razorpayPaymentId = paymentId;
        transaction.razorpaySignature = signature;
        transaction.updatedAt = new Date().toISOString();
        await subscriptionDB.saveTransaction(transaction);
      }
    }

    return verified;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
}

// Complete credit purchase flow
export async function purchaseCredits(packageId: string): Promise<{
  success: boolean;
  credits?: number;
  error?: string;
}> {
  try {
    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!pkg) {
      return { success: false, error: 'Package not found' };
    }

    // Initiate payment
    const response = await initiatePayment(
      pkg.price,
      'credit_purchase',
      {
        packageId,
        credits: pkg.totalCredits,
      }
    );

    if (!response) {
      return { success: false, error: 'Payment cancelled' };
    }

    // Verify payment
    const verified = await verifyPayment(
      response.razorpay_order_id,
      response.razorpay_payment_id,
      response.razorpay_signature
    );

    if (!verified) {
      return { success: false, error: 'Payment verification failed' };
    }

    // Add credits to user balance
    const { addCredits } = await import('./creditService');
    await addCredits(pkg.totalCredits);

    return {
      success: true,
      credits: pkg.totalCredits,
    };
  } catch (error: any) {
    console.error('Credit purchase error:', error);
    return {
      success: false,
      error: error.message || 'Payment failed',
    };
  }
}

// Complete subscription purchase flow
export async function purchaseSubscription(
  planId: string,
  billingCycle: 'monthly' | 'yearly'
): Promise<{
  success: boolean;
  subscription?: any;
  error?: string;
}> {
  try {
    const { getSubscriptionPlans, createSubscription } = await import(
      './subscriptionService'
    );
    const plans = await getSubscriptionPlans();
    const plan = plans.find(p => p.id === planId);

    if (!plan) {
      return { success: false, error: 'Plan not found' };
    }

    const amount =
      billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

    // Initiate payment
    const response = await initiatePayment(
      amount,
      'subscription_purchase',
      {
        planId,
        billingCycle,
      }
    );

    if (!response) {
      return { success: false, error: 'Payment cancelled' };
    }

    // Verify payment
    const verified = await verifyPayment(
      response.razorpay_order_id,
      response.razorpay_payment_id,
      response.razorpay_signature
    );

    if (!verified) {
      return { success: false, error: 'Payment verification failed' };
    }

    // Create subscription
    const subscription = await createSubscription(planId, billingCycle);

    return {
      success: true,
      subscription,
    };
  } catch (error: any) {
    console.error('Subscription purchase error:', error);
    return {
      success: false,
      error: error.message || 'Payment failed',
    };
  }
}

// Mark payment as failed
export async function markPaymentFailed(
  orderId: string,
  error: string
): Promise<void> {
  const transactions = await subscriptionDB.getTransactions(CURRENT_USER_ID);
  const transaction = transactions.find(t => t.razorpayOrderId === orderId);

  if (transaction) {
    transaction.status = 'failed';
    transaction.metadata = {
      ...transaction.metadata,
      error,
    };
    transaction.updatedAt = new Date().toISOString();
    await subscriptionDB.saveTransaction(transaction);
  }
}
