/**
 * Help Center Component
 * FAQs and help guides with search functionality
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, ChevronDown, ChevronUp, BookOpen, Clock } from 'lucide-react';
import type { FAQ, HelpGuide } from '../../types/settings';

// Mock FAQ data
const MOCK_FAQS: FAQ[] = [
  {
    id: 'faq_1',
    question: 'How do I create a profile?',
    answer: 'To create your profile, tap on "Edit Profile" from the home screen. Add your photos, write a bio, fill in your preferences, and save. Your profile will be reviewed and approved within 24 hours.',
    category: 'Getting Started',
    helpful: 45,
  },
  {
    id: 'faq_2',
    question: 'What is Speed Dating?',
    answer: 'Speed Dating is our unique feature where you can have quick 5-minute video calls with potential matches. Send a request, wait for acceptance, and connect at the scheduled time!',
    category: 'Speed Dating',
    helpful: 89,
  },
  {
    id: 'faq_3',
    question: 'How do I report inappropriate behavior?',
    answer: 'Tap the three dots menu on any profile or conversation, then select "Report". Choose the reason and provide details. Our team reviews reports within 24 hours.',
    category: 'Safety',
    helpful: 67,
  },
  {
    id: 'faq_4',
    question: 'Can I cancel my subscription?',
    answer: 'Yes! Go to Settings > Subscription > Manage Subscription. You can cancel anytime, and you\'ll keep your premium features until the end of the billing period.',
    category: 'Billing',
    helpful: 34,
  },
  {
    id: 'faq_5',
    question: 'How does matching work?',
    answer: 'Our AI-powered algorithm considers your preferences, interests, values, and compatibility scores to suggest the best matches. You can filter by location, age, education, and more.',
    category: 'Matching',
    helpful: 78,
  },
  {
    id: 'faq_6',
    question: 'Is my data secure?',
    answer: 'Absolutely! We use bank-level encryption, never share your data with third parties, and comply with GDPR. You can download or delete your data anytime.',
    category: 'Privacy',
    helpful: 92,
  },
  {
    id: 'faq_7',
    question: 'How do I verify my profile?',
    answer: 'Go to Settings > Account Settings. Verify your email and phone number. For photo verification, submit a selfie holding a specific pose - approval takes 2-4 hours.',
    category: 'Account',
    helpful: 56,
  },
  {
    id: 'faq_8',
    question: 'What if I forget my password?',
    answer: 'On the login screen, tap "Forgot Password". Enter your email or phone number, and we\'ll send you a reset link. Follow the instructions to create a new password.',
    category: 'Account',
    helpful: 41,
  },
];

// Mock Help Guides
const MOCK_GUIDES: HelpGuide[] = [
  {
    id: 'guide_1',
    title: 'Getting Started Guide',
    description: 'Learn the basics of using Footloose No More',
    content: 'Complete guide content here...',
    readTime: 5,
    category: 'Basics',
    icon: 'book',
  },
  {
    id: 'guide_2',
    title: 'Creating an Attractive Profile',
    description: 'Tips for making your profile stand out',
    content: 'Complete guide content here...',
    readTime: 8,
    category: 'Profile',
    icon: 'user',
  },
  {
    id: 'guide_3',
    title: 'Speed Dating Best Practices',
    description: 'How to make the most of speed dating',
    content: 'Complete guide content here...',
    readTime: 6,
    category: 'Speed Dating',
    icon: 'video',
  },
  {
    id: 'guide_4',
    title: 'Staying Safe Online',
    description: 'Important safety tips for online dating',
    content: 'Complete guide content here...',
    readTime: 10,
    category: 'Safety',
    icon: 'shield',
  },
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [guides, setGuides] = useState<HelpGuide[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHelpContent();
  }, []);

  const loadHelpContent = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFaqs(MOCK_FAQS);
      setGuides(MOCK_GUIDES);
    } catch (error) {
      console.error('Failed to load help content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E63946]"></div>
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
          <h1 className="flex-1 text-xl font-bold text-gray-900 ml-2">Help Center</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Help Guides */}
        {(!searchQuery || filteredGuides.length > 0) && (
          <Section title="Help Guides">
            <div className="grid grid-cols-1 gap-3">
              {filteredGuides.map((guide) => (
                <button
                  key={guide.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-[#E63946] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E63946] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} className="text-[#E63946]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{guide.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={14} />
                        <span>{guide.readTime} min read</span>
                        <span className="mx-1">•</span>
                        <span>{guide.category}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* FAQs by Category */}
        {(!searchQuery || filteredFaqs.length > 0) && (
          <>
            {categories.map((category) => {
              const categoryFaqs = searchQuery
                ? filteredFaqs.filter((faq) => faq.category === category)
                : faqs.filter((faq) => faq.category === category);

              if (categoryFaqs.length === 0) return null;

              return (
                <Section key={category} title={category}>
                  <div className="divide-y divide-gray-100">
                    {categoryFaqs.map((faq) => (
                      <FAQItem
                        key={faq.id}
                        faq={faq}
                        isExpanded={expandedFaq === faq.id}
                        onToggle={() =>
                          setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                        }
                      />
                    ))}
                  </div>
                </Section>
              );
            })}
          </>
        )}

        {/* No Results */}
        {searchQuery && filteredFaqs.length === 0 && filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try different keywords or browse all FAQs
            </p>
          </div>
        )}

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-[#E63946] to-[#d62839] rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Still need help?</h3>
          <p className="text-sm mb-4 text-white text-opacity-90">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <button
            onClick={() => navigate('/settings/contact-support')}
            className="w-full py-3 bg-white text-[#E63946] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
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
      {children}
    </div>
  );
};

const FAQItem: React.FC<{
  faq: FAQ;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ faq, isExpanded, onToggle }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm mb-2 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{faq.answer}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{faq.helpful} people found this helpful</span>
          </div>
        </div>
      )}
    </div>
  );
};
