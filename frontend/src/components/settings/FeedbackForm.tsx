/**
 * Feedback Form Component
 * User feedback submission with type dropdown, star rating, and description
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Star, CheckCircle } from 'lucide-react';
import { submitFeedback } from '../../services/settingsService';
import type { FeedbackType, FeedbackData } from '../../types/settings';

const FEEDBACK_TYPES: { value: FeedbackType; label: string; description: string }[] = [
  {
    value: 'bug_report',
    label: 'Bug Report',
    description: 'Report a technical issue or error',
  },
  {
    value: 'feature_request',
    label: 'Feature Request',
    description: 'Suggest a new feature or improvement',
  },
  {
    value: 'user_experience',
    label: 'User Experience',
    description: 'Share feedback about your experience',
  },
  {
    value: 'performance_issue',
    label: 'Performance Issue',
    description: 'Report slow loading or lag',
  },
  {
    value: 'design_feedback',
    label: 'Design Feedback',
    description: 'Feedback about the app design',
  },
  {
    value: 'general_feedback',
    label: 'General Feedback',
    description: 'Any other feedback or suggestions',
  },
];

export default function FeedbackForm() {
  const navigate = useNavigate();
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general_feedback');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [contactAllowed, setContactAllowed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert('Please provide your feedback details');
      return;
    }

    const feedbackData: FeedbackData = {
      type: feedbackType,
      description: description.trim(),
      rating: rating > 0 ? rating : undefined,
      contactAllowed,
    };

    try {
      setIsSubmitting(true);
      await submitFeedback(feedbackData);
      setShowSuccess(true);
      // Reset form
      setTimeout(() => {
        setShowSuccess(false);
        setFeedbackType('general_feedback');
        setRating(0);
        setDescription('');
        setContactAllowed(true);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Rate your experience';
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate your input in helping us
            improve Footloose No More.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 px-4 bg-[#9B59B6] text-white rounded-lg font-semibold hover:bg-[#d62839] transition-colors"
          >
            Back to Settings
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
          <h1 className="flex-1 text-xl font-bold text-gray-900 ml-2">Send Feedback</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Feedback Info */}
        <div className="bg-gradient-to-r from-[#9B59B6] to-[#d62839] rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">We Value Your Feedback</h2>
          <p className="text-sm text-white text-opacity-90">
            Help us improve Footloose No More by sharing your thoughts, suggestions, or reporting
            issues. Your feedback shapes our future!
          </p>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-6">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Type <span className="text-red-500">*</span>
            </label>
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
            >
              {FEEDBACK_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {FEEDBACK_TYPES.find((t) => t.value === feedbackType)?.description}
            </p>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your experience? (Optional)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'fill-[#9B59B6] text-[#9B59B6]'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-[#9B59B6] mt-2">
              {getRatingText(hoverRating || rating)}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell us more <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Share your ${
                feedbackType === 'bug_report'
                  ? 'bug details, steps to reproduce, and what you expected to happen'
                  : feedbackType === 'feature_request'
                  ? 'feature idea and how it would help you'
                  : feedbackType === 'performance_issue'
                  ? 'performance issues, when they occur, and on what device'
                  : 'thoughts, suggestions, or concerns'
              }...`}
              rows={8}
              maxLength={2000}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent resize-none"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">Be as detailed as possible</p>
              <p className="text-xs text-gray-500">
                {description.length}/2000
              </p>
            </div>
          </div>

          {/* Contact Permission */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={contactAllowed}
                onChange={(e) => setContactAllowed(e.target.checked)}
                className="mt-1 w-5 h-5 text-[#9B59B6] focus:ring-[#9B59B6] rounded"
              />
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Allow us to contact you
                </div>
                <div className="text-sm text-gray-600">
                  We may reach out if we need more details about your feedback. Your contact
                  information from your profile will be used.
                </div>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !description.trim()}
            className="w-full py-3 px-4 bg-[#9B59B6] text-white rounded-lg font-semibold hover:bg-[#d62839] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send size={20} />
                Submit Feedback
              </>
            )}
          </button>
        </div>

        {/* Privacy Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Your Privacy</h3>
          <p className="text-sm text-gray-600">
            Your feedback is confidential and used solely to improve our service. We never share
            your feedback with third parties. See our{' '}
            <button
              onClick={() => navigate('/settings/terms-and-privacy')}
              className="text-[#9B59B6] font-medium underline"
            >
              Privacy Policy
            </button>{' '}
            for more details.
          </p>
        </div>

        {/* Feedback Types Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">What to Include</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-900">Bug Reports:</span> Describe what
              happened, what you expected, steps to reproduce, and device/OS information.
            </div>
            <div>
              <span className="font-medium text-gray-900">Feature Requests:</span> Explain the
              feature, why it would be useful, and how you envision it working.
            </div>
            <div>
              <span className="font-medium text-gray-900">Performance Issues:</span> Note what's
              slow, when it happens, and your internet connection type.
            </div>
            <div>
              <span className="font-medium text-gray-900">General Feedback:</span> Share any
              thoughts about the app - what you love, what could be better, or ideas for
              improvement.
            </div>
          </div>
        </div>

        {/* Alternative Contact */}
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Need Direct Support?</h3>
          <p className="text-sm text-gray-600 mb-4">
            For urgent issues or account problems, please contact our support team directly.
          </p>
          <button
            onClick={() => navigate('/settings/contact-support')}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
