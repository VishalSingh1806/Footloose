import { Grid, Video, MessageCircle, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: typeof Grid;
  iconFilled: typeof Grid;
  route: string;
  badge?: number;
}

interface BottomNavProps {
  matchesBadge?: number;
  speedDatesBadge?: number;
  messagesBadge?: number;
}

function BottomNav({ matchesBadge = 0, speedDatesBadge = 0, messagesBadge = 0 }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      id: 'matches',
      label: 'Matches',
      icon: Grid,
      iconFilled: Grid,
      route: '/matches',
      badge: matchesBadge,
    },
    {
      id: 'speed-dates',
      label: 'Speed Dates',
      icon: Video,
      iconFilled: Video,
      route: '/speed-dates',
      badge: speedDatesBadge,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      iconFilled: MessageCircle,
      route: '/messages',
      badge: messagesBadge,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      iconFilled: User,
      route: '/profile',
    },
  ];

  const isActive = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(route + '/');
  };

  const handleNavClick = (route: string) => {
    // Haptic feedback for supported devices
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    navigate(route);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-40"
      style={{
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="h-full max-w-[600px] mx-auto flex items-stretch">
        {navItems.map((item) => {
          const Icon = isActive(item.route) ? item.iconFilled : item.icon;
          const active = isActive(item.route);

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.route)}
              className="flex-1 flex flex-col items-center justify-center relative transition-all duration-200 ease-in-out"
              aria-label={item.label}
            >
              {/* Active Indicator Bar */}
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-[#9B59B6] rounded-b-full" />
              )}

              {/* Icon with Badge */}
              <div className="relative mb-1">
                <Icon
                  className={`w-6 h-6 transition-colors duration-200 ${
                    active ? 'text-[#9B59B6]' : 'text-[#9CA3AF]'
                  }`}
                  fill="none"
                  strokeWidth={2}
                />

                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#9B59B6] rounded-full flex items-center justify-center px-1">
                    <span className="text-[10px] font-semibold text-white">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium transition-colors duration-200 ${
                  active ? 'text-[#9B59B6]' : 'text-[#9CA3AF]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
