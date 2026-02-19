import { useState, useEffect } from 'react';
import {
  Heart,
  Shield,
  Video,
  Target,
  Lock,
  Clock,
  CheckCircle,
  User,
  Sparkles,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  X
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 bg-white transition-shadow duration-200 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-7 h-7 text-[#E63946]" fill="#E63946" />
            <span className="text-xl font-semibold text-[#E63946]">Footloose No More</span>
          </div>
          <button
            onClick={() => setShowLoginModal(true)}
            className="text-[#E63946] font-semibold text-base hover:underline"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-5 bg-gradient-to-b from-[#FFE5E5] to-[#FAFAFA]">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-[28px] md:text-[36px] font-bold text-[#1D3557] mb-4 leading-tight">
            Find Your Perfect Match Through Real Conversations
          </h1>
          <p className="text-[17px] text-[#6C757D] mb-8 leading-relaxed">
            Meet verified profiles. Have 10-minute video dates. Build genuine connections. No endless swiping.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onGetStarted}
              className="w-full md:w-auto h-[52px] md:h-[48px] bg-[#E63946] hover:bg-[#D62828] text-white font-semibold text-base rounded-xl px-8 shadow-[0_2px_8px_rgba(230,57,70,0.2)] transition-all active:scale-[0.98]"
            >
              Get Started Free
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="w-full md:w-auto h-[52px] md:h-[48px] bg-transparent border-2 border-[#E63946] text-[#E63946] hover:bg-[#FFE5E5] font-semibold text-base rounded-xl px-8 transition-all"
            >
              How It Works
            </button>
          </div>
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E63946] to-[#F4A261] rounded-full opacity-20 blur-3xl"></div>
              <div className="relative flex items-center justify-center h-full">
                <Heart className="w-32 h-32 text-[#E63946]" fill="#E63946" />
                <Sparkles className="absolute top-8 right-8 w-8 h-8 text-[#F4A261]" />
                <Sparkles className="absolute bottom-12 left-8 w-6 h-6 text-[#2A9D8F]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Bar */}
      <section className="bg-white py-6 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 justify-around items-center">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-[#2A9D8F]" />
              <div>
                <p className="text-xl font-semibold text-[#1D3557]">50,000+</p>
                <p className="text-sm text-[#6C757D]">Active Users</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#2A9D8F]" />
              <div>
                <p className="text-xl font-semibold text-[#1D3557]">95%</p>
                <p className="text-sm text-[#6C757D]">Verified Profiles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Video className="w-8 h-8 text-[#2A9D8F]" />
              <div>
                <p className="text-xl font-semibold text-[#1D3557]">10-Min</p>
                <p className="text-sm text-[#6C757D]">Speed Dates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-semibold text-[#1D3557] mb-3">How Footloose No More Works</h2>
            <p className="text-[16px] text-[#6C757D]">Three simple steps to meaningful connections</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#F3F4F6] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E63946] text-white flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <CheckCircle className="w-10 h-10 text-[#2A9D8F]" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#1D3557] mb-2">Create Your Profile</h3>
              <p className="text-[14px] text-[#6C757D] leading-relaxed">
                Answer questions about yourself, your values, and what you're looking for. Get verified in minutes.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#F3F4F6] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E63946] text-white flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <Sparkles className="w-10 h-10 text-[#F4A261]" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#1D3557] mb-2">Get Smart Matches</h3>
              <p className="text-[14px] text-[#6C757D] leading-relaxed">
                We show you profiles that match your preferences for age, location, values, lifestyle, and family background.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#F3F4F6] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E63946] text-white flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <Video className="w-10 h-10 text-[#E63946]" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#1D3557] mb-2">Meet Face-to-Face</h3>
              <p className="text-[14px] text-[#6C757D] leading-relaxed">
                Request 10-minute video speed dates. See real chemistry before investing time in endless texting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-[#FAFAFA] py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-semibold text-[#1D3557] mb-3">Why Choose Footloose No More</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Shield className="w-8 h-8 text-[#2A9D8F] mb-3" />
              <h3 className="text-[18px] font-semibold text-[#1D3557] mb-2">Verified Profiles</h3>
              <p className="text-[14px] text-[#6C757D]">
                Government ID verification. Video verification. Trust scores visible on every profile.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Video className="w-8 h-8 text-[#E63946] mb-3" />
              <h3 className="text-[18px] font-semibold text-[#1D3557] mb-2">Speed Dating Built-In</h3>
              <p className="text-[14px] text-[#6C757D]">
                10-minute video dates prevent catfishing and time-wasting. See real chemistry fast.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Target className="w-8 h-8 text-[#2A9D8F] mb-3" />
              <h3 className="text-[18px] font-semibold text-[#1D3557] mb-2">Smart Matching</h3>
              <p className="text-[14px] text-[#6C757D]">
                See profiles based on your actual preferences — age, location, values, and lifestyle — not algorithmic scores.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Lock className="w-8 h-8 text-[#E63946] mb-3" />
              <h3 className="text-[18px] font-semibold text-[#1D3557] mb-2">Privacy First</h3>
              <p className="text-[14px] text-[#6C757D]">
                Control who sees your profile. In-app chat before sharing contact details.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Clock className="w-8 h-8 text-[#2A9D8F] mb-3" />
              <h3 className="text-[18px] font-semibold text-[#1D3557] mb-2">No Endless Swiping</h3>
              <p className="text-[14px] text-[#6C757D]">
                Quality over quantity. See fewer, better matches. Focus on real connections.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Heart className="w-8 h-8 text-[#E63946] mb-3" />
              <h3 className="text-[18px] font-semibold text-[#1D3557] mb-2">Serious Seekers Only</h3>
              <p className="text-[14px] text-[#6C757D]">
                Designed for people ready for committed relationships, not casual dating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-semibold text-[#1D3557] mb-3">Success Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FFE5E5] rounded-xl p-6 border-l-4 border-[#E63946]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#E63946] to-[#F4A261] flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" fill="white" />
                </div>
                <div>
                  <p className="font-semibold text-[#1D3557]">Priya & Rahul</p>
                  <p className="text-sm text-[#6C757D]">Mumbai</p>
                </div>
              </div>
              <p className="text-[16px] text-[#1D3557] italic leading-relaxed">
                "I had my first speed date within 2 days of joining. We're now planning our wedding!"
              </p>
            </div>
            <div className="bg-[#FFE5E5] rounded-xl p-6 border-l-4 border-[#E63946]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#2A9D8F] to-[#06D6A0] flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#1D3557]">Anjali, 28</p>
                  <p className="text-sm text-[#6C757D]">Bangalore</p>
                </div>
              </div>
              <p className="text-[16px] text-[#1D3557] italic leading-relaxed">
                "Finally, a platform that values genuine connection over superficial swiping."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-[#E63946] to-[#D62828] py-16 px-5 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[28px] md:text-[32px] font-bold mb-3">Ready to Find Your Match?</h2>
          <p className="text-[17px] mb-8 opacity-95">
            Join 50,000+ verified members looking for serious relationships
          </p>
          <button
            onClick={onGetStarted}
            className="h-[52px] md:h-[48px] bg-white text-[#E63946] hover:bg-[#FFE5E5] font-semibold text-base rounded-xl px-10 shadow-lg transition-all active:scale-[0.98] inline-flex items-center gap-2"
          >
            Create Free Account
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-sm mt-4 opacity-80">
            No credit card required • Free to join • 2 minutes to start
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1D3557] text-white py-12 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-6 h-6" fill="white" />
                <span className="text-lg font-semibold">Footloose No More</span>
              </div>
              <p className="text-sm opacity-80">Serious relationships. Real connections.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Links</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100 transition-opacity">About Us</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">How It Works</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Safety Tips</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@footloosenomo.re</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 XXX XXX XXXX</span>
                </li>
              </ul>
              <div className="flex gap-4 mt-4">
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 text-center text-sm opacity-80">
            © 2026 Footloose No More. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[20px] p-6 max-w-[400px] w-full animate-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#1D3557]">Welcome Back</h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-[#6C757D] hover:bg-[#F3F4F6] rounded p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#1D3557] mb-2">Email or Phone</label>
                <input
                  type="text"
                  placeholder="Enter your email or phone"
                  className="w-full h-[52px] border border-[#E5E7EB] rounded-xl px-4 text-base focus:outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1D3557] mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full h-[52px] border border-[#E5E7EB] rounded-xl px-4 text-base focus:outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 transition-all"
                />
              </div>
            </div>
            <button className="w-full h-[52px] bg-[#E63946] hover:bg-[#D62828] text-white font-semibold text-base rounded-xl transition-all">
              Login
            </button>
            <p className="text-center text-sm text-[#6C757D] mt-4">
              Don't have an account?{' '}
              <button className="text-[#E63946] font-semibold hover:underline">
                Sign up free
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
