import { Phone, Mail, MessageCircle, Lock, Crown } from 'lucide-react';
import ProfileSection from './ProfileSection';

interface ContactCardProps {
  isUnlocked: boolean;
  contactInfo?: {
    mobile: string;
    email: string;
    whatsapp: string;
  };
  onUpgrade?: () => void;
}

function ContactCard({ isUnlocked, contactInfo, onUpgrade }: ContactCardProps) {
  const handleCall = () => {
    if (contactInfo?.mobile) {
      window.location.href = `tel:${contactInfo.mobile}`;
    }
  };

  const handleWhatsApp = () => {
    if (contactInfo?.whatsapp) {
      window.open(`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (contactInfo?.email) {
      window.location.href = `mailto:${contactInfo.email}`;
    }
  };

  if (!isUnlocked) {
    return (
      <div className="mx-4 mb-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#1D3557] mb-2">Contact Details Locked</h3>
          <p className="text-sm text-[#6C757D] mb-6">
            Send interest or request a speed date to connect with this profile
          </p>
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 px-6
                         rounded-lg font-semibold flex items-center justify-center gap-2
                         hover:from-amber-500 hover:to-orange-600 transition-all"
            >
              <Crown size={20} />
              <span>Upgrade to Premium</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ProfileSection title="Contact Information" className="bg-green-50 border-2 border-green-200">
      <div className="flex items-center gap-2 text-green-700 mb-4">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Lock size={14} className="text-white" />
        </div>
        <span className="text-sm font-semibold">Verified Contact Details</span>
      </div>

      <div className="space-y-3 mb-6">
        {contactInfo?.mobile && (
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-[#6C757D]">Mobile</span>
            <span className="text-[15px] text-[#1D3557] font-medium">{contactInfo.mobile}</span>
          </div>
        )}
        {contactInfo?.email && (
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-[#6C757D]">Email</span>
            <span className="text-[15px] text-[#1D3557] font-medium">{contactInfo.email}</span>
          </div>
        )}
        {contactInfo?.whatsapp && (
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-[#6C757D]">WhatsApp</span>
            <span className="text-[15px] text-[#1D3557] font-medium">{contactInfo.whatsapp}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCall}
          className="flex-1 bg-white border-2 border-green-200 text-green-700 py-3 px-4
                     rounded-lg font-semibold flex items-center justify-center gap-2
                     hover:bg-green-50 transition-all"
        >
          <Phone size={18} />
          <span>Call</span>
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex-1 bg-white border-2 border-green-200 text-green-700 py-3 px-4
                     rounded-lg font-semibold flex items-center justify-center gap-2
                     hover:bg-green-50 transition-all"
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </button>
        <button
          onClick={handleEmail}
          className="flex-1 bg-white border-2 border-green-200 text-green-700 py-3 px-4
                     rounded-lg font-semibold flex items-center justify-center gap-2
                     hover:bg-green-50 transition-all"
        >
          <Mail size={18} />
          <span>Email</span>
        </button>
      </div>
    </ProfileSection>
  );
}

export default ContactCard;
