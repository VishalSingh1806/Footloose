import { Clock, Check, CheckCheck, AlertCircle } from 'lucide-react';
import { MessageStatus as Status } from '../../types/chat';

interface MessageStatusProps {
  status: Status;
  onRetry?: () => void;
}

function MessageStatus({ status, onRetry }: MessageStatusProps) {
  switch (status) {
    case 'sending':
      return (
        <Clock size={14} className="text-gray-400 animate-pulse" />
      );

    case 'sent':
      return (
        <Check size={14} className="text-gray-400" />
      );

    case 'delivered':
      return (
        <CheckCheck size={14} className="text-gray-400" />
      );

    case 'read':
      return (
        <CheckCheck size={14} className="text-[#2A9D8F]" />
      );

    case 'failed':
      return (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs"
          aria-label="Retry sending message"
        >
          <AlertCircle size={14} />
          <span>Retry</span>
        </button>
      );

    default:
      return null;
  }
}

export default MessageStatus;
