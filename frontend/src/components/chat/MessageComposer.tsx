import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Smile } from 'lucide-react';

interface MessageComposerProps {
  onSend: (text: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MAX_LENGTH = 1000;

function MessageComposer({
  onSend,
  onTyping,
  disabled = false,
  placeholder = 'Type a message...',
}: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
    }
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setMessage(value);

      // Emit typing indicator
      if (onTyping) {
        onTyping(true);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          onTyping(false);
        }, 3000);
      }
    }
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage('');

      // Stop typing indicator
      if (onTyping) {
        onTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Desktop: Enter sends, Shift+Enter new line
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth >= 640) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-20"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        {/* Plus Button (optional - for media) */}
        <button
          className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-100 hover:bg-gray-200
                     flex items-center justify-center transition-colors disabled:opacity-50"
          aria-label="Add media"
          disabled={disabled}
        >
          <Plus size={20} className="text-gray-600" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-3xl resize-none
                       focus:outline-none focus:border-[#9B59B6] transition-colors
                       disabled:bg-gray-50 disabled:text-gray-400"
            style={{ maxHeight: '100px' }}
          />

          {/* Character Counter */}
          {message.length > 900 && (
            <div className="absolute -top-6 right-0 text-xs text-gray-500">
              {message.length}/{MAX_LENGTH}
            </div>
          )}

          {/* Emoji Button (optional) */}
          <button
            className="absolute right-2 bottom-2 w-8 h-8 rounded-full hover:bg-gray-100
                       flex items-center justify-center transition-colors"
            aria-label="Add emoji"
            type="button"
          >
            <Smile size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center
                     transition-all active:scale-95 ${
                       canSend
                         ? 'bg-[#9B59B6] hover:bg-[#D62839] text-white'
                         : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                     }`}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default MessageComposer;
