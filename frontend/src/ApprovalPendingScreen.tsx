import { Clock, Mail, MessageCircle } from 'lucide-react';

interface ApprovalPendingScreenProps {
  // Optional: callback if user needs support
  onContactSupport?: () => void;
}

function ApprovalPendingScreen({ onContactSupport }: ApprovalPendingScreenProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-5 py-12">
      <div className="max-w-[500px] w-full">

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#D1FAE5] flex items-center justify-center">
            <Clock className="w-10 h-10 text-[#2A9D8F]" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-4 text-center">
          Profile under review
        </h1>

        {/* Body Text */}
        <div className="space-y-4 mb-8 text-center">
          <p className="text-base text-[#6C757D] leading-relaxed">
            We'll notify you when your profile is approved.
          </p>

          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            This typically takes a few hours.
          </p>
        </div>

        {/* Notification Methods */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-8">
          <p className="text-sm font-medium text-[#1D3557] mb-4">
            You will be notified via:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-[#16A34A]" />
              </div>
              <span className="text-sm text-[#6C757D]">WhatsApp message</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-[#2563EB]" />
              </div>
              <span className="text-sm text-[#6C757D]">Email notification</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#F3F4F6] rounded-xl p-4 border border-[#E5E7EB] mb-6">
          <p className="text-sm text-[#6C757D] leading-relaxed text-center">
            Your profile is currently not visible to others. You will gain access to view matches once approved.
          </p>
        </div>

        {/* Optional: Contact Support Link */}
        {onContactSupport && (
          <div className="text-center">
            <button
              onClick={onContactSupport}
              className="text-sm text-[#E63946] hover:text-[#D62828] transition-colors"
            >
              Need help? Contact support
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovalPendingScreen;
