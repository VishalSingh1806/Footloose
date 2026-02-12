import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Filter, Download } from 'lucide-react';
import { TransactionItem } from './shared/TransactionItem';
import { Transaction, TransactionFilters } from '../../types/subscription';
import {
  getTransactions,
  getTransactionsGroupedByDate,
  downloadTransactionsCSV,
} from '../../services/transactionService';

export function TransactionHistory() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [filter, setFilter] = useState<'all' | 'credits_in' | 'credits_out'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const filters: TransactionFilters = {};

      if (filter === 'credits_in') {
        filters.type = 'credit_purchase';
      } else if (filter === 'credits_out') {
        filters.type = 'credit_deduction';
      }

      const grouped = await getTransactionsGroupedByDate();
      setTransactions(grouped);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadTransactionsCSV();
    } catch (error) {
      console.error('Error downloading transactions:', error);
    }
  };

  const allTransactions = Object.values(transactions).flat();
  const isEmpty = allTransactions.length === 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} className="text-[#1D3557]" />
            </button>
            <h1 className="text-xl font-bold text-[#1D3557] ml-3">Transaction History</h1>
          </div>

          <button
            onClick={handleDownload}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Download size={20} className="text-[#1D3557]" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-[#E63946] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('credits_in')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filter === 'credits_in'
                  ? 'bg-[#E63946] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Credits In
            </button>
            <button
              onClick={() => setFilter('credits_out')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filter === 'credits_out'
                  ? 'bg-[#E63946] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Credits Out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E63946] border-t-transparent" />
          </div>
        ) : isEmpty ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Receipt size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-[#1D3557] mb-2">No transactions yet</h3>
            <p className="text-gray-600 text-center mb-6">
              Your purchase history will appear here
            </p>
            <button
              onClick={() => navigate('/credits/purchase')}
              className="bg-[#E63946] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D62839] transition-colors"
            >
              Buy Credits
            </button>
          </div>
        ) : (
          /* Transaction List */
          <div>
            {Object.entries(transactions).map(([month, txns]) => (
              <div key={month} className="mb-6">
                <h3 className="text-lg font-bold text-[#1D3557] mb-3 px-2">{month}</h3>
                <div>
                  {txns.map(transaction => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      onClick={() => {
                        // TODO: Show transaction details modal
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
