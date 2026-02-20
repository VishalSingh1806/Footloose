import React from 'react';
import { CreditPackage } from '../../../types/subscription';
import { calculateGST } from '../../../services/creditService';

interface PackageCardProps {
  package: CreditPackage;
  onSelect: (packageId: string) => void;
  selected?: boolean;
}

export function PackageCard({ package: pkg, onSelect, selected }: PackageCardProps) {
  const { gst, total } = calculateGST(pkg.price);
  const perCreditCost = (pkg.price / pkg.totalCredits).toFixed(2);

  return (
    <div
      onClick={() => onSelect(pkg.id)}
      className={`relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
        selected ? 'border-3 border-[#9B59B6] bg-[#FFF5F5]' : 'border-2 border-[#E5E7EB]'
      } ${pkg.popular ? 'ring-2 ring-[#9B59B6] ring-offset-2' : ''}`}
    >
      {/* Badge */}
      {pkg.badge && (
        <div className={`absolute -top-2 sm:-top-3 right-3 sm:right-4 px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
          pkg.popular ? 'bg-[#9B59B6] text-white' : 'bg-[#8E44AD] text-white'
        }`}>
          {pkg.badge}
        </div>
      )}

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 bg-[#9B59B6] rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Credits */}
      <div className="text-3xl sm:text-4xl font-bold text-[#1D3557] mb-1 sm:mb-2">
        {pkg.totalCredits.toLocaleString()}
      </div>
      <p className="text-xs sm:text-sm text-gray-600 mb-1">{pkg.credits} credits</p>

      {/* Bonus */}
      {pkg.bonusCredits > 0 && (
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            +{pkg.bonusCredits} bonus ({pkg.savingsPercent}% extra)
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="my-3 sm:my-4 border-t border-gray-200" />

      {/* Price */}
      <div className="mb-2">
        <span className="text-2xl sm:text-3xl font-bold text-[#9B59B6]">₹{pkg.price}</span>
        <span className="text-xs sm:text-sm text-gray-500 ml-2">+ ₹{gst} GST</span>
      </div>

      <p className="text-xs text-gray-500 mb-2 sm:mb-3">
        ₹{perCreditCost} per credit
      </p>

      {/* What you can do */}
      <div className="text-xs text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg">
        <p className="font-semibold mb-1">What you can do:</p>
        <p>
          ~{Math.floor(pkg.totalCredits / 200)} Speed Dates or{' '}
          {Math.floor(pkg.totalCredits / 150)} Chat Unlocks
        </p>
      </div>

      {/* Button */}
      <button
        className={`w-full mt-3 sm:mt-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
          selected
            ? 'bg-[#9B59B6] text-white'
            : 'bg-gray-100 text-[#1D3557] hover:bg-gray-200'
        }`}
      >
        {selected ? 'Selected' : 'Select'}
      </button>
    </div>
  );
}
