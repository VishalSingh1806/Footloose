import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, Star, Users, Eye, Zap, MessageCircle, Shield } from 'lucide-react';

interface PremiumFeaturesProps {
  asModal?: boolean;
  onClose?: () => void;
}

export function PremiumFeatures({ asModal = false, onClose }: PremiumFeaturesProps) {
  const navigate = useNavigate();

  const features = [
    {
      icon: Crown,
      title: '1000 Credits Monthly',
      description: 'Never run out of credits. Get 1000 credits automatically every month.',
      color: '#F4A261',
    },
    {
      icon: Star,
      title: '50% Off Extra Credits',
      description: 'Get huge discounts when purchasing additional credit packages.',
      color: '#E63946',
    },
    {
      icon: Eye,
      title: 'See Who Liked You',
      description: 'Get full access to your admirers list and connect instantly.',
      color: '#2A9D8F',
    },
    {
      icon: MessageCircle,
      title: 'Unlimited Likes',
      description: 'Send unlimited likes and interests without any restrictions.',
      color: '#E63946',
    },
    {
      icon: Users,
      title: 'Advanced Filters',
      description: 'Use advanced search filters to find your perfect match faster.',
      color: '#F4A261',
    },
    {
      icon: Zap,
      title: 'Profile Boost (3x/month)',
      description: 'Boost your profile visibility 3 times per month for more matches.',
      color: '#2A9D8F',
    },
    {
      icon: Shield,
      title: 'Priority Support',
      description: 'Get priority customer support whenever you need help.',
      color: '#E63946',
    },
    {
      icon: Check,
      title: 'Ad-Free Experience',
      description: 'Enjoy a completely ad-free experience throughout the app.',
      color: '#F4A261',
    },
  ];

  const content = (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#FFF9E5] via-[#FEF3C7] to-[#FDE68A] pt-12 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#F4A261] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Crown size={40} className="text-white" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold text-[#1D3557] mb-4">Go Premium</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
            Unlock exclusive features and find your perfect match faster with Premium membership
          </p>
          <div className="flex items-center justify-center gap-2 text-3xl font-bold text-[#1D3557]">
            <span>₹999</span>
            <span className="text-xl text-gray-600">/month</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon size={28} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-bold text-[#1D3557] mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Value Proposition */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <h3 className="text-xl font-bold text-[#1D3557] mb-4 text-center">
            Why Premium Members Find Matches Faster
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-[#E63946] mb-1">3x</div>
              <p className="text-sm text-gray-600">More Profile Views</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2A9D8F] mb-1">5x</div>
              <p className="text-sm text-gray-600">More Connections</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#F4A261] mb-1">60%</div>
              <p className="text-sm text-gray-600">Higher Success Rate</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <h3 className="text-xl font-bold text-[#1D3557] mb-4 text-center">
            What Premium Users Say
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 mb-2">
                "Worth every rupee. Found my match within 2 weeks!"
              </p>
              <p className="text-xs text-gray-500">- Rajesh, 29</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 mb-2">
                "The unlimited credits make all the difference. No more worrying about running out."
              </p>
              <p className="text-xs text-gray-500">- Priya, 27</p>
            </div>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="bg-[#2A9D8F]/10 rounded-2xl p-6 text-center mb-8">
          <p className="text-2xl mb-2">😊</p>
          <p className="font-bold text-[#1D3557] mb-1">7-Day Money-Back Guarantee</p>
          <p className="text-sm text-gray-600">Try Premium risk-free. Cancel anytime.</p>
        </div>

        {/* CTA */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 shadow-2xl">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/subscription')}
              className="w-full bg-gradient-to-r from-[#E63946] to-[#F4A261] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Upgrade to Premium
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Cancel anytime • 7-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (asModal && onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-[#1D3557]">Premium Features</h1>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return content;
}
