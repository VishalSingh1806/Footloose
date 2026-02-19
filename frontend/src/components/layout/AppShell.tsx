import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Filter, Bell, Edit2, Wallet } from 'lucide-react';
import Layout from './Layout';
import HomePage from '../home/HomePage';
import SpeedDatesPage from '../speeddate/SpeedDatesPage';
import MessagesPage from '../chat/MessagesPage';
import ProfilePage from '../profile/ProfilePage';
import { MatchProfileDetail } from '../profile';
import SpeedDateCallWrapper from '../speeddate/SpeedDateCallWrapper';
import ChatConversation from '../chat/ChatConversation';
import InstallPrompt from '../common/InstallPrompt';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import { useSubscription } from '../../contexts/SubscriptionContext';
import {
  CreditsWallet,
  PurchaseCredits,
  SubscriptionPlans,
  SubscriptionUpgrade,
  PaymentSuccess,
  PaymentFailed,
  TransactionHistory,
  CreditUsageBreakdown,
  SubscriptionManagement,
  CancelSubscription,
  PremiumFeatures,
  CreditsLowBanner,
} from '../subscription';
import { EditProfile } from '../profile/EditProfile';
import { ProfilePhotoManagerPage } from '../profile/ProfilePhotoManagerPage';
import { VerificationCenterPage } from '../profile/VerificationCenterPage';
import { PrivacySettingsPage } from '../profile/PrivacySettingsPage';
import { PartnerPreferencesEditorPage } from '../profile/PartnerPreferencesEditorPage';
import { ProfilePreviewPage } from '../profile/ProfilePreviewPage';
import { ProfileAnalytics } from '../profile/ProfileAnalytics';
import Settings from '../settings/Settings';
import AccountSettings from '../settings/AccountSettings';
import NotificationSettings from '../settings/NotificationSettings';
import BlockedUsers from '../settings/BlockedUsers';
import HelpCenter from '../settings/HelpCenter';
import ContactSupport from '../settings/ContactSupport';
import SafetyCenter from '../settings/SafetyCenter';
import TermsAndPrivacy from '../settings/TermsAndPrivacy';
import DeleteAccount from '../settings/DeleteAccount';
import DataAndPrivacy from '../settings/DataAndPrivacy';
import AboutApp from '../settings/AboutApp';
import LanguageSettings from '../settings/LanguageSettings';
import AccessibilitySettings from '../settings/AccessibilitySettings';
import FeedbackForm from '../settings/FeedbackForm';

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt();
  const { creditBalance } = useSubscription();

  // Sample badge counts (in real app, these would come from API/state management)
  const [badgeCounts] = useState({
    matches: 3,
    speedDates: 1,
    messages: 2,
  });

  // Notification badge (for top bar)
  const [hasNotifications] = useState(true);

  // Install prompt state
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installPromptDismissed, setInstallPromptDismissed] = useState(false);

  // Show install prompt after a delay if app can be installed
  useEffect(() => {
    // Check if prompt was dismissed in the last 7 days
    const dismissedTime = localStorage.getItem('installPromptDismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setInstallPromptDismissed(true);
        return;
      }
    }

    if (canInstall && !installPromptDismissed) {
      // Show prompt after 10 seconds
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [canInstall, installPromptDismissed]);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setShowInstallPrompt(false);
    }
    return success;
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    setInstallPromptDismissed(true);
    // Store in localStorage to not show again for 7 days
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  // Get TopBar props based on current route
  const getTopBarProps = () => {
    const path = location.pathname;

    switch (path) {
      case '/matches':
        return {
          title: 'Matches',
          showBackButton: false,
          rightAction: (
            <>
              <button
                onClick={() => navigate('/credits')}
                className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors relative"
                aria-label="Credits wallet"
              >
                <Wallet className="w-5 h-5 text-[#1D3557]" />
                {creditBalance < 200 && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#E63946] rounded-full" />
                )}
              </button>
              <button
                className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors"
                aria-label="Filter matches"
              >
                <Filter className="w-5 h-5 text-[#1D3557]" />
              </button>
              <button
                className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-[#1D3557]" />
                {hasNotifications && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#E63946] rounded-full" />
                )}
              </button>
            </>
          ),
        };

      case '/speed-dates':
        return {
          title: 'Speed Dates',
          showBackButton: false,
          rightAction: (
            <>
              <button
                onClick={() => navigate('/credits')}
                className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors relative"
                aria-label="Credits wallet"
              >
                <Wallet className="w-5 h-5 text-[#1D3557]" />
                {creditBalance < 200 && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#E63946] rounded-full" />
                )}
              </button>
              <button
                className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-[#1D3557]" />
                {hasNotifications && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#E63946] rounded-full" />
                )}
              </button>
            </>
          ),
        };

      case '/messages':
        return {
          title: 'Messages',
          showBackButton: false,
          rightAction: (
            <button
              onClick={() => navigate('/credits')}
              className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors relative"
              aria-label="Credits wallet"
            >
              <Wallet className="w-5 h-5 text-[#1D3557]" />
              {creditBalance < 200 && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-[#E63946] rounded-full" />
              )}
            </button>
          ),
        };

      case '/profile':
        return {
          title: 'Profile',
          showBackButton: false,
          rightAction: (
            <>
              <button
                onClick={() => navigate('/credits')}
                className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors relative"
                aria-label="Credits wallet"
              >
                <Wallet className="w-5 h-5 text-[#1D3557]" />
                {creditBalance < 200 && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#E63946] rounded-full" />
                )}
              </button>
              <button
                className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors"
                aria-label="Edit profile"
              >
                <Edit2 className="w-5 h-5 text-[#1D3557]" />
              </button>
            </>
          ),
        };

      default:
        return {
          title: 'App',
          showBackButton: false,
        };
    }
  };

  return (
    <>
      <Routes>
        {/* Default route - redirect to matches */}
        <Route path="/" element={<Navigate to="/matches" replace />} />

        {/* Match profile detail (no Layout wrapper - has custom top bar) */}
        <Route path="/match/:matchId" element={<MatchProfileDetail />} />

        {/* Speed Date Call Flow (no Layout wrapper - fullscreen video call) */}
        <Route path="/speed-date-call/:matchId" element={<SpeedDateCallWrapper />} />

        {/* Chat Conversation (no Layout wrapper - has custom header) */}
        <Route path="/chat/:conversationId" element={<ChatConversation />} />

        {/* Payment Success/Failed (full screen, no Layout wrapper) */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />

        {/* Cancel Subscription Modal (overlay) */}
        <Route path="/subscription/cancel" element={<CancelSubscription />} />

        {/* Main app routes (with Layout) */}
        <Route
          path="*"
          element={
            <Layout topBarProps={getTopBarProps()} navBadges={badgeCounts}>
              <Routes>
                <Route path="matches" element={<HomePage />} />
                <Route path="speed-dates" element={<SpeedDatesPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="profile" element={<ProfilePage />} />

                {/* Subscription & Credits Routes */}
                <Route path="credits" element={<CreditsWallet />} />
                <Route path="credits/purchase" element={<PurchaseCredits />} />
                <Route path="credits/usage" element={<CreditUsageBreakdown />} />
                <Route path="subscription" element={<SubscriptionPlans />} />
                <Route path="subscription/upgrade" element={<SubscriptionUpgrade />} />
                <Route path="subscription/manage" element={<SubscriptionManagement />} />
                <Route path="transactions" element={<TransactionHistory />} />
                <Route path="premium" element={<PremiumFeatures />} />

                {/* Profile Management Routes */}
                <Route path="profile/edit" element={<EditProfile />} />
                <Route path="profile/photos" element={<ProfilePhotoManagerPage />} />
                <Route path="profile/verification" element={<VerificationCenterPage />} />
                <Route path="profile/privacy" element={<PrivacySettingsPage />} />
                <Route path="profile/preferences" element={<PartnerPreferencesEditorPage />} />
                <Route path="profile/preview" element={<ProfilePreviewPage />} />
                <Route path="profile/analytics" element={<ProfileAnalytics />} />

                {/* Settings Routes */}
                <Route path="settings" element={<Settings />} />
                <Route path="settings/account" element={<AccountSettings />} />
                <Route path="settings/notifications" element={<NotificationSettings />} />
                <Route path="settings/blocked-users" element={<BlockedUsers />} />
                <Route path="settings/help" element={<HelpCenter />} />
                <Route path="settings/support" element={<ContactSupport />} />
                <Route path="settings/safety" element={<SafetyCenter />} />
                <Route path="settings/terms" element={<TermsAndPrivacy />} />
                <Route path="settings/delete-account" element={<DeleteAccount />} />
                <Route path="settings/data-privacy" element={<DataAndPrivacy />} />
                <Route path="settings/about" element={<AboutApp />} />
                <Route path="settings/language" element={<LanguageSettings />} />
                <Route path="settings/accessibility" element={<AccessibilitySettings />} />
                <Route path="settings/feedback" element={<FeedbackForm />} />

                {/* Catch all - redirect to matches */}
                <Route path="*" element={<Navigate to="/matches" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>

      {/* Install Prompt */}
      {showInstallPrompt && canInstall && !isInstalled && (
        <InstallPrompt
          onInstall={handleInstall}
          onDismiss={handleDismissInstall}
          variant="banner"
        />
      )}

      {/* Credits Low Banner (global) */}
      <CreditsLowBanner />
    </>
  );
}

export default AppShell;
