import { ReactNode } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  topBarProps: {
    title: string;
    showBackButton?: boolean;
    onBackClick?: () => void;
    rightAction?: ReactNode;
  };
  navBadges?: {
    matches?: number;
    speedDates?: number;
    messages?: number;
  };
}

function Layout({ children, topBarProps, navBadges = {} }: LayoutProps) {
  return (
    <div className="app-container min-h-screen flex flex-col bg-[#FAFAFA]">
      {/* Top Bar */}
      <TopBar {...topBarProps} />

      {/* Main Content Area */}
      <main
        className="content-area flex-1 overflow-y-auto pb-20"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        matchesBadge={navBadges.matches}
        speedDatesBadge={navBadges.speedDates}
        messagesBadge={navBadges.messages}
      />
    </div>
  );
}

export default Layout;
