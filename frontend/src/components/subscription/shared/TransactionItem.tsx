import React from 'react';
import { Transaction } from '../../../types/subscription';
import { Check, X, Clock, RefreshCw } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'success':
        return <Check size={16} className="text-green-600" />;
      case 'failed':
        return <X size={16} className="text-red-600" />;
      case 'pending':
        return <Clock size={16} className="text-amber-600" />;
      case 'refunded':
        return <RefreshCw size={16} className="text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    const baseClasses = "text-xs font-semibold px-2 py-1 rounded-full";
    switch (transaction.status) {
      case 'success':
        return <span className={`${baseClasses} bg-green-100 text-green-700`}>Success</span>;
      case 'failed':
        return <span className={`${baseClasses} bg-red-100 text-red-700`}>Failed</span>;
      case 'pending':
        return <span className={`${baseClasses} bg-amber-100 text-amber-700`}>Pending</span>;
      case 'refunded':
        return <span className={`${baseClasses} bg-blue-100 text-blue-700`}>Refunded</span>;
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (transaction.type) {
      case 'credit_purchase':
        return 'Credits Purchased';
      case 'subscription_purchase':
        return 'Subscription Purchase';
      case 'credit_deduction':
        return 'Credits Used';
      case 'subscription_renewal':
        return 'Subscription Renewal';
      default:
        return transaction.type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 mb-3 border border-gray-200 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        {/* Left side */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getStatusIcon()}
            <p className="font-semibold text-[#1D3557]">{getTypeLabel()}</p>
          </div>
          <p className="text-sm text-gray-600">{formatDate(transaction.createdAt)}</p>
          {transaction.credits && (
            <p className="text-xs text-[#2A9D8F] font-semibold mt-1">
              {transaction.credits} credits
            </p>
          )}
          {transaction.razorpayPaymentId && (
            <p className="text-xs text-gray-400 mt-1 font-mono">
              {transaction.razorpayPaymentId}
            </p>
          )}
        </div>

        {/* Right side */}
        <div className="text-right">
          <p className="font-bold text-[#9B59B6] text-lg mb-1">
            ₹{transaction.totalAmount}
          </p>
          {getStatusBadge()}
        </div>
      </div>

      {/* Payment method */}
      {transaction.paymentMethod && transaction.status === 'success' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Paid via{' '}
            <span className="font-semibold uppercase">
              {transaction.paymentMethod}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
