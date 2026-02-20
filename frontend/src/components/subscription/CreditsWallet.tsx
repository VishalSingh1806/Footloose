import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Coins, Plus, Receipt, TrendingUp, Crown, HelpCircle } from 'lucide-react';
import { CreditBadge } from './shared/CreditBadge';
import { CREDIT_PACKAGES } from '../../services/mockAPI';
import { getUsageBreakdown } from '../../services/creditService';

export function CreditsWallet() {
  const navigate = useNavigate();
  const { creditBalance, subscription, isPremium, loading, refreshBalance } =
    useSubscription();
  const [usageData, setUsageData] = useState<any>(null);

  useEffect(() => {
    loadUsageData();
  }, []);

  const loadUsageData = async () => {
    const data = await getUsageBreakdown(7); // Last 7 days
    setUsageData(data);
  };

  const formatRenewalDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9B59B6] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-[#9B59B6] to-[#8E44AD] rounded-b-3xl p-4 sm:p-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-2xl font-bold text-white">Credits & Subscription</h1>
            <button
              onClick={() => {/* TODO: Open help/FAQ */}}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
            >
              <HelpCircle size={20} className="text-white sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Balance Display */}
          <div className="text-center mb-4 sm:mb-6">
            <Coins size={40} className="text-white mx-auto mb-2 sm:mb-3 sm:w-12 sm:h-12" />
            <div className="text-4xl sm:text-5xl font-bold text-white mb-1 sm:mb-2">
              {creditBalance.toLocaleString()}
            </div>
            <p className="text-white/90 text-base sm:text-lg">Available Credits</p>
          </div>

          {/* Subscription Status */}
          <div className="text-center mb-6">
            {isPremium && subscription ? (
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-2">
                  <Crown size={20} className="text-yellow-300" fill="currentColor" />
                  <span className="text-white font-semibold">Premium Member</span>
                </div>
                <p className="text-white/80 text-sm">
                  Renews on {formatRenewalDate(subscription.nextBillingDate)}
                </p>
              </div>
            ) : (
              <button
                onClick={() => navigate('/subscription')}
                className="text-white underline font-semibold hover:text-white/80 transition-colors"
              >
                Upgrade to Premium →
              </button>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={() =>
              navigate(isPremium ? '/credits/purchase' : '/subscription')
            }
            className="w-full bg-white text-[#9B59B6] py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            {isPremium ? 'Add More Credits' : 'Get Premium'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-[#1D3557] mb-3 sm:mb-4 px-2">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Buy Credits */}
            <button
              onClick={() => navigate('/credits/purchase')}
              className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all border border-[#E5E7EB]"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#9B59B6]/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Plus size={20} className="text-[#9B59B6] sm:w-6 sm:h-6" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#1D3557] mb-1">Buy Credits</p>
              <p className="text-xs text-gray-600">Starting at ₹199</p>
            </button>

            {/* Upgrade to Premium */}
            {!isPremium && (
              <button
                onClick={() => navigate('/subscription')}
                className="bg-gradient-to-br from-[#FFF9E5] to-[#FEF3C7] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all border-2 border-[#8E44AD]"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8E44AD]/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Crown size={20} className="text-[#8E44AD] sm:w-6 sm:h-6" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#1D3557] mb-1">Go Premium</p>
                <p className="text-xs text-gray-600">1000 credits/month</p>
              </button>
            )}

            {/* View History */}
            <button
              onClick={() => navigate('/transactions')}
              className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all border border-[#E5E7EB]"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2A9D8F]/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Receipt size={20} className="text-[#2A9D8F] sm:w-6 sm:h-6" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#1D3557] mb-1">Transactions</p>
              <p className="text-xs text-gray-600">See all activity</p>
            </button>
          </div>
        </div>

        {/* Usage Overview */}
        {usageData && usageData.totalCredits > 0 && (
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#1D3557]">Where Your Credits Go</h2>
              <button
                onClick={() => navigate('/credits/usage')}
                className="text-sm text-[#9B59B6] font-semibold hover:underline"
              >
                View Details →
              </button>
            </div>

            {/* Simple bar chart */}
            <div className="space-y-3">
              {Object.entries(usageData.breakdown).map(([type, data]: [string, any]) => {
                const percentage = ((data.credits / usageData.totalCredits) * 100).toFixed(0);
                const label = type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                return (
                  <div key={type}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="text-sm font-bold text-[#1D3557]">
                        {data.credits} credits
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[#9B59B6] h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-500 mt-4">Last 7 days</p>
          </div>
        )}

        {/* Credit Packages Preview */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-[#1D3557] mb-3 sm:mb-4 px-2">Need More Credits?</h2>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 px-2 -mx-2 sm:-mx-4 scrollbar-hide">
            {CREDIT_PACKAGES.slice(0, 3).map(pkg => (
              <div
                key={pkg.id}
                onClick={() => navigate('/credits/purchase')}
                className="flex-none w-56 sm:w-64 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all border-2 border-[#E5E7EB] hover:border-[#9B59B6] cursor-pointer"
              >
                {pkg.popular && (
                  <div className="inline-block bg-[#9B59B6] text-white text-xs font-bold px-2 py-1 rounded-full mb-2">
                    POPULAR
                  </div>
                )}
                <div className="text-2xl sm:text-3xl font-bold text-[#1D3557] mb-1">
                  {pkg.totalCredits}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">{pkg.credits} credits
                  {pkg.bonusCredits > 0 && (
                    <span className="text-green-600"> +{pkg.bonusCredits} bonus</span>
                  )}
                </p>
                <div className="text-xl sm:text-2xl font-bold text-[#9B59B6] mb-2">₹{pkg.price}</div>
                <p className="text-xs text-gray-500 mb-3">
                  ~{Math.floor(pkg.totalCredits / 200)} Speed Dates
                </p>
                <button className="w-full bg-[#9B59B6] text-white py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#D62839] transition-colors">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Teaser */}
        {!isPremium && (
          <div
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-br from-[#FFF9E5] via-[#FEF3C7] to-[#FDE68A] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all mb-6 sm:mb-8"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#8E44AD] rounded-full flex items-center justify-center flex-shrink-0">
                <Crown size={24} className="text-white sm:w-7 sm:h-7" fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#1D3557] mb-2">Go Premium</h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-3">
                  Get 1000 credits every month + exclusive benefits
                </p>
                <div className="space-y-1 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-[#2A9D8F] rounded-full flex-shrink-0" />
                    <span>1000 credits monthly</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-[#2A9D8F] rounded-full flex-shrink-0" />
                    <span>50% off additional credits</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-[#2A9D8F] rounded-full flex-shrink-0" />
                    <span>See who liked you</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <span className="text-xl sm:text-2xl font-bold text-[#1D3557]">₹999/month</span>
                  <button className="bg-[#9B59B6] text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#D62839] transition-colors whitespace-nowrap">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
