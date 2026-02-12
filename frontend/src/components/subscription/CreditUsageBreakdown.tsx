import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingDown } from 'lucide-react';
import { getUsageBreakdown, getCreditUsageHistory } from '../../services/creditService';
import { CreditUsage } from '../../types/subscription';

export function CreditUsageBreakdown() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<number>(7);
  const [usageData, setUsageData] = useState<any>(null);
  const [recentUsage, setRecentUsage] = useState<CreditUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsageData();
  }, [period]);

  const loadUsageData = async () => {
    setLoading(true);
    try {
      const data = await getUsageBreakdown(period);
      setUsageData(data);

      const usage = await getCreditUsageHistory(20);
      setRecentUsage(usage);
    } catch (error) {
      console.error('Error loading usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E63946] border-t-transparent" />
      </div>
    );
  }

  const isEmpty = !usageData || usageData.totalCredits === 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-[#1D3557]" />
          </button>
          <h1 className="text-xl font-bold text-[#1D3557] ml-3">Credit Usage</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Period Selector */}
        <div className="mb-6">
          <select
            value={period}
            onChange={e => setPeriod(Number(e.target.value))}
            className="w-full md:w-auto px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-[#1D3557] focus:outline-none focus:ring-2 focus:ring-[#E63946]"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 3 months</option>
          </select>
        </div>

        {isEmpty ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <TrendingDown size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-[#1D3557] mb-2">No activity yet</h3>
            <p className="text-gray-600 text-center mb-6">
              Start using credits to see your usage breakdown
            </p>
            <button
              onClick={() => navigate('/matches')}
              className="bg-[#E63946] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D62839] transition-colors"
            >
              Find Matches
            </button>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <h2 className="text-lg font-bold text-[#1D3557] mb-4">Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Credits Used</p>
                  <p className="text-3xl font-bold text-[#E63946]">
                    {usageData.totalCredits.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transactions</p>
                  <p className="text-3xl font-bold text-[#2A9D8F]">
                    {usageData.transactions}
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <h2 className="text-lg font-bold text-[#1D3557] mb-4">Breakdown by Type</h2>
              <div className="space-y-4">
                {Object.entries(usageData.breakdown).map(([type, data]: [string, any]) => {
                  const percentage = ((data.credits / usageData.totalCredits) * 100).toFixed(1);

                  return (
                    <div key={type}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-[#1D3557]">
                          {formatType(type)}
                        </span>
                        <span className="text-sm font-bold text-[#E63946]">
                          {data.credits} credits ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-[#E63946] h-4 rounded-full transition-all flex items-center justify-end pr-2"
                          style={{ width: `${percentage}%` }}
                        >
                          {parseFloat(percentage) > 15 && (
                            <span className="text-xs font-semibold text-white">
                              {data.count}x
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {data.count} {data.count === 1 ? 'transaction' : 'transactions'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-[#1D3557] mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentUsage.map(usage => (
                  <div
                    key={usage.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-sm text-[#1D3557]">
                        {formatType(usage.type)}
                      </p>
                      {usage.matchName && (
                        <p className="text-xs text-gray-600">{usage.matchName}</p>
                      )}
                      <p className="text-xs text-gray-500">{formatDate(usage.timestamp)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#E63946]">-{usage.credits}</p>
                      <p className="text-xs text-gray-500">credits</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-[#2A9D8F]/10 rounded-2xl p-6 mt-6">
              <h3 className="font-bold text-[#1D3557] mb-2">💡 Tip</h3>
              <p className="text-sm text-gray-700">
                Request speed dates early in the week for better response rates and save
                credits by connecting through mutual interests first.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
