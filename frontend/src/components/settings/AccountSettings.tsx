/**
 * Account Settings Component
 * Manage account credentials, contact info, password, and deactivation
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Copy,
  Check,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { getAccountInfo, changeEmail, changePhone, changePassword, deactivateAccount } from '../../services/settingsService';
import type { AccountInfo } from '../../types/settings';

type ModalType = 'email' | 'phone' | 'password' | 'deactivate' | null;

export default function AccountSettings() {
  const navigate = useNavigate();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  useEffect(() => {
    loadAccountInfo();
  }, []);

  const loadAccountInfo = async () => {
    try {
      setIsLoading(true);
      const info = await getAccountInfo();
      setAccountInfo(info);
    } catch (error) {
      console.error('Failed to load account info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUserId = () => {
    if (accountInfo) {
      navigator.clipboard.writeText(accountInfo.userIdDisplay);
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E63946]"></div>
      </div>
    );
  }

  if (!accountInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load account information</p>
          <button
            onClick={loadAccountInfo}
            className="mt-4 text-[#E63946] font-semibold"
          >
            Try Again
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
            Account Settings
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Account Information */}
        <Section title="Account Information">
          <InfoRow label="User ID">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {accountInfo.userIdDisplay}
              </span>
              <button
                onClick={handleCopyUserId}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {copiedUserId ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-gray-500" />
                )}
              </button>
            </div>
          </InfoRow>
          <div className="text-xs text-gray-500 mt-1 px-4">
            Share this ID with support
          </div>

          <InfoRow label="Member Since">
            <span className="font-medium text-gray-900">
              {formatDate(accountInfo.registrationDate)}
            </span>
          </InfoRow>
        </Section>

        {/* Contact Information */}
        <Section title="Contact Information">
          <InfoRow label="Email" icon={<Mail size={18} className="text-gray-500" />}>
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="font-medium text-gray-900">{accountInfo.email}</span>
                {accountInfo.emailVerified && (
                  <Check size={16} className="text-green-600" />
                )}
              </div>
            </div>
          </InfoRow>
          <ActionButton onClick={() => setActiveModal('email')}>
            Change Email
          </ActionButton>

          <InfoRow label="Mobile Number" icon={<Phone size={18} className="text-gray-500" />}>
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="font-medium text-gray-900">{accountInfo.phoneNumber}</span>
                {accountInfo.phoneVerified && (
                  <Check size={16} className="text-green-600" />
                )}
              </div>
            </div>
          </InfoRow>
          <ActionButton onClick={() => setActiveModal('phone')}>
            Change Number
          </ActionButton>
        </Section>

        {/* Password & Security */}
        <Section title="Password & Security">
          <InfoRow label="Password" icon={<Lock size={18} className="text-gray-500" />}>
            <div className="text-right">
              <div className="font-medium text-gray-900">••••••••</div>
              {accountInfo.lastPasswordChange && (
                <div className="text-xs text-gray-500 mt-1">
                  Last changed: {formatDate(accountInfo.lastPasswordChange)}
                </div>
              )}
            </div>
          </InfoRow>
          <ActionButton onClick={() => setActiveModal('password')}>
            Change Password
          </ActionButton>
        </Section>

        {/* Account Status */}
        <Section title="Account Status">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Temporarily Deactivate Account
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Hide your profile without deleting your data. You can reactivate anytime.
                </p>
                <button
                  onClick={() => setActiveModal('deactivate')}
                  className="text-sm font-semibold text-amber-700 hover:text-amber-800"
                >
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Change Email Modal */}
      {activeModal === 'email' && (
        <ChangeEmailModal
          currentEmail={accountInfo.email}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            loadAccountInfo();
          }}
        />
      )}

      {/* Change Phone Modal */}
      {activeModal === 'phone' && (
        <ChangePhoneModal
          currentPhone={accountInfo.phoneNumber}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            loadAccountInfo();
          }}
        />
      )}

      {/* Change Password Modal */}
      {activeModal === 'password' && (
        <ChangePasswordModal
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            loadAccountInfo();
          }}
        />
      )}

      {/* Deactivate Account Modal */}
      {activeModal === 'deactivate' && (
        <DeactivateAccountModal
          onClose={() => setActiveModal(null)}
          onConfirm={async () => {
            await deactivateAccount();
            setActiveModal(null);
            // Redirect to landing page
            window.location.href = '/';
          }}
        />
      )}
    </div>
  );
}

