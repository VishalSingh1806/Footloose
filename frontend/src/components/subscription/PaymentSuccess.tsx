import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Check, ArrowRight, Receipt } from 'lucide-react';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { creditBalance, refreshAll } = useSubscription();
  const state = location.state as any;

  useEffect(() => {
    // Refresh subscription data
    refreshAll();

    // Auto-navigate after 5 seconds
    const timer = setTimeout(() => {
      navigate('/credits');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const credits = state?.credits;
  const subscription = state?.subscription;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-[#2A9D8F] rounded-full flex items-center justify-center animate-scale-in shadow-lg">
            <Check size={48} className="text-white" strokeWidth={4} />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-[#1D3557] text-center mb-2">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-600 text-center mb-8">
          {credits
            ? 'Your credits have been added to your wallet.'
            : 'Your subscription is now active.'}
        </p>

        {/* Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          {credits && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Credits Added</p>
              <p className="text-4xl font-bold text-[#2A9D8F] mb-2">
                {credits.toLocaleString()}
              </p>
            </div>
          )}

          {subscription && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Subscription</p>
              <p className="text-2xl font-bold text-[#1D3557]">Premium</p>
              <p className="text-sm text-gray-600 mt-1">
                Billing: {subscription.billingCycle}
              </p>
            </div>
          )}

          {/* New Balance */}
          <div className="bg-[#2A9D8F]/10 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">New Balance</p>
            <p className="text-3xl font-bold text-[#2A9D8F]">
              {creditBalance.toLocaleString()} credits
            </p>
          </div>

          {/* Transaction Details */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Transaction ID: {state?.transactionId || 'N/A'}
            </p>
            <p className="text-xs text-gray-500">
              Date: {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="font-bold text-[#1D3557] mb-4">What You Can Do Now</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/matches')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <span className="font-semibold text-[#1D3557]">Find Matches</span>
              <ArrowRight size={20} className="text-gray-400" />
            </button>
            <button
              onClick={() => navigate('/speed-dates')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <span className="font-semibold text-[#1D3557]">Request Speed Dates</span>
              <ArrowRight size={20} className="text-gray-400" />
            </button>
            <button
              onClick={() => navigate('/messages')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <span className="font-semibold text-[#1D3557]">Unlock Chats</span>
              <ArrowRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/credits')}
            className="w-full bg-[#9B59B6] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#D62839] transition-colors"
          >
            Go to Wallet
          </button>

          <button
            onClick={() => navigate('/matches')}
            className="w-full bg-white text-[#1D3557] py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all border border-gray-200"
          >
            Start Exploring
          </button>
        </div>

        {/* Email Confirmation */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Receipt sent to your email
        </p>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
