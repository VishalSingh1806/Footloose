/**
 * Data and Privacy Component
 * GDPR data export, download data, privacy controls
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Download,
  Shield,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  requestDataExport,
  getDataExports,
  getCookiePreferences,
  updateCookiePreferences,
} from '../../services/settingsService';
import type { DataExportRequest, CookiePreferences } from '../../types/settings';

export default function DataAndPrivacy() {
  const navigate = useNavigate();
  const [exports, setExports] = useState<DataExportRequest[]>([]);
  const [cookiePrefs, setCookiePrefs] = useState<CookiePreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [exportsData, cookieData] = await Promise.all([
        getDataExports(),
        getCookiePreferences(),
      ]);
      setExports(exportsData);
      setCookiePrefs(cookieData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestExport = async () => {
    try {
      setIsRequesting(true);
      const newExport = await requestDataExport();
      setExports([newExport, ...exports]);
      setShowExportModal(false);
      alert('Data export request submitted! You will receive an email when your data is ready.');
    } catch (error) {
      console.error('Failed to request export:', error);
      alert('Failed to request data export. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleUpdateCookie = async (key: keyof CookiePreferences, value: boolean) => {
    if (!cookiePrefs) return;
    const updated = { ...cookiePrefs, [key]: value };
    setCookiePrefs(updated);
    try {
      await updateCookiePreferences(updated);
    } catch (error) {
      console.error('Failed to update cookie preferences:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: DataExportRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="text-blue-600" />;
      case 'processing':
        return <Clock size={20} className="text-amber-600 animate-spin" />;
      case 'ready':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'expired':
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: DataExportRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9B59B6]"></div>
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
          <h1 className="flex-1 text-xl font-bold text-gray-900 ml-2">Data & Privacy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Privacy Overview */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Your Data, Your Control</h2>
          </div>
          <p className="text-sm text-white text-opacity-90">
            We're committed to protecting your privacy and giving you full control over your
            personal data.
          </p>
        </div>

        {/* Download Your Data */}
        <Section title="Download Your Data">
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              Request a copy of all your data including profile information, photos, messages, and
              activity history.
            </p>
            <button
              onClick={() => setShowExportModal(true)}
              className="w-full py-3 px-4 bg-[#9B59B6] text-white rounded-lg font-semibold hover:bg-[#d62839] transition-colors flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Request Data Export
            </button>
          </div>
        </Section>

        {/* Export History */}
        {exports.length > 0 && (
          <Section title="Export History">
            <div className="divide-y divide-gray-100">
              {exports.map((exportReq) => (
                <div key={exportReq.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(exportReq.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            exportReq.status
                          )}`}
                        >
                          {exportReq.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Requested: {formatDate(exportReq.requestedAt)}
                      </p>
                      {exportReq.completedAt && (
                        <p className="text-sm text-gray-600">
                          Completed: {formatDate(exportReq.completedAt)}
                        </p>
                      )}
                      {exportReq.expiresAt && exportReq.status === 'ready' && (
                        <p className="text-sm text-amber-600">
                          Expires: {formatDate(exportReq.expiresAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  {exportReq.status === 'ready' && exportReq.downloadUrl && (
                    <button className="w-full mt-3 py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <Download size={18} />
                      Download ({exportReq.fileSize})
                    </button>
                  )}
                  {exportReq.status === 'pending' && (
                    <p className="text-sm text-gray-600 mt-2">
                      Your data is being prepared. This usually takes 24-48 hours.
                    </p>
                  )}
                  {exportReq.status === 'processing' && (
                    <p className="text-sm text-gray-600 mt-2">
                      Processing your data export...
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Privacy Controls */}
        <Section title="Privacy Controls">
          <ToggleRow
            label="Profile Visibility"
            description="Show my profile in search results"
            checked={true}
            onChange={() => {}}
            icon={<Eye size={18} className="text-gray-500" />}
          />
          <ToggleRow
            label="Read Receipts"
            description="Let others see when you read messages"
            checked={true}
            onChange={() => {}}
            icon={<Eye size={18} className="text-gray-500" />}
          />
          <div className="p-4">
            <button
              onClick={() => navigate('/settings/blocked-users')}
              className="text-[#9B59B6] font-semibold hover:text-[#d62839]"
            >
              Manage Blocked Users
            </button>
          </div>
        </Section>

        {/* Cookie Preferences */}
        {cookiePrefs && (
          <Section title="Cookie Preferences">
            <ToggleRow
              label="Essential Cookies"
              description="Required for the app to function"
              checked={cookiePrefs.essential}
              onChange={() => {}}
              disabled={true}
            />
            <ToggleRow
              label="Analytics Cookies"
              description="Help us improve the app"
              checked={cookiePrefs.analytics}
              onChange={(checked) => handleUpdateCookie('analytics', checked)}
            />
            <ToggleRow
              label="Marketing Cookies"
              description="Personalized ads and content"
              checked={cookiePrefs.marketing}
              onChange={(checked) => handleUpdateCookie('marketing', checked)}
            />
          </Section>
        )}

        {/* GDPR Rights */}
        <Section title="Your Rights">
          <div className="p-4 space-y-3">
            <RightItem
              title="Right to Access"
              description="Download a copy of your personal data"
            />
            <RightItem
              title="Right to Rectification"
              description="Update or correct your information"
            />
            <RightItem
              title="Right to Erasure"
              description="Request deletion of your data"
            />
            <RightItem
              title="Right to Portability"
              description="Transfer your data to another service"
            />
            <RightItem
              title="Right to Object"
              description="Object to processing of your data"
            />
            <button
              onClick={() => navigate('/settings/terms-and-privacy')}
              className="w-full mt-4 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Read Privacy Policy
            </button>
          </div>
        </Section>

        {/* Data Retention */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Data Retention</h3>
          <p className="text-sm text-gray-600">
            We retain your data as long as your account is active. After account deletion, we keep
            data for 30 days for recovery, then permanently delete it (except as required by law).
          </p>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Privacy Questions?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Contact our Data Protection Officer for any privacy-related inquiries.
          </p>
          <a
            href="mailto:privacy@footloosenomorw.com"
            className="text-[#9B59B6] font-semibold hover:text-[#d62839]"
          >
            privacy@footloosenomorw.com
          </a>
        </div>
      </div>

      {/* Export Confirmation Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Request Data Export</h3>
            <p className="text-gray-600 mb-4">
              We'll prepare a complete copy of your data including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mb-6">
              <li>Profile information and photos</li>
              <li>Match history and preferences</li>
              <li>Messages and conversations</li>
              <li>Speed dating history</li>
              <li>Account activity logs</li>
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-amber-800">
                This process usually takes 24-48 hours. You'll receive an email when your data is
                ready to download. The download link expires after 7 days.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestExport}
                disabled={isRequesting}
                className="flex-1 py-3 px-4 bg-[#9B59B6] text-white rounded-lg font-semibold hover:bg-[#d62839] disabled:opacity-50"
              >
                {isRequesting ? 'Requesting...' : 'Request Export'}
              </button>
            </div>
          </div>
        </div>
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

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled,
  icon,
}) => {
  return (
    <div className={`flex items-center gap-3 p-4 ${disabled ? 'opacity-50' : ''}`}>
      {icon}
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        {description && <div className="text-sm text-gray-500 mt-0.5">{description}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
};

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled }) => {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:ring-offset-2 ${
        checked ? 'bg-[#9B59B6]' : 'bg-gray-300'
      } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

const RightItem: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <div className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};