// Helper Components

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">{title}</h2>
      <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
};

const InfoRow: React.FC<{
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, icon, children }) => {
  return (
    <div className="flex items-center gap-3 p-4">
      {icon}
      <div className="flex-1 flex items-center justify-between">
        <span className="text-gray-600">{label}</span>
        {children}
      </div>
    </div>
  );
};

const ActionButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
}> = ({ onClick, children }) => {
  return (
    <div className="px-4 pb-4">
      <button
        onClick={onClick}
        className="text-[#E63946] font-semibold hover:text-[#d62839] transition-colors"
      >
        {children}
      </button>
    </div>
  );
};

// Modals

const ChangeEmailModal: React.FC<{
  currentEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ currentEmail, onClose, onSuccess }) => {
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      await changeEmail(newEmail, otp);
      onSuccess();
    } catch (error) {
      console.error('Failed to change email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Change Email</h3>
      <p className="text-sm text-gray-600 mb-6">
        Current: {currentEmail}
      </p>

      {step === 'email' ? (
        <>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSendOTP}
              disabled={!newEmail || isLoading}
              className="flex-1 py-3 px-4 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-[#d62839] disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">
            We've sent a verification code to {newEmail}
          </p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent mb-4 text-center text-2xl tracking-widest"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setStep('email')}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isLoading}
              className="flex-1 py-3 px-4 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-[#d62839] disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

const ChangePhoneModal: React.FC<{
  currentPhone: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ currentPhone, onClose, onSuccess }) => {
  const [newPhone, setNewPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      await changePhone(newPhone, otp);
      onSuccess();
    } catch (error) {
      console.error('Failed to change phone:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Change Mobile Number</h3>
      <p className="text-sm text-gray-600 mb-2">
        Current: {currentPhone}
      </p>
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
        <p className="text-xs text-amber-800">
          ⚠️ Changing your number requires verification
        </p>
      </div>

      {step === 'phone' ? (
        <>
          <input
            type="tel"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSendOTP}
              disabled={!newPhone || isLoading}
              className="flex-1 py-3 px-4 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-[#d62839] disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">
            We've sent a verification code to {newPhone}
          </p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent mb-4 text-center text-2xl tracking-widest"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setStep('phone')}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isLoading}
              className="flex-1 py-3 px-4 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-[#d62839] disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

const ChangePasswordModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { text: 'At least 8 characters', met: newPassword.length >= 8 },
    { text: 'At least 1 uppercase letter', met: /[A-Z]/.test(newPassword) },
    { text: 'At least 1 number', met: /[0-9]/.test(newPassword) },
    { text: 'At least 1 special character', met: /[!@#$%^&*]/.test(newPassword) },
  ];

  const isValid =
    currentPassword &&
    passwordRequirements.every((req) => req.met) &&
    newPassword === confirmPassword;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      onSuccess();
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {newPassword && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Password Requirements:
          </p>
          <ul className="space-y-1">
            {passwordRequirements.map((req, index) => (
              <li
                key={index}
                className={`text-sm flex items-center gap-2 ${
                  req.met ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {req.met ? <Check size={16} /> : <span className="w-4" />}
                {req.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid || isLoading}
          className="flex-1 py-3 px-4 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-[#d62839] disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </Modal>
  );
};

const DeactivateAccountModal: React.FC<{
  onClose: () => void;
  onConfirm: () => void;
}> = ({ onClose, onConfirm }) => {
  return (
    <Modal onClose={onClose}>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Deactivate Your Account?
      </h3>
      <div className="space-y-3 mb-6 text-sm text-gray-600">
        <p>When you deactivate your account:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Your profile will be hidden from other users</li>
          <li>Your messages and matches will be preserved</li>
          <li>Your credits and subscription will remain active</li>
          <li>You can reactivate anytime by logging back in</li>
        </ul>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 px-4 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600"
        >
          Deactivate
        </button>
      </div>
    </Modal>
  );
};

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fadeIn">
        {children}
      </div>
    </div>
  );
};
