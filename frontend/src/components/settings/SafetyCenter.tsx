/**
 * Safety Center Component
 * Safety guidelines, red flags, reporting instructions, emergency contacts
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Shield,
  AlertTriangle,
  Flag,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const SAFETY_GUIDELINES = [
  {
    id: 1,
    icon: Shield,
    title: 'Protect Your Personal Information',
    description:
      'Never share sensitive information like your address, financial details, or workplace location until you build trust.',
  },
  {
    id: 2,
    icon: AlertTriangle,
    title: 'Meet in Public Places',
    description:
      'First meetings should always be in public, well-lit places. Inform a friend or family member about your plans.',
  },
  {
    id: 3,
    icon: Shield,
    title: 'Trust Your Instincts',
    description:
      'If something feels off, it probably is. Don\'t hesitate to end a conversation or meeting if you feel uncomfortable.',
  },
  {
    id: 4,
    icon: Shield,
    title: 'Video Call Before Meeting',
    description:
      'Use our Speed Dating feature to video chat before meeting in person. This helps verify identity and build comfort.',
  },
];

const RED_FLAGS = [
  {
    id: 1,
    title: 'Asking for Money',
    description:
      'Anyone asking for money, loans, or financial help is a major red flag. Report immediately.',
  },
  {
    id: 2,
    title: 'Moving Too Fast',
    description:
      'Declarations of love or marriage within days, pressure to move off-platform immediately.',
  },
  {
    id: 3,
    title: 'Avoiding Video Calls',
    description:
      'Refusing video calls despite repeated requests may indicate catfishing or fake profiles.',
  },
  {
    id: 4,
    title: 'Inconsistent Stories',
    description:
      'Information that doesn\'t add up, contradictory details about their life or background.',
  },
  {
    id: 5,
    title: 'Inappropriate Behavior',
    description:
      'Harassment, explicit content, aggressive language, or making you feel uncomfortable.',
  },
  {
    id: 6,
    title: 'Too Good to Be True',
    description:
      'Perfect profiles, professional photos, or stories that seem unrealistic or fabricated.',
  },
];

const EMERGENCY_CONTACTS = [
  { name: 'Women Helpline', number: '1091', available: '24/7' },
  { name: 'National Emergency', number: '112', available: '24/7' },
  { name: 'Cyber Crime', number: '1930', available: '24/7' },
];

export default function SafetyCenter() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>('guidelines');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
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
          <h1 className="flex-1 text-xl font-bold text-gray-900 ml-2">Safety Center</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Safety Pledge */}
        <div className="bg-gradient-to-r from-[#9B59B6] to-[#d62839] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Your Safety is Our Priority</h2>
          </div>
          <p className="text-sm text-white text-opacity-90">
            We're committed to creating a safe environment for finding your life partner. Follow
            these guidelines to protect yourself.
          </p>
        </div>

        {/* Safety Guidelines */}
        <CollapsibleSection
          title="Safety Guidelines"
          isExpanded={expandedSection === 'guidelines'}
          onToggle={() => toggleSection('guidelines')}
        >
          <div className="space-y-3">
            {SAFETY_GUIDELINES.map((guideline) => {
              const Icon = guideline.icon;
              return (
                <div
                  key={guideline.id}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{guideline.title}</h3>
                    <p className="text-sm text-gray-600">{guideline.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Red Flags */}
        <CollapsibleSection
          title="Warning Signs & Red Flags"
          isExpanded={expandedSection === 'redflags'}
          onToggle={() => toggleSection('redflags')}
        >
          <div className="space-y-2">
            {RED_FLAGS.map((flag) => (
              <div key={flag.id} className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{flag.title}</h3>
                  <p className="text-sm text-gray-600">{flag.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* How to Report */}
        <CollapsibleSection
          title="How to Report"
          isExpanded={expandedSection === 'report'}
          onToggle={() => toggleSection('report')}
        >
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex gap-3">
                <Flag size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Report Suspicious Activity
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    If you encounter inappropriate behavior, fake profiles, or feel unsafe:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Go to the user's profile</li>
                    <li>Tap the three dots menu (•••)</li>
                    <li>Select "Report User"</li>
                    <li>Choose a reason and provide details</li>
                    <li>Submit the report</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">What Happens Next?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#9B59B6] font-bold">•</span>
                  <span>Our team reviews all reports within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9B59B6] font-bold">•</span>
                  <span>Reported user may be warned, suspended, or banned</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9B59B6] font-bold">•</span>
                  <span>Your report is confidential and anonymous</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9B59B6] font-bold">•</span>
                  <span>You'll receive a notification about the outcome</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/settings/contact-support')}
              className="w-full py-3 px-4 bg-[#9B59B6] text-white rounded-lg font-semibold hover:bg-[#d62839] transition-colors flex items-center justify-center gap-2"
            >
              <Flag size={20} />
              Contact Support Team
            </button>
          </div>
        </CollapsibleSection>

        {/* Block & Unblock */}
        <CollapsibleSection
          title="Block & Unblock Users"
          isExpanded={expandedSection === 'block'}
          onToggle={() => toggleSection('block')}
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">How to Block</h3>
              <p className="text-sm text-gray-600 mb-3">
                Blocking prevents someone from viewing your profile or contacting you:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Go to the user's profile</li>
                <li>Tap three dots menu (•••)</li>
                <li>Select "Block User"</li>
                <li>Confirm blocking</li>
              </ol>
            </div>

            <button
              onClick={() => navigate('/settings/blocked-users')}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Blocked Users
            </button>
          </div>
        </CollapsibleSection>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Phone size={20} className="text-[#9B59B6]" />
            Emergency Contacts
          </h2>
          <div className="space-y-3">
            {EMERGENCY_CONTACTS.map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-gray-900">{contact.name}</div>
                  <div className="text-sm text-gray-600">{contact.available}</div>
                </div>
                <a
                  href={`tel:${contact.number}`}
                  className="px-4 py-2 bg-[#9B59B6] text-white rounded-lg font-semibold hover:bg-[#d62839] transition-colors"
                >
                  {contact.number}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Resources */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Safety Resources</h2>
          <div className="space-y-2">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-gray-900">National Cyber Crime Portal</span>
              <ExternalLink size={18} className="text-gray-400" />
            </a>
            <a
              href="https://www.ncw.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-gray-900">National Commission for Women</span>
              <ExternalLink size={18} className="text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components

const CollapsibleSection: React.FC<{
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isExpanded, onToggle, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-500" />
        ) : (
          <ChevronDown size={20} className="text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="p-4 pt-0">{children}</div>}
    </div>
  );
};
