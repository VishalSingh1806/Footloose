/**
 * Settings Component
 * Main settings menu with grouped sections
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Lock,
  UserX,
  Globe,
  Eye,
  HelpCircle,
  Headphones,
  Shield,
  MessageSquare,
  FileText,
  Info,
  Download,
  Trash2,
  LogOut,
  Check,
} from 'lucide-react';
import { getBlockedUsers, logout } from '../../services/settingsService';

interface SettingsMenuItemProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  rightElement?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({
  icon,
  label,
  sublabel,
  rightElement,
  onClick,
  destructive,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
    >
      <div className={`${destructive ? 'text-red-500' : 'text-gray-600'}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className={`font-medium ${destructive ? 'text-red-500' : 'text-gray-900'}`}>
          {label}
        </div>
        {sublabel && (
          <div className="text-sm text-gray-500 mt-0.5">{sublabel}</div>
        )}
      </div>
      {rightElement || (
        <ChevronRight
          size={20}
          className={destructive ? 'text-red-500' : 'text-gray-400'}
        />
      )}
    </button>
  );
};

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
        {title}
      </h2>
      <div className="bg-white rounded-2xl mx-4 divide-y divide-gray-100 shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default function Settings() {
  const navigate = useNavigate();
  const [blockedCount, setBlockedCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadBlockedCount();
  }, []);

  const loadBlockedCount = async () => {
    try {
      const blocked = await getBlockedUsers();
      setBlockedCount(blocked.length);
    } catch (error) {
      console.error('Failed to load blocked users count:', error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Redirect to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="flex-1 text-xl font-bold text-gray-900 ml-2">
            Settings
          </h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="pb-6">
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsMenuItem
            icon={<User size={20} />}
            label="Account Settings"
            sublabel="Email, phone, password"
            onClick={() => navigate('/settings/account')}
          />
          <SettingsMenuItem
            icon={<Bell size={20} />}
            label="Notifications"
            sublabel="Push, email, SMS preferences"
            rightElement={
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600 font-medium">ON</span>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            }
            onClick={() => navigate('/settings/notifications')}
          />
          <SettingsMenuItem
            icon={<Lock size={20} />}
            label="Privacy"
            sublabel="Who can see your profile, activity"
            onClick={() => navigate('/profile/privacy')}
          />
          <SettingsMenuItem
            icon={<UserX size={20} />}
            label="Blocked Users"
            sublabel={
              blockedCount > 0
                ? `Manage blocked users (${blockedCount})`
                : 'No blocked users'
            }
            onClick={() => navigate('/settings/blocked-users')}
          />
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <SettingsMenuItem
            icon={<Globe size={20} />}
            label="Language"
            sublabel="English"
            onClick={() => navigate('/settings/language')}
          />
          <SettingsMenuItem
            icon={<Eye size={20} />}
            label="Accessibility"
            sublabel="Font size, contrast, screen reader"
            onClick={() => navigate('/settings/accessibility')}
          />
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support & Help">
          <SettingsMenuItem
            icon={<HelpCircle size={20} />}
            label="Help Center"
            sublabel="FAQs, guides, tutorials"
            onClick={() => navigate('/settings/help')}
          />
          <SettingsMenuItem
            icon={<Headphones size={20} />}
            label="Contact Support"
            sublabel="Get help from our team"
            onClick={() => navigate('/settings/support')}
          />
          <SettingsMenuItem
            icon={<Shield size={20} />}
            label="Safety & Security"
            sublabel="Guidelines, reporting, resources"
            onClick={() => navigate('/settings/safety')}
          />
          <SettingsMenuItem
            icon={<MessageSquare size={20} />}
            label="Send Feedback"
            sublabel="Help us improve"
            onClick={() => navigate('/settings/feedback')}
          />
        </SettingsSection>

        {/* Legal Section */}
        <SettingsSection title="Legal & About">
          <SettingsMenuItem
            icon={<FileText size={20} />}
            label="Terms of Service"
            onClick={() => navigate('/settings/terms?tab=terms')}
          />
          <SettingsMenuItem
            icon={<FileText size={20} />}
            label="Privacy Policy"
            onClick={() => navigate('/settings/terms?tab=privacy')}
          />
          <SettingsMenuItem
            icon={<FileText size={20} />}
            label="Community Guidelines"
            onClick={() => navigate('/settings/terms?tab=guidelines')}
          />
          <SettingsMenuItem
            icon={<Info size={20} />}
            label="About"
            sublabel="Version 1.2.0"
            onClick={() => navigate('/settings/about')}
          />
        </SettingsSection>

        {/* Data & Account Section */}
        <SettingsSection title="Data & Account">
          <SettingsMenuItem
            icon={<Download size={20} />}
            label="Download My Data"
            sublabel="GDPR data export"
            onClick={() => navigate('/settings/data-privacy')}
          />
          <SettingsMenuItem
            icon={<Trash2 size={20} />}
            label="Delete Account"
            sublabel="Permanently delete your account"
            onClick={() => navigate('/settings/delete-account')}
            destructive
          />
        </SettingsSection>
      </div>

      {/* Logout Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gray-50">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full py-3 px-4 border-2 border-red-500 text-red-500 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Log Out?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging Out...' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
