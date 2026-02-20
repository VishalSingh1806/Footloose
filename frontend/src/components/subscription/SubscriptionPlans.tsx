import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { ChevronLeft, Crown, Check, X } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../services/mockAPI';
import { purchaseSubscription } from '../../services/paymentService';

export function SubscriptionPlans() {
  const navigate = useNavigate();
  const { subscription, isPremium, refreshSubscription } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [purchasing, setPurchasing] = useState(false);

  const freePlan = SUBSCRIPTION_PLANS.find(p => p.id === 'free');
  const premiumPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'premium');

  const handleUpgrade = async () => {
    if (!premiumPlan) return;

    setPurchasing(true);

    try {
      const result = await purchaseSubscription(premiumPlan.id, billingCycle);

      if (result.success) {
        navigate('/payment/success', {
          state: {
            subscription: result.subscription,
            billingCycle,
          },
        });
        refreshSubscription();
      } else {
        navigate('/payment/failed', {
          state: {
            error: result.error,
          },
        });
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      navigate('/payment/failed', {
        state: {
          error: error.message || 'Payment failed',
        },
      });
    } finally {
      setPurchasing(false);
    }
  };

  const monthlyPrice = billingCycle === 'monthly'
    ? premiumPlan?.monthlyPrice
    : Math.round((premiumPlan?.yearlyPrice || 0) / 12);

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
          <h1 className="text-xl font-bold text-[#1D3557] ml-3">Choose Your Plan</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <span
            className={`text-sm sm:text-base font-semibold ${
              billingCycle === 'monthly' ? 'text-[#1D3557]' : 'text-gray-400'
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-7 sm:w-14 sm:h-8 bg-[#9B59B6] rounded-full relative transition-colors"
          >
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full absolute top-1 transition-all ${
                billingCycle === 'yearly' ? 'right-1' : 'left-1'
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm sm:text-base font-semibold ${
                billingCycle === 'yearly' ? 'text-[#1D3557]' : 'text-gray-400'
              }`}
            >
              Yearly
            </span>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Save 20%
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Free Plan */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border-2 border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1D3557] mb-2">Free</h3>
            <div className="text-3xl sm:text-4xl font-bold text-gray-400 mb-3 sm:mb-4">₹0</div>

            {isPremium === false && (
              <div className="inline-block bg-gray-100 text-gray-600 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Current Plan
              </div>
            )}

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {freePlan?.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                </div>
              ))}
              <div className="flex items-start gap-2">
                <X size={18} className="text-gray-300 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm text-gray-400">Send unlimited interests</span>
              </div>
              <div className="flex items-start gap-2">
                <X size={18} className="text-gray-300 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm text-gray-400">Speed dates (pay per use)</span>
              </div>
              <div className="flex items-start gap-2">
                <X size={18} className="text-gray-300 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm text-gray-400">See who liked you</span>
              </div>
            </div>

            {!isPremium && (
              <button className="w-full py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-600">
                Current Plan
              </button>
            )}
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-[#FFF9E5] to-[#FEF3C7] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border-2 border-[#8E44AD] relative">
            <div className="absolute -top-2 sm:-top-3 right-4 sm:right-6 bg-[#9B59B6] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 rounded-full">
              POPULAR
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Crown size={24} className="text-[#8E44AD] sm:w-7 sm:h-7" fill="currentColor" />
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D3557]">Premium</h3>
            </div>

            <div className="mb-2">
              <span className="text-3xl sm:text-4xl font-bold text-[#1D3557]">₹{monthlyPrice}</span>
              <span className="text-base sm:text-lg text-gray-600">/month</span>
            </div>

            {billingCycle === 'yearly' && (
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Billed annually: ₹{premiumPlan?.yearlyPrice}
              </p>
            )}

            {isPremium && (
              <div className="inline-block bg-[#2A9D8F] text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Your Plan
              </div>
            )}

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {premiumPlan?.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check size={18} className="text-[#2A9D8F] flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* Value Calculation */}
            <div className="bg-white/50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm font-semibold text-[#1D3557] mb-1">
                Worth ₹2000+ in credits + features
              </p>
              <p className="text-xs text-gray-600">
                Save up to 60% vs pay-per-use
              </p>
            </div>

            {isPremium ? (
              <button
                onClick={() => navigate('/subscription/manage')}
                className="w-full bg-[#1D3557] text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:bg-[#0F1D2E] transition-colors"
              >
                Manage Subscription
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={purchasing}
                className="w-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {purchasing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Upgrade to Premium</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="bg-white rounded-xl p-4 shadow-md text-center mb-6">
          <p className="text-lg font-semibold text-[#1D3557] mb-1">
            😊 7-Day Money-Back Guarantee
          </p>
          <p className="text-sm text-gray-600">
            Try Premium risk-free. Cancel anytime.
          </p>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#1D3557] mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-sm text-[#1D3557] mb-1">
                Can I cancel anytime?
              </p>
              <p className="text-sm text-gray-600">
                Yes, cancel anytime. No questions asked.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm text-[#1D3557] mb-1">
                What happens to unused credits?
              </p>
              <p className="text-sm text-gray-600">
                Credits roll over month-to-month. They never expire.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm text-[#1D3557] mb-1">
                Can I switch from monthly to yearly?
              </p>
              <p className="text-sm text-gray-600">
                Yes, upgrade anytime. Get prorated refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
