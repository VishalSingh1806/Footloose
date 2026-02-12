import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { X, AlertTriangle, Check } from 'lucide-react';
import { cancelSubscription as cancelSubscriptionService } from '../../services/subscriptionService';

type CancellationStep = 'confirm' | 'reason' | 'retention' | 'final' | 'success';

export function CancelSubscription() {
  const navigate = useNavigate();
  const { subscription, refreshSubscription } = useSubscription();
  const [step, setStep] = useState<CancellationStep>('confirm');
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const reasons = [
    'Too expensive',
    'Not getting enough matches',
    'Found what I was looking for',
    'Not using the app enough',
    'Technical issues',
    'Better alternative available',
    'Privacy concerns',
    'Other',
  ];

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const success = await cancelSubscriptionService(feedback || reason);
      if (success) {
        setStep('success');
        refreshSubscription();
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setCancelling(false);
    }
  };

  const getRetentionOffer = () => {
    switch (reason) {
      case 'Too expensive':
        return {
          title: 'Get 3 months at 40% off',
          description: 'Just ₹599/month instead of ₹999',
          action: 'Accept Offer',
        };
      case 'Not getting enough matches':
        return {
          title: "We'll boost your profile for 30 days",
          description: 'Free profile boost to help you get more visibility',
          action: 'Try Boost',
        };
      case 'Not using the app enough':
        return {
          title: 'Pause subscription for 1 month',
          description: 'Come back when ready. Credits will not expire.',
          action: 'Pause Instead',
        };
      default:
        return null;
    }
  };

  const retentionOffer = getRetentionOffer();

  const renderContent = () => {
    switch (step) {
      case 'confirm':
        return (
          <div>
            <div className="flex items-start gap-3 mb-6">
              <AlertTriangle size={24} className="text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-[#1D3557] mb-2">
                  Cancel Subscription?
                </h2>
                <p className="text-gray-600">
                  We're sorry to see you go. Are you sure you want to cancel?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-[#1D3557] mb-2">
                What happens when you cancel:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>You'll keep premium features until {new Date(subscription?.endDate || '').toLocaleDateString()}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>Your credits won't expire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>You can resubscribe anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>No refund for current month</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setStep('reason')}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                Continue to Cancel
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-gray-100 text-[#1D3557] py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Keep Premium
              </button>
            </div>
          </div>
        );

      case 'reason':
        return (
          <div>
            <h2 className="text-2xl font-bold text-[#1D3557] mb-2">
              Help us understand why
            </h2>
            <p className="text-gray-600 mb-6">
              Your feedback helps us improve Footloose No More
            </p>

            <div className="space-y-2 mb-6">
              {reasons.map(r => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    reason === r
                      ? 'border-[#E63946] bg-[#FFF5F5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold text-[#1D3557]">{r}</span>
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Additional feedback (optional)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#E63946] mb-6"
              rows={3}
            />

            <div className="space-y-3">
              <button
                onClick={() => {
                  if (retentionOffer && reason !== 'Found what I was looking for') {
                    setStep('retention');
                  } else {
                    setStep('final');
                  }
                }}
                disabled={!reason}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue
              </button>
              <button
                onClick={() => setStep('confirm')}
                className="w-full text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        );

      case 'retention':
        return (
          <div>
            {reason === 'Found what I was looking for' ? (
              <div>
                <div className="text-6xl text-center mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-[#1D3557] text-center mb-2">
                  Congratulations!
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  We're thrilled you found your match!
                </p>
              </div>
            ) : retentionOffer ? (
              <div>
                <h2 className="text-2xl font-bold text-[#1D3557] mb-2">
                  Wait! We have an offer
                </h2>
                <p className="text-gray-600 mb-6">
                  Before you go, how about this special offer?
                </p>

                <div className="bg-gradient-to-br from-[#FFF9E5] to-[#FEF3C7] rounded-xl p-6 mb-6 border-2 border-[#F4A261]">
                  <h3 className="text-xl font-bold text-[#1D3557] mb-2">
                    {retentionOffer.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{retentionOffer.description}</p>
                  <button className="w-full bg-[#E63946] text-white py-3 rounded-lg font-bold hover:bg-[#D62839] transition-colors">
                    {retentionOffer.action}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              <button
                onClick={() => setStep('final')}
                className="w-full text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                No thanks, cancel subscription
              </button>
            </div>
          </div>
        );

      case 'final':
        return (
          <div>
            <h2 className="text-2xl font-bold text-[#1D3557] mb-2">
              Confirm Cancellation
            </h2>
            <p className="text-gray-600 mb-6">
              Are you absolutely sure you want to cancel?
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                Final reminder:
              </p>
              <ul className="space-y-1 text-sm text-amber-800">
                <li>• Subscription ends on {new Date(subscription?.endDate || '').toLocaleDateString()}</li>
                <li>• You'll keep premium features until then</li>
                <li>• No refund for this month's payment</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-[#E63946] text-white py-4 rounded-xl font-bold hover:bg-[#D62839] transition-colors"
              >
                Keep Premium
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full bg-white text-red-600 py-4 rounded-xl font-semibold hover:bg-red-50 transition-colors border-2 border-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  'Yes, Cancel Subscription'
                )}
              </button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} className="text-gray-600" />
            </div>

            <h2 className="text-2xl font-bold text-[#1D3557] mb-2">
              Subscription Canceled
            </h2>
            <p className="text-gray-600 mb-6">
              Your premium access continues until{' '}
              {new Date(subscription?.endDate || '').toLocaleDateString()}
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                After that, you'll switch to the free plan. Your credits will remain in your account.
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Thanks for your feedback. We'll use it to improve.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-[#E63946] text-white py-4 rounded-xl font-bold hover:bg-[#D62839] transition-colors"
              >
                Back to Profile
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="w-full text-[#2A9D8F] py-3 rounded-xl font-semibold hover:bg-[#2A9D8F]/10 transition-colors"
              >
                Changed your mind? Reactivate Premium
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#1D3557]">
            {step === 'success' ? 'Subscription Canceled' : 'Cancel Subscription'}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
