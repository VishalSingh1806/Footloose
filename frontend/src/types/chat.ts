export type MessageStatus = 'sending' | 'sent' | 'failed';
export type MessageType = 'text' | 'image' | 'video' | 'system';
export type ConversationFilter = 'all' | 'unread' | 'archived';
export type MatchSource = 'speed_date' | 'premium_unlock';

// State machine for chat unlock flow
export type ChatUnlockState =
  | 'NOT_MET'
  | 'SPEED_DATE_REQUESTED'
  | 'SPEED_DATE_SCHEDULED'
  | 'SPEED_DATE_COMPLETED'
  | 'UNLOCK_AVAILABLE'
  | 'CHAT_UNLOCKED'
  | 'CLOSED';

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
  unlockState: ChatUnlockState;
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
