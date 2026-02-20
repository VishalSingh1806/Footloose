import { Filter, Lock, X } from 'lucide-react';

function FilterPrompt({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleUpdatePreferences = () => {
    // Open partner preferences editor
    console.log('Navigate to partner preferences');
    onClose();
  };

  const handleUpgradeToPremium = () => {
    // Open subscription plans
    console.log('Navigate to subscription plans');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 px-5">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center">
              <Filter className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1D3557]">Advanced Filters</h2>
              <p className="text-xs text-[#6C757D]">Available with Premium</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#6C757D]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Premium Features */}
          <div className="bg-gradient-to-br from-[#FFF9E5] to-[#FEF3C7] rounded-xl p-5 border border-[#FCD34D] mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-[#D97706]" />
              <h3 className="text-base font-semibold text-[#1D3557]">
                Premium Features
              </h3>
            </div>

            <p className="text-sm text-[#6C757D] mb-4">
              Premium members can filter by:
            </p>

            <ul className="space-y-2 mb-0">
              <li className="flex items-center gap-2 text-sm text-[#1D3557]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                Income range
              </li>
              <li className="flex items-center gap-2 text-sm text-[#1D3557]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                Education level
              </li>
              <li className="flex items-center gap-2 text-sm text-[#1D3557]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                Height preferences
              </li>
              <li className="flex items-center gap-2 text-sm text-[#1D3557]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                Lifestyle choices
              </li>
              <li className="flex items-center gap-2 text-sm text-[#1D3557]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                Family background
              </li>
              <li className="flex items-center gap-2 text-sm text-[#1D3557]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                And more
              </li>
            </ul>
          </div>

          {/* Current Available Filters */}
          <div className="bg-[#F9FAFB] rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-[#1D3557] mb-2">
              You can adjust basic preferences:
            </h3>
            <p className="text-sm text-[#6C757D] mb-3">
              Age range, location, and religion preferences are free to update
            </p>
            <button
              onClick={handleUpdatePreferences}
              className="text-sm text-[#9B59B6] font-medium underline hover:no-underline"
            >
              Update Partner Preferences
            </button>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={handleUpgradeToPremium}
              className="w-full h-12 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Upgrade to Premium
            </button>

            <button
              onClick={onClose}
              className="w-full h-11 bg-transparent text-[#6C757D] font-medium hover:text-[#1D3557] transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPrompt;
