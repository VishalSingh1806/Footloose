/**
 * About App Component
 * App information, version, team, and system info
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, Check, ExternalLink } from 'lucide-react';

export default function AboutApp() {
  const navigate = useNavigate();
  const [copiedDebug, setCopiedDebug] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(false);

  const appVersion = '1.2.0';
  const buildNumber = '45';
  const lastUpdated = 'February 1, 2026';

  const systemInfo = {
    device: navigator.userAgent.includes('iPhone') ? 'iPhone 14 Pro' : 'Unknown',
    os: `${navigator.platform} - ${navigator.userAgent}`,
    browser: navigator.userAgent.includes('Safari') ? 'Safari 17' : 'Browser',
    isPWA: window.matchMedia('(display-mode: standalone)').matches,
    networkStatus: navigator.onLine ? 'Online' : 'Offline',
    permissions: {
      camera: 'Granted',
      microphone: 'Granted',
      notifications: 'Granted',
      location: 'Granted',
    },
  };

  const handleCopyDebugInfo = () => {
    const debugInfo = `
Footloose No More - Debug Info
==============================
Version: ${appVersion} (Build ${buildNumber})
Device: ${systemInfo.device}
OS: ${systemInfo.os}
Browser: ${systemInfo.browser}
PWA Installed: ${systemInfo.isPWA ? 'Yes' : 'No'}
Network: ${systemInfo.networkStatus}
Permissions: ${JSON.stringify(systemInfo.permissions, null, 2)}
    `.trim();

    navigator.clipboard.writeText(debugInfo);
    setCopiedDebug(true);
    setTimeout(() => setCopiedDebug(false), 2000);
  };

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
          <h1 className="flex-1 text-xl font-bold text-gray-900 ml-2">About</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* App Logo & Info */}
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-[#E63946] to-[#d62839] rounded-3xl mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
            FN
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Footloose No More
          </h2>
          <p className="text-gray-600 mb-4">
            Find Your Perfect Match Through Real Conversations
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-sm font-medium text-gray-600">
              Version {appVersion}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">Build {buildNumber}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Last updated: {lastUpdated}</p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Our Mission</h3>
          <p className="text-gray-600 leading-relaxed">
            Footloose No More is on a mission to help serious relationship seekers find
            meaningful connections through authentic, face-to-face speed dating. We believe
            in chemistry over profiles, quality over quantity, and genuine human connection.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">What Makes Us Different</h3>
          <div className="space-y-4">
            <FeatureItem
              icon="⚡"
              title="Speed Dating Built-In"
              description="10-minute video dates before investing time in messaging"
            />
            <FeatureItem
              icon="❤️"
              title="Preference-Based Matching"
              description="Profiles curated to your age, location, values, and lifestyle preferences"
            />
            <FeatureItem
              icon="✓"
              title="Verified Profiles"
              description="ID and photo verification for trust and safety"
            />
            <FeatureItem
              icon="💎"
              title="Credit-Based System"
              description="Pay only for meaningful actions, not empty swipes"
            />
            <FeatureItem
              icon="🔒"
              title="Privacy-First"
              description="Control who sees your profile and activity"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
          <div className="grid grid-cols-2 gap-3">
            <SocialButton
              platform="Instagram"
              handle="@footloosenomo.re"
              url="https://instagram.com"
            />
            <SocialButton
              platform="Facebook"
              handle="/footloosenomo.re"
              url="https://facebook.com"
            />
            <SocialButton
              platform="Twitter"
              handle="@footloosenomo.re"
              url="https://twitter.com"
            />
            <SocialButton
              platform="LinkedIn"
              handle="/company/footloosenomo.re"
              url="https://linkedin.com"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Contact Us</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-gray-600">Email</div>
              <div className="font-medium text-gray-900">support@footloosenomo.re</div>
            </div>
            <div>
              <div className="text-gray-600">Website</div>
              <div className="font-medium text-gray-900">footloosenomo.re</div>
            </div>
            <div>
              <div className="text-gray-600">Address</div>
              <div className="font-medium text-gray-900">Mumbai, Maharashtra, India</div>
            </div>
          </div>
        </div>

        {/* Feedback & Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <button
            onClick={() => navigate('/settings/feedback')}
            className="w-full py-3 px-4 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-[#d62839] transition-colors"
          >
            Send Feedback
          </button>
          <button
            onClick={() => {
              // Open app store review page
              alert('Opening app store...');
            }}
            className="w-full py-3 px-4 border-2 border-[#E63946] text-[#E63946] rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Rate Us ⭐
          </button>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-2xl shadow-sm">
          <button
            onClick={() => setShowSystemInfo(!showSystemInfo)}
            className="w-full p-6 text-left flex items-center justify-between"
          >
            <span className="font-bold text-gray-900">System Information</span>
            <span className="text-gray-400">{showSystemInfo ? '−' : '+'}</span>
          </button>
          {showSystemInfo && (
            <div className="px-6 pb-6 space-y-3 text-sm">
              <InfoRow label="Device" value={systemInfo.device} />
              <InfoRow label="Browser" value={systemInfo.browser} />
              <InfoRow
                label="PWA Installed"
                value={systemInfo.isPWA ? 'Yes' : 'No'}
              />
              <InfoRow label="Network" value={systemInfo.networkStatus} />
              <div className="pt-3">
                <div className="text-gray-600 mb-2">Permissions:</div>
                <div className="space-y-1 ml-4">
                  <InfoRow label="Camera" value={systemInfo.permissions.camera} />
                  <InfoRow label="Microphone" value={systemInfo.permissions.microphone} />
                  <InfoRow
                    label="Notifications"
                    value={systemInfo.permissions.notifications}
                  />
                  <InfoRow label="Location" value={systemInfo.permissions.location} />
                </div>
              </div>
              <button
                onClick={handleCopyDebugInfo}
                className="w-full mt-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                {copiedDebug ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Debug Info
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Legal Links */}
        <div className="bg-white rounded-2xl p-4 shadow-sm divide-y divide-gray-100">
          <LinkItem
            label="Terms of Service"
            onClick={() => navigate('/settings/terms?tab=terms')}
          />
          <LinkItem
            label="Privacy Policy"
            onClick={() => navigate('/settings/terms?tab=privacy')}
          />
          <LinkItem
            label="Community Guidelines"
            onClick={() => navigate('/settings/terms?tab=guidelines')}
          />
          <LinkItem
            label="Open Source Licenses"
            onClick={() => alert('Opening licenses...')}
          />
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500 py-4">
          © 2026 Footloose No More. All rights reserved.
        </div>
      </div>
    </div>
  );
}

// Helper Components

const FeatureItem: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="flex gap-3">
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
};

const SocialButton: React.FC<{
  platform: string;
  handle: string;
  url: string;
}> = ({ platform, handle, url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#E63946] transition-all group"
    >
      <div className="flex items-center gap-2">
        <div className="font-semibold text-gray-900 group-hover:text-[#E63946]">
          {platform}
        </div>
        <ExternalLink size={14} className="text-gray-400 group-hover:text-[#E63946]" />
      </div>
      <div className="text-xs text-gray-600 mt-1">{handle}</div>
    </a>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
};

const LinkItem: React.FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 px-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <span className="font-medium text-gray-900">{label}</span>
      <ExternalLink size={16} className="text-gray-400" />
    </button>
  );
};
