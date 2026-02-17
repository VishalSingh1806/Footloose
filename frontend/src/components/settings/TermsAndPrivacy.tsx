/**
 * Terms and Privacy Component
 * Legal documents viewer with tabs for Terms/Privacy/Guidelines
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Shield, BookOpen } from 'lucide-react';

type TabType = 'terms' | 'privacy' | 'guidelines';

export default function TermsAndPrivacy() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('terms');

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
          <h1 className="flex-1 text-xl font-bold text-gray-900 ml-2">Legal</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-200">
          <TabButton
            active={activeTab === 'terms'}
            onClick={() => setActiveTab('terms')}
            icon={<FileText size={18} />}
            label="Terms"
          />
          <TabButton
            active={activeTab === 'privacy'}
            onClick={() => setActiveTab('privacy')}
            icon={<Shield size={18} />}
            label="Privacy"
          />
          <TabButton
            active={activeTab === 'guidelines'}
            onClick={() => setActiveTab('guidelines')}
            icon={<BookOpen size={18} />}
            label="Guidelines"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {activeTab === 'terms' && <TermsOfService />}
          {activeTab === 'privacy' && <PrivacyPolicy />}
          {activeTab === 'guidelines' && <CommunityGuidelines />}
        </div>
      </div>
    </div>
  );
}

// Helper Components

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium transition-colors ${
        active
          ? 'text-[#E63946] border-b-2 border-[#E63946]'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="mb-6 last:mb-0">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-700 leading-relaxed space-y-3">{children}</div>
    </div>
  );
};

// Terms of Service Content
const TermsOfService = () => {
  return (
    <div className="prose max-w-none">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated: February 16, 2026</p>
      </div>

      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using Footloose No More ("the Service"), you agree to be bound by these
          Terms of Service. If you do not agree to these terms, please do not use our Service.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <p>You must meet the following criteria to use our Service:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Be at least 18 years of age</li>
          <li>Be legally able to enter into a binding contract</li>
          <li>Not be prohibited from using the Service under Indian law</li>
          <li>Not have been previously banned from the Service</li>
        </ul>
      </Section>

      <Section title="3. Account Registration">
        <p>
          You agree to provide accurate, current, and complete information during registration. You
          are responsible for maintaining the confidentiality of your account credentials and for
          all activities under your account.
        </p>
      </Section>

      <Section title="4. User Conduct">
        <p>You agree NOT to:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Post false, inaccurate, or misleading information</li>
          <li>Impersonate any person or entity</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Use the Service for commercial purposes without authorization</li>
          <li>Share or distribute copyrighted material without permission</li>
          <li>Create multiple accounts to manipulate the system</li>
        </ul>
      </Section>

      <Section title="5. Subscription and Payments">
        <p>
          Certain features require a paid subscription. Subscriptions automatically renew unless
          cancelled. Refunds are provided according to our refund policy.
        </p>
      </Section>

      <Section title="6. Content Ownership">
        <p>
          You retain ownership of content you post. By posting content, you grant us a
          non-exclusive, worldwide, royalty-free license to use, display, and distribute your
          content on the Service.
        </p>
      </Section>

      <Section title="7. Termination">
        <p>
          We reserve the right to suspend or terminate your account at any time for violations of
          these Terms or for any other reason. You may delete your account at any time from Settings.
        </p>
      </Section>

      <Section title="8. Disclaimers">
        <p>
          The Service is provided "as is" without warranties of any kind. We do not guarantee
          matches, dates, or relationships. We are not responsible for user conduct or content.
        </p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, we shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages arising from your use of the
          Service.
        </p>
      </Section>

      <Section title="10. Governing Law">
        <p>
          These Terms are governed by the laws of India. Any disputes shall be resolved in the
          courts of Pune, Maharashtra.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          For questions about these Terms, contact us at:{' '}
          <a href="mailto:legal@footloosenomorw.com" className="text-[#E63946] underline">
            legal@footloosenomorw.com
          </a>
        </p>
      </Section>
    </div>
  );
};

// Privacy Policy Content
const PrivacyPolicy = () => {
  return (
    <div className="prose max-w-none">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: February 16, 2026</p>
      </div>

      <Section title="1. Information We Collect">
        <p>We collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>
            <strong>Personal Information:</strong> Name, email, phone, date of birth, photos
          </li>
          <li>
            <strong>Profile Information:</strong> Bio, preferences, interests, lifestyle choices
          </li>
          <li>
            <strong>Usage Data:</strong> App activity, matches, messages, video calls
          </li>
          <li>
            <strong>Device Information:</strong> IP address, device type, operating system
          </li>
          <li>
            <strong>Location Data:</strong> City, state (if you grant permission)
          </li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use your information to:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Provide and improve our matching service</li>
          <li>Facilitate Speed Dating and messaging</li>
          <li>Personalize your experience and recommendations</li>
          <li>Send notifications and updates</li>
          <li>Prevent fraud and ensure safety</li>
          <li>Comply with legal obligations</li>
        </ul>
      </Section>

      <Section title="3. Information Sharing">
        <p>We do NOT sell your personal information. We may share information with:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Other users (only what you choose to share on your profile)</li>
          <li>Service providers who help us operate the app</li>
          <li>Law enforcement when legally required</li>
          <li>Business partners with your explicit consent</li>
        </ul>
      </Section>

      <Section title="4. Data Security">
        <p>
          We implement industry-standard security measures including encryption, secure servers, and
          access controls. However, no system is 100% secure. You are responsible for maintaining
          the security of your account credentials.
        </p>
      </Section>

      <Section title="5. Your Rights (GDPR & Data Protection)">
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Export your data</li>
          <li>Opt-out of marketing communications</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p className="mt-2">
          Visit Settings &gt; Data & Privacy to exercise these rights.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We retain your data as long as your account is active. After account deletion, we retain
          some information for 30 days for recovery purposes, then permanently delete it (except as
          required by law).
        </p>
      </Section>

      <Section title="7. Cookies and Tracking">
        <p>
          We use cookies and similar technologies to improve your experience, analyze usage, and
          deliver personalized content. You can manage cookie preferences in Settings.
        </p>
      </Section>

      <Section title="8. Children's Privacy">
        <p>
          Our Service is not intended for anyone under 18. We do not knowingly collect information
          from minors. If we discover such data, we delete it immediately.
        </p>
      </Section>

      <Section title="9. Changes to Privacy Policy">
        <p>
          We may update this Privacy Policy. We'll notify you of significant changes via email or
          in-app notification. Continued use after changes constitutes acceptance.
        </p>
      </Section>

      <Section title="10. Contact Us">
        <p>
          For privacy questions or to exercise your rights, contact us at:{' '}
          <a href="mailto:privacy@footloosenomorw.com" className="text-[#E63946] underline">
            privacy@footloosenomorw.com
          </a>
        </p>
      </Section>
    </div>
  );
};

// Community Guidelines Content
const CommunityGuidelines = () => {
  return (
    <div className="prose max-w-none">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Community Guidelines</h1>
        <p className="text-sm text-gray-500">Last updated: February 16, 2026</p>
      </div>

      <Section title="Welcome to Footloose No More">
        <p>
          Our community is built on respect, honesty, and the shared goal of finding meaningful
          relationships. These guidelines help ensure a safe, positive experience for everyone.
        </p>
      </Section>

      <Section title="1. Be Authentic">
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Use real, recent photos of yourself</li>
          <li>Provide accurate information about your age, location, and background</li>
          <li>Don't impersonate others or create fake profiles</li>
          <li>One account per person only</li>
        </ul>
      </Section>

      <Section title="2. Be Respectful">
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Treat others with kindness and respect</li>
          <li>Accept rejection gracefully - not everyone will be a match</li>
          <li>Respect boundaries and preferences</li>
          <li>No harassment, bullying, or abusive language</li>
        </ul>
      </Section>

      <Section title="3. Be Safe">
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Never share financial information or send money</li>
          <li>Meet in public places for first dates</li>
          <li>Tell a friend or family member about your plans</li>
          <li>Trust your instincts - report suspicious behavior</li>
          <li>Use our Speed Dating feature to video chat before meeting</li>
        </ul>
      </Section>

      <Section title="4. Content Standards">
        <p>Do NOT post content that is:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Sexually explicit or pornographic</li>
          <li>Violent, graphic, or disturbing</li>
          <li>Hateful or discriminatory</li>
          <li>Promoting illegal activities</li>
          <li>Spam or commercial advertising</li>
          <li>Copyright infringing</li>
        </ul>
      </Section>

      <Section title="5. Communication Etiquette">
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Be patient - not everyone checks messages immediately</li>
          <li>Don't send inappropriate or unsolicited explicit content</li>
          <li>Avoid copy-paste generic messages - be genuine</li>
          <li>If someone doesn't respond, move on respectfully</li>
        </ul>
      </Section>

      <Section title="6. Speed Dating Etiquette">
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Be on time for scheduled calls</li>
          <li>Dress appropriately for video calls</li>
          <li>Find a quiet, well-lit space</li>
          <li>Be present and engaged during the conversation</li>
          <li>End calls respectfully</li>
        </ul>
      </Section>

      <Section title="7. Reporting and Enforcement">
        <p>
          If you see someone violating these guidelines, please report them. Our team reviews all
          reports and takes appropriate action:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>
            <strong>Warning:</strong> First-time minor violations
          </li>
          <li>
            <strong>Temporary Suspension:</strong> Repeated or moderate violations
          </li>
          <li>
            <strong>Permanent Ban:</strong> Serious violations (harassment, scams, illegal activity)
          </li>
        </ul>
      </Section>

      <Section title="8. We're Here to Help">
        <p>
          Questions about these guidelines? Need help? Contact our support team anytime. We're
          committed to maintaining a safe, welcoming community.
        </p>
      </Section>
    </div>
  );
};
