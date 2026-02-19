import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Coins, ChevronLeft } from 'lucide-react';
import { PackageCard } from './shared/PackageCard';
import { CREDIT_PACKAGES } from '../../services/mockAPI';
import { purchaseCredits } from '../../services/paymentService';
import { calculateGST } from '../../services/creditService';

export function PurchaseCredits() {
  const navigate = useNavigate();
  const { creditBalance, refreshBalance } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(
    CREDIT_PACKAGES.find(p => p.popular)?.id || null
  );
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setPurchasing(true);

    try {
      const result = await purchaseCredits(selectedPackage);

      if (result.success) {
        // Navigate to success page
        navigate('/payment/success', {
          state: {
            credits: result.credits,
            packageId: selectedPackage,
          },
        });
        // Refresh balance
        refreshBalance();
      } else {
        // Navigate to failure page
        navigate('/payment/failed', {
          state: {
            error: result.error,
            packageId: selectedPackage,
          },
        });
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      navigate('/payment/failed', {
        state: {
          error: error.message || 'Payment failed',
          packageId: selectedPackage,
        },
      });
    } finally {
      setPurchasing(false);
    }
  };

  const selectedPkg = CREDIT_PACKAGES.find(p => p.id === selectedPackage);
  const { gst, total } = selectedPkg ? calculateGST(selectedPkg.price) : { gst: 0, total: 0 };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-32">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-[#1D3557]" />
          </button>
          <h1 className="text-xl font-bold text-[#1D3557] ml-3">Purchase Credits</h1>
        </div>
      </div>

      {/* Current Balance */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-[#F4A261]/10 border border-[#F4A261]/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins size={20} className="text-[#F4A261]" />
            <span className="text-sm text-gray-700">Current Balance:</span>
          </div>
          <span className="text-lg font-bold text-[#F4A261]">
            {creditBalance.toLocaleString()} credits
          </span>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#1D3557] mb-3 sm:mb-4">Choose a Package</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {CREDIT_PACKAGES.map(pkg => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              selected={selectedPackage === pkg.id}
              onSelect={setSelectedPackage}
            />
          ))}
        </div>
      </div>

      {/* Payment Methods Preview */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-sm text-gray-600 text-center mb-2">We accept:</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-xs font-semibold text-gray-700">
            UPI
          </div>
          <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-xs font-semibold text-gray-700">
            Cards
          </div>
          <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-xs font-semibold text-gray-700">
            Net Banking
          </div>
          <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-xs font-semibold text-gray-700">
            Wallets
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      {selectedPackage && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 shadow-2xl z-20">
          <div className="max-w-7xl mx-auto">
            {/* Summary */}
            <div className="mb-2 sm:mb-3">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">You selected:</p>
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className="text-sm sm:text-base font-semibold text-[#1D3557]">
                  {selectedPkg?.totalCredits} Credits
                </span>
                <span className="text-xs sm:text-sm text-gray-600">₹{selectedPkg?.price}</span>
              </div>
              {selectedPkg && selectedPkg.bonusCredits > 0 && (
                <p className="text-xs text-green-600 font-semibold mb-1 sm:mb-2">
                  +{selectedPkg.bonusCredits} bonus credits included
                </p>
              )}
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">GST (18%)</span>
                <span className="text-gray-600">₹{gst}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-1.5 sm:pt-2 mt-1.5 sm:mt-2">
                <span className="text-sm sm:text-base font-bold text-[#1D3557]">Total</span>
                <span className="text-lg sm:text-xl font-bold text-[#E63946]">₹{total}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full bg-[#E63946] text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:bg-[#D62839] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {purchasing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Proceed to Payment</span>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-2">
              🔒 Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
