/**
 * Delete Account Component
 * Permanent account deletion flow with 30-day grace period
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { requestAccountDeletion } from '../../services/settingsService';

const DELETION_REASONS = [
  { value: 'found_match', label: 'Found what I was looking for 🎉' },
  { value: 'no_quality_matches', label: 'Not getting quality matches' },
  { value: 'too_expensive', label: 'Too expensive' },
  { value: 'privacy_concerns', label: 'Privacy concerns' },
  { value: 'met_someone_outside', label: 'Met someone outside the app' },
  { value: 'not_ready', label: 'Not ready for a relationship' },
  { value: 'technical_issues', label: 'Technical issues' },
  { value: 'better_alternative', label: 'Better alternative found' },
  { value: 'time_consuming', label: 'Too time-consuming' },
  { value: 'other', label: 'Other' },
];

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleDelete = async () => {
    if (!agreedToTerms || !password || selectedReasons.length === 0) {
      return;
    }

    try {
      setIsDeleting(true);
      const deletionRequest = await requestAccountDeletion(
        selectedReasons,
        additionalFeedback
      );
      setShowConfirmation(true);
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to schedule account deletion. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (showConfirmation) {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 30);
    const formattedDate = scheduledDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Account Deletion Scheduled
          </h2>
          <div className="text-gray-600 space-y-3 mb-6">
            <p>
              Your account will be permanently deleted on{' '}
              <span className="font-semibold text-gray-900">{formattedDate}</span>{' '}
              (30 days from now).
            </p>
            <p className="text-sm">
              Changed your mind? Log in before {formattedDate} to cancel deletion.
            </p>
            <p className="text-sm">
              We've sent a confirmation email to your registered email address.
            </p>
          </div>
          <button
            onClick={() => {
              // Logout and redirect
              window.location.href = '/';
            }}
            className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="flex-1 text-xl font-bold text-gray-900 ml-2">
            Delete Account
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Warning */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <AlertTriangle size={48} className="text-red-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Delete Your Account?
          </h2>
          <p className="text-red-800 font-semibold">
            This action cannot be undone
          </p>
        </div>

        {/* What Will Be Deleted */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">What will be deleted:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✓</span>
              <span>Your profile and photos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✓</span>
              <span>All matches and connections</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✓</span>
              <span>Message history</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✓</span>
              <span>Speed date history</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✓</span>
              <span>Unused credits (no refund)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✓</span>
              <span>Subscription (no prorated refund)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✓</span>
              <span>All personal data</span>
            </li>
          </ul>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>30-day grace period:</strong> You can cancel deletion by
              logging in within 30 days. After that, all data is permanently removed.
            </p>
          </div>
        </div>

        {/* Reason Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">
            Help us understand why you're leaving
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Select all that apply (required)
          </p>
          <div className="space-y-2">
            {DELETION_REASONS.map((reason) => (
              <label
                key={reason.value}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedReasons.includes(reason.value)}
                  onChange={() => toggleReason(reason.value)}
                  className="w-5 h-5 text-[#E63946] rounded border-gray-300 focus:ring-[#E63946]"
                />
                <span className="text-gray-700">{reason.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional feedback (optional)
            </label>
            <textarea
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              placeholder="Tell us more..."
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {additionalFeedback.length}/500
            </p>
          </div>
        </div>

        {/* Alternatives */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Before You Go...</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/settings/account')}
              className="w-full p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
            >
              <div className="font-semibold text-gray-900 mb-1">
                Temporarily Deactivate Instead
              </div>
              <div className="text-sm text-gray-600">
                Hide your profile and come back anytime
              </div>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-full p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
            >
              <div className="font-semibold text-gray-900 mb-1">
                Pause Profile
              </div>
              <div className="text-sm text-gray-600">
                Take a break without deleting
              </div>
            </button>
            <button
              onClick={() => navigate('/settings/support')}
              className="w-full p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
            >
              <div className="font-semibold text-gray-900 mb-1">
                Talk to Support
              </div>
              <div className="text-sm text-gray-600">
                Having issues? Let us help
              </div>
            </button>
          </div>
        </div>

        {/* Final Confirmation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-[#E63946] rounded border-gray-300 focus:ring-[#E63946]"
              />
              <span className="text-sm text-gray-700">
                I understand this action is permanent and cannot be undone after 30 days
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your password to confirm
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-4 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel Deletion
          </button>
          <button
            onClick={handleDelete}
            disabled={
              !agreedToTerms ||
              !password ||
              selectedReasons.length === 0 ||
              isDeleting
            }
            className="flex-1 py-4 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Permanently Delete My Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
