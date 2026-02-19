import React from 'react';
import { Coins } from 'lucide-react';

interface CreditBadgeProps {
  balance: number;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  className?: string;
}

export function CreditBadge({
  balance,
  size = 'medium',
  showIcon = true,
  className = '',
}: CreditBadgeProps) {
  const sizeClasses = {
    small: 'text-sm px-2 py-1',
    medium: 'text-base px-3 py-1.5',
    large: 'text-lg px-4 py-2',
  };

  const iconSizes = {
    small: 14,
    medium: 16,
    large: 20,
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-[#F4A261]/10 border border-[#F4A261]/30 rounded-full font-semibold text-[#F4A261] ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Coins size={iconSizes[size]} />}
      <span>{balance.toLocaleString()}</span>
    </div>
  );
}
