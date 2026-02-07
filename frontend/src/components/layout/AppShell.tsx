import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Filter, Bell, Edit2 } from 'lucide-react';
import Layout from './Layout';
import HomePage from '../home/HomePage';
import SpeedDatesPage from '../speeddate/SpeedDatesPage';
import MessagesPage from '../chat/MessagesPage';
import ProfilePage from '../profile/ProfilePage';
import { MatchProfileDetail } from '../profile';

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sample badge counts (in real app, these would come from API/state management)
  const [badgeCounts] = useState({
    matches: 3,
    speedDates: 1,
    messages: 2,
  });

  // Notification badge (for top bar)
  const [hasNotifications] = useState(true);

  // Get TopBar props based on current route
  const getTopBarProps = () => {
    const path = location.pathname;

    switch (path) {
      case '/matches':
        return {
          title: 'Matches',
          showBackButton: false,
          rightAction: (
            <>
              <button
                className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors"
                aria-label="Filter matches"
              >
                <Filter className="w-5 h-5 text-[#1D3557]" />
              </button>
              <button
                className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-[#1D3557]" />
                {hasNotifications && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#E63946] rounded-full" />
                )}
              </button>
            </>
          ),
        };

      case '/speed-dates':
        return {
          title: 'Speed Dates',
          showBackButton: false,
          rightAction: (
            <button
              className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#1D3557]" />
              {hasNotifications && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-[#E63946] rounded-full" />
              )}
            </button>
          ),
        };

      case '/messages':
        return {
          title: 'Messages',
          showBackButton: false,
        };

      case '/profile':
        return {
          title: 'Profile',
          showBackButton: false,
          rightAction: (
            <button
              className="w-11 h-11 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors"
              aria-label="Edit profile"
            >
              <Edit2 className="w-5 h-5 text-[#1D3557]" />
            </button>
          ),
        };

      default:
        return {
          title: 'App',
          showBackButton: false,
        };
    }
  };

  return (
    <Routes>
      {/* Default route - redirect to matches */}
      <Route path="/" element={<Navigate to="/matches" replace />} />

      {/* Match profile detail (no Layout wrapper - has custom top bar) */}
      <Route path="/match/:matchId" element={<MatchProfileDetail />} />

      {/* Main app routes (with Layout) */}
      <Route
        path="/*"
        element={
          <Layout topBarProps={getTopBarProps()} navBadges={badgeCounts}>
            <Routes>
              <Route path="/matches" element={<HomePage />} />
              <Route path="/speed-dates" element={<SpeedDatesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Catch all - redirect to matches */}
              <Route path="*" element={<Navigate to="/matches" replace />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default AppShell;
