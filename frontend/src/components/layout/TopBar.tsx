import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface TopBarProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: ReactNode;
}

function TopBar({ title, showBackButton = false, onBackClick, rightAction }: TopBarProps) {
  return (
    <header
      className="sticky top-0 bg-white border-b border-[#E5E7EB] z-30"
      style={{
        height: '56px',
        paddingTop: 'env(safe-area-inset-top)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="h-14 max-w-[600px] mx-auto px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="w-11 flex items-center">
          {showBackButton && (
            <button
              onClick={onBackClick}
              className="w-11 h-11 -ml-2 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6 text-[#1D3557]" />
            </button>
          )}
        </div>

        {/* Center Section */}
        <div className="flex-1 flex items-center justify-center px-2">
          <h1 className="text-base font-semibold text-[#1D3557] truncate">
            {title}
          </h1>
        </div>

        {/* Right Section */}
        <div className="w-11 flex items-center justify-end">
          {rightAction && (
            <div className="flex items-center gap-2">
              {rightAction}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
