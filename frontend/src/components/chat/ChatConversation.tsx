import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import TypingIndicator from './TypingIndicator';
import ConnectionStatus from './ConnectionStatus';
import { generateMockMessages, chatService } from '../../services/chatService';
import { Message } from '../../types/chat';
import { getDateSeparator } from '../../utils/dateUtils';
import { requestBackgroundSync } from '../../services/serviceWorkerRegistration';

function ChatConversation() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with real state management
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

  // Mock match data
  const matchData = {
    name: 'Priya',
    age: 28,
    photo: 'https://randomuser.me/api/portraits/women/1.jpg',
  };

  const currentUserId = 'current_user';

  useEffect(() => {
    if (conversationId) {
      // Load messages
      const mockMessages = generateMockMessages(conversationId, 30);
      setMessages(mockMessages);

      // Scroll to bottom
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [conversationId]);

  useEffect(() => {
    // Handle scroll to show/hide scroll button
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    setNewMessageCount(0);
  };

  const handleSendMessage = async (text: string) => {
    if (!conversationId) return;

    // Optimistic update
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      text,
      timestamp: new Date().toISOString(),
      status: 'sending',
      type: 'text',
    };

    setMessages((prev) => [...prev, tempMessage]);
    scrollToBottom();

    try {
      // Send via service
      const sentMessage = await chatService.sendMessage(conversationId, text);

      // If offline, request background sync
      if (!navigator.onLine) {
        await requestBackgroundSync('sync-messages');
        console.log('Message queued for sync');
      }

      // Update message with sent status
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempMessage.id ? sentMessage : msg))
      );
    } catch (error) {
      // Update to failed status
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id ? { ...msg, status: 'failed' } : msg
        )
      );
    }
  };

  const handleTyping = (isTyping: boolean) => {
    chatService.sendTypingIndicator(conversationId || '', isTyping);
  };

  const handleRetryMessage = (messageId: string) => {
    // Retry failed message
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      handleSendMessage(message.text);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = '';

  messages.forEach((message) => {
    const messageDate = getDateSeparator(message.timestamp);
    if (messageDate !== currentDate) {
      currentDate = messageDate;
      groupedMessages.push({ date: messageDate, messages: [] });
    }
    groupedMessages[groupedMessages.length - 1].messages.push(message);
  });

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA]">
      {/* Connection Status Banner */}
      <ConnectionStatus />

      {/* Header */}
      <ChatHeader
        name={matchData.name}
        age={matchData.age}
        photo={matchData.photo}
        onBack={() => navigate('/messages')}
        onOpenProfile={() => navigate(`/match/${conversationId}`)}
        onOpenMenu={() => {}}
      />

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto pb-24"
        style={{ paddingTop: '16px' }}
      >
        {groupedMessages.map((group, idx) => (
          <div key={idx}>
            {/* Date Separator */}
            <div className="flex justify-center my-4">
              <div className="bg-gray-200 px-3 py-1 rounded-full">
                <span className="text-xs text-gray-600 font-medium">{group.date}</span>
              </div>
            </div>

            {/* Messages */}
            {group.messages.map((message, msgIdx) => {
              const isOwn = message.senderId === currentUserId;
              const prevMessage = msgIdx > 0 ? group.messages[msgIdx - 1] : null;
              const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  avatar={!isOwn ? matchData.photo : undefined}
                  onRetry={() => handleRetryMessage(message.id)}
                />
              );
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator name={matchData.name} photo={matchData.photo} />}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          className="fixed bottom-28 right-6 w-12 h-12 bg-white border border-gray-300 rounded-full
                     shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-30"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={20} className="text-gray-600" />
          {newMessageCount > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#9B59B6] rounded-full
                           flex items-center justify-center">
              <span className="text-white text-xs font-bold">{newMessageCount}</span>
            </div>
          )}
        </button>
      )}

      {/* Message Composer */}
      <MessageComposer onSend={handleSendMessage} onTyping={handleTyping} />
    </div>
  );
}

export default ChatConversation;
