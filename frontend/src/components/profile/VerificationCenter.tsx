import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  Camera,
  FileText,
  Phone,
  Mail,
  Award,
  AlertCircle,
} from 'lucide-react';
import { VerificationInfo } from '../../types/profile';

interface VerificationCenterProps {
  verification: VerificationInfo;
  trustScore: number;
  onUpdate?: () => void;
}

export function VerificationCenter({
  verification,
  trustScore,
  onUpdate,
}: VerificationCenterProps) {
  const navigate = useNavigate();
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [showPhotoVerification, setShowPhotoVerification] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-600" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <AlertCircle size={20} className="text-gray-600" />;
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const handleDocumentUpload = async (type: 'id' | 'income' | 'education') => {
    setUploadingDoc(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploadingDoc(false);
    onUpdate?.();
  };

  const verificationItems = [
    {
      id: 'phone',
      icon: Phone,
      title: 'Phone Number',
      description: 'Verify your mobile number via OTP',
      status: verification.phoneVerified ? 'verified' : 'not_started',
      required: true,
    },
    {
      id: 'email',
      icon: Mail,
      title: 'Email Address',
      description: 'Verify your email address',
      status: verification.emailVerified ? 'verified' : 'not_started',
      required: true,
    },
    {
      id: 'photo',
      icon: Camera,
      title: 'Photo Verification',
      description: 'Verify your identity with a selfie',
      status: verification.photoVerified ? 'verified' : 'not_started',
      required: true,
    },
    {
      id: 'id',
      icon: FileText,
      title: 'ID Verification',
      description: 'Upload government-issued ID',
      status: verification.idVerified ? 'verified' : 'not_started',
      required: false,
    },
    {
      id: 'income',
      icon: FileText,
      title: 'Income Verification',
      description: 'Upload salary slip or IT return',
      status: verification.incomeVerified ? 'verified' : 'not_started',
      required: false,
    },
    {
      id: 'education',
      icon: Award,
      title: 'Education Verification',
      description: 'Upload degree or certificate',
      status: verification.educationVerified ? 'verified' : 'not_started',
      required: false,
    },
  ];

  const completedVerifications = verificationItems.filter(
    item => item.status === 'verified'
  ).length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-[#1D3557]" />
          </button>
          <h1 className="text-xl font-bold text-[#1D3557]">Verification & Trust</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Trust Score */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1D3557]">
                  Trust Score
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  {getTrustScoreLabel(trustScore)}
                </p>
              </div>
            </div>
            <div className={`text-3xl sm:text-4xl font-bold ${getTrustScoreColor(trustScore)}`}>
              {trustScore}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
              style={{ width: `${trustScore}%` }}
            />
          </div>

          <p className="text-xs sm:text-sm text-gray-600 mt-3">
            Complete verifications to increase your trust score and get better matches
          </p>
        </div>

        {/* Completion Progress */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-[#1D3557]">
              Verification Progress
            </h3>
            <span className="text-sm font-semibold text-[#9B59B6]">
              {completedVerifications}/{verificationItems.length}
            </span>
          </div>

          <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#9B59B6] transition-all duration-500"
              style={{
                width: `${(completedVerifications / verificationItems.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Why Verify */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Benefits of Verification
              </p>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                <li>• 5x more profile views</li>
                <li>• Priority in search results</li>
                <li>• Higher match quality</li>
                <li>• Build trust with potential matches</li>
                <li>• Access to verified-only matches</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Verification Items */}
        <div className="space-y-3">
          {verificationItems.map((item) => {
            const Icon = item.icon;
            const isVerified = item.status === 'verified';

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'photo') {
                    setShowPhotoVerification(true);
                  }
                }}
                className={`w-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all border-2 ${
                  isVerified ? 'border-green-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isVerified ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  >
                    <Icon size={20} className={isVerified ? 'text-green-600' : 'text-gray-600'} />
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm sm:text-base font-bold text-[#1D3557]">
                        {item.title}
                      </h4>
                      {item.required && (
                        <span className="px-2 py-0.5 bg-[#9B59B6] text-white text-xs font-bold rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span
                        className={`text-xs sm:text-sm font-semibold ${
                          isVerified ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>

                  {!isVerified && (
                    <div className="flex-shrink-0">
                      <div className="px-3 sm:px-4 py-2 bg-[#9B59B6] text-white rounded-lg text-xs sm:text-sm font-semibold">
                        Verify
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Privacy Note */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <Shield size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm text-gray-700 font-semibold mb-1">
                Your Privacy is Protected
              </p>
              <p className="text-xs text-gray-600">
                All documents are encrypted and stored securely. Your information is never
                shared without your consent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Verification Modal */}
      {showPhotoVerification && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D3557] mb-2">
                Photo Verification
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Take a selfie following the instructions below
              </p>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-blue-900 mb-3">
                  Instructions:
                </p>
                <ol className="text-xs sm:text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Face the camera directly</li>
                  <li>Ensure good lighting</li>
                  <li>Remove sunglasses or accessories</li>
                  <li>Make sure your face is clearly visible</li>
                  <li>Match the pose shown in the frame</li>
                </ol>
              </div>

              {/* Placeholder for camera */}
              <div className="aspect-square bg-gray-100 rounded-xl mb-6 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Camera size={48} className="mx-auto mb-2" />
                  <p className="text-sm">Camera will open here</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full bg-[#9B59B6] text-white py-3 sm:py-4 rounded-xl font-bold hover:bg-[#D62839] transition-colors flex items-center justify-center gap-2">
                  <Camera size={20} />
                  <span>Start Verification</span>
                </button>
                <button
                  onClick={() => setShowPhotoVerification(false)}
                  className="w-full text-gray-600 py-2 sm:py-3 font-semibold hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
