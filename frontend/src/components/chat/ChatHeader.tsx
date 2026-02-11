import { useState } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { formatLastSeen } from '../../utils/dateUtils';

interface ChatHeaderProps {
  name: string;
  age: number;
  photo: string;
  isOnline: boolean;
  lastSeen?: string;
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenMenu: () => void;
}

function ChatHeader({
  name,
  age,
  photo,
  isOnline,
  lastSeen,
  onBack,
  onOpenProfile,
  onOpenMenu,
}: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100
                     transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-[#1D3557]" />
        </button>

        {/* Match Info - Tappable */}
        <button
          onClick={onOpenProfile}
          className="flex-1 flex items-center gap-3 text-left hover:bg-gray-50 rounded-lg p-2 -m-2
                     transition-colors"
        >
          {/* Profile Photo with Online Status */}
          <div className="relative flex-shrink-0">
            <img
              src={photo}
              alt={name}
              className="w-11 h-11 rounded-full object-cover"
            />
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          {/* Name and Status */}
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-[#1D3557] truncate">
              {name}, {age}
            </h2>
            <p className="text-sm text-gray-600 truncate">
              {isOnline ? 'Active now' : lastSeen ? formatLastSeen(lastSeen) : 'Offline'}
            </p>
          </div>
        </button>

        {/* Menu Button */}
        <button
          onClick={onOpenMenu}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100
                     transition-colors flex-shrink-0"
          aria-label="More options"
        >
          <MoreVertical size={24} className="text-[#1D3557]" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
