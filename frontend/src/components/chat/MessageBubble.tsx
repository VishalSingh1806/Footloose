import { Message } from '../../types/chat';
import MessageStatus from './MessageStatus';
import { formatMessageTime } from '../../utils/dateUtils';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  avatar?: string;
  onRetry?: () => void;
}

function MessageBubble({ message, isOwn, showAvatar = false, avatar, onRetry }: MessageBubbleProps) {
  const { text, timestamp, status, type } = message;

  if (type === 'system') {
    return (
      <div className="flex justify-center px-4 my-4">
        <div className="bg-gray-100 px-4 py-2 rounded-full">
          <p className="text-sm text-gray-600 italic">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} px-4 mb-1`}>
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[75%]`}>
        {/* Avatar */}
        {showAvatar && !isOwn && avatar && (
          <img
            src={avatar}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        )}
        {!showAvatar && !isOwn && <div className="w-8" />}

        {/* Message Bubble */}
        <div>
          <div
            className={`px-4 py-2 ${
              isOwn
                ? 'bg-[#E63946] text-white rounded-2xl rounded-br-sm'
                : 'bg-white text-[#1D3557] rounded-2xl rounded-bl-sm shadow-sm'
            }`}
          >
            {/* Message Text */}
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {text}
            </p>
          </div>

          {/* Metadata */}
          <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">
              {formatMessageTime(timestamp)}
            </span>
            {isOwn && (
              <MessageStatus status={status} onRetry={onRetry} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
