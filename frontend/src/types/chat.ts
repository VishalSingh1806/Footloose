export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MessageType = 'text' | 'image' | 'video' | 'system';
export type ConversationFilter = 'all' | 'unread' | 'archived';
export type MatchSource = 'speed_date' | 'mutual_interest' | 'premium_unlock';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
  type: MessageType;
  mediaUrl?: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  matchId: string;
  matchName: string;
  matchAge: number;
  matchPhoto: string;
  matchSource: MatchSource;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen?: string;
  lastMessage?: Message;
  unreadCount: number;
  isTyping: boolean;
  isArchived: boolean;
  isBlocked: boolean;
  isMuted: boolean;
  draft?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  unreadTotal: number;
  filter: ConversationFilter;
  isConnected: boolean;
}
