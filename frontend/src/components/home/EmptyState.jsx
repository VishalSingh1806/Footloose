import { CheckCircle, Settings, Sparkles } from 'lucide-react';

function EmptyState({ onUpdatePreferences, isPremium = false }) {
  const handleUpdatePreferences = () => {
    // Open partner preferences editor
    if (onUpdatePreferences) {
      onUpdatePreferences();
    }
  };

  const handleUpgradeToPremium = () => {
    // Open subscription plans
    console.log('Navigate to subscription plans');
  };

  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 max-w-md mx-auto">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-[#D1FAE5] flex items-center justify-center mb-6">
        <CheckCircle className="w-8 h-8 text-[#06D6A0]" />
      </div>

      {/* Heading */}
      <h2 className="text-[22px] font-semibold text-[#1D3557] mb-3 text-center">
        That's all for today
      </h2>

      {/* Body Text */}
      <p className="text-[15px] text-[#6C757D] leading-[1.6] text-center mb-2">
        New matches will be available tomorrow.
      </p>

      <p className="text-[15px] font-semibold text-[#1D3557] text-center mb-6 mt-4">
        Want more matches?
      </p>

      {/* Options */}
      <div className="w-full space-y-3">
        {/* Option 1: Adjust Preferences */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[#1D3557] mb-1">
                Adjust Preferences
              </h3>
              <p className="text-sm text-[#6C757D] leading-relaxed">
                Update your partner preferences to see more profiles
              </p>
            </div>
          </div>
          <button
            onClick={handleUpdatePreferences}
            className="w-full h-11 bg-white border-2 border-[#E5E7EB] text-[#1D3557] font-semibold text-sm rounded-xl hover:bg-[#FAFAFA] transition-colors"
          >
            Update Preferences
          </button>
        </div>

        {/* Option 2: Upgrade to Premium (if free user) */}
        {!isPremium && (
          <div className="bg-[#FFF9E5] rounded-xl border border-[#FCD34D] p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#D97706]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#1D3557] mb-1">
                  Upgrade to Premium
                </h3>
                <p className="text-sm text-[#6C757D] leading-relaxed">
                  Premium members get advanced filters and see more matches daily
                </p>
              </div>
            </div>
            <button
              onClick={handleUpgradeToPremium}
              className="w-full h-11 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-semibold text-sm rounded-xl hover:shadow-lg transition-all"
            >
              View Premium Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
