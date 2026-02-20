import { useState } from 'react';
import { Star, Heart, MessageCircle, Flag, CheckCircle } from 'lucide-react';

interface PostCallFeedbackProps {
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  matchLocation: string;
  initialInterest?: boolean | null;
  onSubmit: (feedback: FeedbackData) => void;
  onSkip: () => void;
}

export interface FeedbackData {
  overallRating: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | null;
  wouldRecommend: 'yes' | 'maybe' | 'no' | null;
  followedGuidelines: boolean;
  interestLevel: 'interested' | 'maybe' | 'not_interested' | null;
  additionalComments: string;
  reportIssue: boolean;
  reportDetails: string;
}

function PostCallFeedback({
  matchName,
  matchAge,
  matchPhoto,
  matchLocation,
  initialInterest,
  onSubmit,
  onSkip,
}: PostCallFeedbackProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | null>(null);
  const [wouldRecommend, setWouldRecommend] = useState<'yes' | 'maybe' | 'no' | null>(null);
  const [followedGuidelines, setFollowedGuidelines] = useState(true);
  const [interestLevel, setInterestLevel] = useState<'interested' | 'maybe' | 'not_interested' | null>(
    initialInterest === true ? 'interested' : initialInterest === false ? 'not_interested' : null
  );
  const [additionalComments, setAdditionalComments] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = overallRating > 0 && followedGuidelines !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);

    const feedback: FeedbackData = {
      overallRating,
      connectionQuality,
      wouldRecommend,
      followedGuidelines,
      interestLevel,
      additionalComments,
      reportIssue: !followedGuidelines || showReportForm,
      reportDetails,
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSubmit(feedback);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAFA] overflow-y-auto">
      <div className="min-h-screen pb-24">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-[#1D3557]">Share Your Experience</h1>
          <p className="text-sm text-[#6C757D]">Help us improve matches for everyone</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-w-2xl mx-auto space-y-6">
          {/* Profile Reminder */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={matchPhoto}
                alt={matchName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-[#1D3557]">{matchName}, {matchAge}</h3>
                <p className="text-sm text-[#6C757D]">{matchLocation}</p>
              </div>
            </div>
          </div>

          {/* Question 1: Overall Rating */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-[#1D3557] mb-3">How was your speed date?</h3>
            <div className="flex justify-center gap-3 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setOverallRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    size={48}
                    className={
                      star <= (hoveredStar || overallRating)
                        ? 'fill-[#FFD700] text-[#FFD700]'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
            {overallRating > 0 && (
              <p className="text-center text-sm text-[#6C757D]">
                {overallRating === 5 && 'Excellent!'}
                {overallRating === 4 && 'Great!'}
                {overallRating === 3 && 'Good'}
                {overallRating === 2 && 'Could be better'}
                {overallRating === 1 && 'Not great'}
              </p>
            )}
          </div>

          {/* Question 2: Connection Quality */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-[#1D3557] mb-3">How was the connection quality?</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'excellent', label: 'Excellent', color: 'green' },
                { value: 'good', label: 'Good', color: 'blue' },
                { value: 'poor', label: 'Poor', color: 'red' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setConnectionQuality(option.value as any)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all
                    ${
                      connectionQuality === option.value
                        ? `bg-${option.color}-600 text-white`
                        : 'bg-gray-100 text-[#1D3557] hover:bg-gray-200'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Would Recommend */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-[#1D3557] mb-3">Would you recommend speed dating?</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'yes', label: 'Yes, definitely!' },
                { value: 'maybe', label: 'Maybe' },
                { value: 'no', label: 'No' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setWouldRecommend(option.value as any)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all
                    ${
                      wouldRecommend === option.value
                        ? 'bg-[#9B59B6] text-white'
                        : 'bg-gray-100 text-[#1D3557] hover:bg-gray-200'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Followed Guidelines */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-[#1D3557] mb-3">
              Was your match respectful and appropriate?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setFollowedGuidelines(true);
                  setShowReportForm(false);
                }}
                className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                  ${
                    followedGuidelines === true
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-[#1D3557] hover:bg-gray-200'
                  }`}
              >
                <CheckCircle size={20} />
                Yes
              </button>
              <button
                onClick={() => {
                  setFollowedGuidelines(false);
                  setShowReportForm(true);
                }}
                className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                  ${
                    followedGuidelines === false
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-[#1D3557] hover:bg-gray-200'
                  }`}
              >
                <Flag size={20} />
                No - Report Issue
              </button>
            </div>
          </div>

          {/* Report Form */}
          {showReportForm && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
              <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <Flag size={20} />
                Report Details
              </h3>
              <p className="text-sm text-red-800 mb-3">
                Please describe what happened. This will be reviewed immediately:
              </p>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:border-red-500
                           focus:outline-none resize-none bg-white"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-red-700 mt-2">
                Your report is confidential and will trigger immediate admin review.
              </p>
            </div>
          )}

          {/* Question 5: Interest Level (if not decided earlier) */}
          {interestLevel === null && (
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-[#1D3557] mb-3">
                Do you want to connect with {matchName}?
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setInterestLevel('interested')}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                    ${
                      interestLevel === 'interested'
                        ? 'bg-[#06D6A0] text-white'
                        : 'bg-gray-100 text-[#1D3557] hover:bg-gray-200'
                    }`}
                >
                  <Heart size={20} />
                  Yes, let's chat!
                </button>
                <button
                  onClick={() => setInterestLevel('maybe')}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all
                    ${
                      interestLevel === 'maybe'
                        ? 'bg-[#F77F00] text-white'
                        : 'bg-gray-100 text-[#1D3557] hover:bg-gray-200'
                    }`}
                >
                  Maybe later
                </button>
                <button
                  onClick={() => setInterestLevel('not_interested')}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all
                    ${
                      interestLevel === 'not_interested'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-[#1D3557] hover:bg-gray-200'
                    }`}
                >
                  Not interested
                </button>
              </div>
            </div>
          )}

          {/* Question 6: Additional Comments */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-[#1D3557] mb-3">
              Any other feedback? <span className="text-[#6C757D] font-normal">(Optional)</span>
            </h3>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#9B59B6]
                         focus:outline-none resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-[#6C757D] mt-1">{additionalComments.length}/500</p>
          </div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 z-10">
          <div className="max-w-2xl mx-auto space-y-3">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="w-full bg-[#9B59B6] text-white py-4 px-6 rounded-xl font-semibold text-base
                         hover:bg-[#D62839] active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#9B59B6]
                         flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button
              onClick={onSkip}
              className="w-full text-[#6C757D] hover:text-[#1D3557] font-medium py-2"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCallFeedback;
