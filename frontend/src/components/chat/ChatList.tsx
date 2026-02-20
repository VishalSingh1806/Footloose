import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Star, Check } from 'lucide-react';
import ChatEmpty from './ChatEmpty';
import { generateMockConversations } from '../../services/chatService';
import { Conversation, ConversationFilter, MatchSource } from '../../types/chat';
import { formatConversationTime } from '../../utils/dateUtils';

function ChatList() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load conversations
    setTimeout(() => {
      setConversations(generateMockConversations());
      setLoading(false);
    }, 500);
  }, []);

  const getMatchSourceIcon = (source: MatchSource) => {
    switch (source) {
      case 'speed_date':
        return <Video size={16} className="text-gray-400" />;
      case 'premium_unlock':
        return <Star size={16} className="text-gray-400" />;
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (filter === 'unread') return conv.unreadCount > 0;
    if (filter === 'archived') return conv.isArchived;
    return !conv.isArchived; // 'all' shows non-archived
  });

  const unreadCount = conversations.filter((c) => c.unreadCount > 0).length;
  const archivedCount = conversations.filter((c) => c.isArchived).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#9B59B6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return <ChatEmpty />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Filter Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 px-4 font-medium text-sm relative ${
              filter === 'all'
                ? 'text-[#9B59B6] border-b-2 border-[#9B59B6]'
                : 'text-gray-600'
            }`}
          >
            All ({conversations.length - archivedCount})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-3 px-4 font-medium text-sm relative ${
              filter === 'unread'
                ? 'text-[#9B59B6] border-b-2 border-[#9B59B6]'
                : 'text-gray-600'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-[#9B59B6] text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`flex-1 py-3 px-4 font-medium text-sm relative ${
              filter === 'archived'
                ? 'text-[#9B59B6] border-b-2 border-[#9B59B6]'
                : 'text-gray-600'
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Conversation List */}
      {filteredConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <p className="text-gray-500">No {filter} conversations</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => navigate(`/chat/${conversation.id}`)}
              className="w-full bg-white hover:bg-gray-50 px-4 py-4 flex items-center gap-3
                         transition-colors border-b border-gray-100"
            >
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <img
                  src={conversation.matchPhoto}
                  alt={conversation.matchName}
                  className="w-15 h-15 rounded-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                {/* Name and Time */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-[#1D3557] truncate ${
                        conversation.unreadCount > 0 ? 'font-bold' : ''
                      }`}
                    >
                      {conversation.matchName}, {conversation.matchAge}
                    </h3>
                    {conversation.isVerified && (
                      <Check size={16} className="text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {conversation.lastMessage
                      ? formatConversationTime(conversation.lastMessage.timestamp)
                      : ''}
                  </span>
                </div>

                {/* Last Message or Typing */}
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm truncate flex-1 ${
                      conversation.isTyping
                        ? 'text-[#2A9D8F] italic'
                        : conversation.unreadCount > 0
                        ? 'text-[#1D3557] font-semibold'
                        : 'text-gray-600'
                    }`}
                  >
                    {conversation.isTyping ? (
                      `${conversation.matchName} is typing...`
                    ) : conversation.lastMessage ? (
                      <>
                        {conversation.lastMessage.senderId === 'current_user' && 'You: '}
                        {conversation.lastMessage.text}
                      </>
                    ) : (
                      'Say hello! 👋'
                    )}
                  </p>

                  {/* Badges and Icons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Match Source Icon */}
                    {getMatchSourceIcon(conversation.matchSource)}

                    {/* Unread Badge */}
                    {conversation.unreadCount > 0 && (
                      <div className="w-6 h-6 bg-[#9B59B6] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatList;
