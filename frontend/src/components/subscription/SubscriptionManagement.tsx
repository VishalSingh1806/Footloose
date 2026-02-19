import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { ChevronLeft, Crown, CreditCard, Receipt, AlertCircle } from 'lucide-react';
import { updateAutoRenew } from '../../services/subscriptionService';

export function SubscriptionManagement() {
  const navigate = useNavigate();
  const { subscription, refreshSubscription } = useSubscription();
  const [autoRenew, setAutoRenew] = useState(subscription?.autoRenew || false);
  const [updating, setUpdating] = useState(false);

  if (!subscription) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No active subscription</p>
          <button
            onClick={() => navigate('/subscription')}
            className="bg-[#E63946] text-white px-6 py-3 rounded-lg font-semibold"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  const handleToggleAutoRenew = async () => {
    setUpdating(true);
    try {
      const newValue = !autoRenew;
      const success = await updateAutoRenew(newValue);
      if (success) {
        setAutoRenew(newValue);
        refreshSubscription();
      }
    } catch (error) {
      console.error('Error updating auto-renew:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const daysUntilRenewal = subscription.nextBillingDate
    ? Math.ceil(
        (new Date(subscription.nextBillingDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-[#1D3557]" />
          </button>
          <h1 className="text-xl font-bold text-[#1D3557] ml-3">Manage Subscription</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Current Plan Card */}
        <div className="bg-gradient-to-br from-[#FFF9E5] to-[#FEF3C7] rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-[#F4A261] rounded-full flex items-center justify-center">
              <Crown size={28} className="text-white" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1D3557]">Premium Plan</h2>
              <span className="inline-block bg-[#2A9D8F] text-white text-xs font-semibold px-2 py-1 rounded-full">
                Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Started</p>
              <p className="font-semibold text-[#1D3557]">
                {formatDate(subscription.startDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Billing Cycle</p>
              <p className="font-semibold text-[#1D3557] capitalize">
                {subscription.billingCycle}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Next Billing</p>
              <p className="font-semibold text-[#1D3557]">
                {formatDate(subscription.nextBillingDate || subscription.endDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Amount</p>
              <p className="font-semibold text-[#1D3557]">
                ₹{subscription.billingCycle === 'monthly' ? '999' : '9588'}
              </p>
            </div>
          </div>

          {daysUntilRenewal <= 7 && daysUntilRenewal > 0 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Your subscription renews in {daysUntilRenewal}{' '}
                {daysUntilRenewal === 1 ? 'day' : 'days'}
              </p>
            </div>
          )}
        </div>

        {/* Monthly Credits */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="font-bold text-[#1D3557] mb-3">Monthly Credits</h3>
          <p className="text-sm text-gray-600 mb-2">
            You get <span className="font-semibold text-[#2A9D8F]">1000 credits</span> every
            month as part of your premium subscription.
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Last added:</span>
            <span className="font-semibold text-[#1D3557]">
              {formatDate(subscription.startDate)}
            </span>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="font-bold text-[#1D3557] mb-4">Settings</h3>

          {/* Auto-Renew Toggle */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <p className="font-semibold text-[#1D3557] mb-1">Auto-renewal</p>
              <p className="text-sm text-gray-600">
                Automatically renew subscription
              </p>
            </div>
            <button
              onClick={handleToggleAutoRenew}
              disabled={updating}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                autoRenew ? 'bg-[#2A9D8F]' : 'bg-gray-300'
              } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${
                  autoRenew ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Payment Method */}
          <div className="py-4 border-b border-gray-200">
            <p className="font-semibold text-[#1D3557] mb-2">Payment Method</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <CreditCard size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1D3557]">UPI</p>
                <p className="text-xs text-gray-600">****@okaxis</p>
              </div>
            </div>
            <button className="text-sm text-[#E63946] font-semibold mt-2 hover:underline">
              Update Payment Method
            </button>
          </div>

          {/* Billing History */}
          <div className="pt-4">
            <button
              onClick={() => navigate('/transactions')}
              className="flex items-center justify-between w-full text-left"
            >
              <div>
                <p className="font-semibold text-[#1D3557] mb-1">Billing History</p>
                <p className="text-sm text-gray-600">View all invoices and receipts</p>
              </div>
              <Receipt size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Premium Benefits Reminder */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="font-bold text-[#1D3557] mb-3">Your Premium Benefits</h3>
          <div className="space-y-2">
            {[
              '1000 credits monthly',
              '50% off extra credits',
              'See who liked you',
              'Unlimited likes',
              'Profile boost 3x/month',
              'Priority support',
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#2A9D8F] rounded-full" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/subscription')}
            className="w-full bg-white text-[#1D3557] py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all border border-gray-200"
          >
            Change Plan
          </button>

          <button
            onClick={() => navigate('/subscription/cancel')}
            className="w-full text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}
