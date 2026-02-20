import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, AlertCircle, RefreshCw, MessageCircle } from 'lucide-react';

export function PaymentFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const error = state?.error || 'Payment could not be completed';
  const packageId = state?.packageId;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <X size={48} className="text-white" strokeWidth={4} />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-red-600 text-center mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 text-center mb-8">
          We couldn't process your payment. Please try again.
        </p>

        {/* Error Details */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1D3557] mb-1">What happened?</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>

          {/* Transaction Info */}
          {state?.transactionId && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Transaction ID: {state.transactionId}
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
          )}
        </div>

        {/* Troubleshooting */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="font-bold text-[#1D3557] mb-3">Common Reasons:</h3>
          <ul className="space-y-2 text-sm text-gray-600 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Insufficient balance in your account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Bank declined the transaction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Incorrect card details or OTP</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Network timeout</span>
            </li>
          </ul>

          <h3 className="font-bold text-[#1D3557] mb-2">What to Do:</h3>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>Check your bank balance</li>
            <li>Verify card details are correct</li>
            <li>Try a different payment method</li>
            <li>Contact your bank if issue persists</li>
          </ol>
        </div>

        {/* Refund Info (if amount was deducted) */}
        {state?.amountDeducted && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 text-sm mb-1">
                  Amount Deducted?
                </p>
                <p className="text-xs text-amber-800">
                  If amount was deducted from your account, it will be refunded
                  within 5-7 business days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => {
              if (packageId) {
                navigate('/credits/purchase', { state: { packageId } });
              } else {
                navigate('/credits/purchase');
              }
            }}
            className="w-full bg-[#9B59B6] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#D62839] transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            <span>Try Again</span>
          </button>

          <button
            onClick={() => navigate('/credits/purchase')}
            className="w-full bg-white text-[#1D3557] py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all border border-gray-200"
          >
            Try Different Method
          </button>

          <button
            onClick={() => {
              // TODO: Open support chat
              alert('Support contact coming soon!');
            }}
            className="w-full text-[#2A9D8F] py-3 rounded-xl font-semibold hover:bg-[#2A9D8F]/10 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            <span>Contact Support</span>
          </button>

          <button
            onClick={() => navigate('/credits')}
            className="w-full text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Back to Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
