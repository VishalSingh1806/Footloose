import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Award,
} from 'lucide-react';
import { ProfileAnalytics as ProfileAnalyticsType } from '../../types/profile';
import { getProfileAnalytics } from '../../services/profileService';

export function ProfileAnalytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<ProfileAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getProfileAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E63946] border-t-transparent" />
      </div>
    );
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '→';
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-[#1D3557]" />
          </button>
          <h1 className="text-xl font-bold text-[#1D3557]">Profile Analytics</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-2">
          {(['week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                timeRange === range
                  ? 'bg-[#E63946] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === 'week' ? 'Last 7 Days' : range === 'month' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-3">
              <Eye size={20} className="text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#1D3557] mb-1">
              {analytics.views.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 mb-2">Profile Views</p>
            <div className={`flex items-center gap-1 text-xs font-semibold ${getTrendColor(analytics.views.trend)}`}>
              <span>{getTrendIcon(analytics.views.trend)}</span>
              <span>{Math.abs(analytics.views.trend)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full mb-3">
              <Heart size={20} className="text-pink-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#1D3557] mb-1">
              {analytics.likes.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 mb-2">Likes Received</p>
            <div className={`flex items-center gap-1 text-xs font-semibold ${getTrendColor(analytics.likes.trend)}`}>
              <span>{getTrendIcon(analytics.likes.trend)}</span>
              <span>{Math.abs(analytics.likes.trend)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-3">
              <MessageCircle size={20} className="text-green-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#1D3557] mb-1">
              {analytics.messages.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 mb-2">Messages</p>
            <div className={`flex items-center gap-1 text-xs font-semibold ${getTrendColor(analytics.messages.trend)}`}>
              <span>{getTrendIcon(analytics.messages.trend)}</span>
              <span>{Math.abs(analytics.messages.trend)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-3">
              <Users size={20} className="text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#1D3557] mb-1">
              {analytics.matches.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 mb-2">Matches</p>
            <div className={`flex items-center gap-1 text-xs font-semibold ${getTrendColor(analytics.matches.trend)}`}>
              <span>{getTrendIcon(analytics.matches.trend)}</span>
              <span>{Math.abs(analytics.matches.trend)}%</span>
            </div>
          </div>
        </div>

        {/* Views Trend */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1D3557]">Profile Views Trend</h2>
            <TrendingUp size={20} className="text-gray-400" />
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {analytics.viewsHistory.slice(-7).map((day, index) => {
              const maxViews = Math.max(...analytics.viewsHistory.map((d) => d.views));
              const percentage = (day.views / maxViews) * 100;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{day.date}</span>
                    <span className="text-xs font-semibold text-[#1D3557]">
                      {day.views} views
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E63946] rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
          <h2 className="text-lg font-bold text-[#1D3557] mb-4">Who's Viewing Your Profile</h2>

          {/* Age Distribution */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar size={16} />
              By Age Group
            </h3>
            <div className="space-y-2">
              {Object.entries(analytics.demographics.age).map(([range, count]) => {
                const total = Object.values(analytics.demographics.age).reduce(
                  (sum, val) => sum + val,
                  0
                );
                const percentage = (count / total) * 100;

                return (
                  <div key={range}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm text-gray-600">{range} years</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#1D3557]">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E63946] to-[#F4A261] rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin size={16} />
              By Location
            </h3>
            <div className="space-y-2">
              {Object.entries(analytics.demographics.location)
                .slice(0, 5)
                .map(([city, count]) => {
                  const total = Object.values(analytics.demographics.location).reduce(
                    (sum, val) => sum + val,
                    0
                  );
                  const percentage = (count / total) * 100;

                  return (
                    <div key={city} className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">{city}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2A9D8F]"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#1D3557] w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Briefcase size={16} />
              By Profession
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(analytics.demographics.profession)
                .slice(0, 4)
                .map(([profession, count]) => (
                  <div
                    key={profession}
                    className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                  >
                    <span className="text-xs sm:text-sm text-gray-700 truncate">
                      {profession}
                    </span>
                    <span className="text-sm font-bold text-[#1D3557] ml-2">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Engagement Tips */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Award size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-[#1D3557]">Boost Your Profile</h3>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <p>Add more photos to increase views by 3x</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <p>Complete your bio to get 5x more matches</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <p>Verify your profile to appear higher in search</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <p>Update partner preferences for better match quality</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile/edit')}
            className="w-full mt-4 bg-[#E63946] text-white py-3 rounded-xl font-bold hover:bg-[#D62839] transition-colors"
          >
            Improve Profile
          </button>
        </div>
      </div>
    </div>
  );
}
