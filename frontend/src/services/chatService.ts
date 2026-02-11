import { Conversation, Message, MessageStatus } from '../types/chat';
import { indexedDBService } from './indexedDBService';

// Mock data generator - replace with real API calls
export function generateMockConversations(): Conversation[] {
  return [
    {
      id: 'conv_1',
      matchId: 'match_1',
      matchName: 'Priya',
      matchAge: 28,
      matchPhoto: 'https://randomuser.me/api/portraits/women/1.jpg',
      matchSource: 'speed_date',
      isVerified: true,
      isOnline: true,
      lastMessage: {
        id: 'msg_1',
        conversationId: 'conv_1',
        senderId: 'match_1',
        text: 'That sounds great! When are you free this weekend?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'read',
        type: 'text',
      },
      unreadCount: 2,
      isTyping: false,
      isArchived: false,
      isBlocked: false,
      isMuted: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'conv_2',
      matchId: 'match_2',
      matchName: 'Ananya',
      matchAge: 26,
      matchPhoto: 'https://randomuser.me/api/portraits/women/2.jpg',
      matchSource: 'mutual_interest',
      isVerified: true,
      isOnline: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      lastMessage: {
        id: 'msg_2',
        conversationId: 'conv_2',
        senderId: 'current_user',
        text: "I'd love to! What kind of cuisine do you prefer?",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        type: 'text',
      },
      unreadCount: 0,
      isTyping: false,
      isArchived: false,
      isBlocked: false,
      isMuted: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'conv_3',
      matchId: 'match_3',
      matchName: 'Kavya',
      matchAge: 27,
      matchPhoto: 'https://randomuser.me/api/portraits/women/3.jpg',
      matchSource: 'premium_unlock',
      isVerified: false,
      isOnline: false,
      lastSeen: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      unreadCount: 0,
      isTyping: false,
      isArchived: false,
      isBlocked: false,
      isMuted: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function generateMockMessages(conversationId: string, count: number = 20): Message[] {
  const messages: Message[] = [];
  const currentUserId = 'current_user';
  const otherUserId = 'match_1';

  for (let i = 0; i < count; i++) {
    const isFromCurrentUser = i % 3 !== 0;
    messages.push({
      id: `msg_${conversationId}_${i}`,
      conversationId,
      senderId: isFromCurrentUser ? currentUserId : otherUserId,
      text: `This is message number ${i + 1}. ${isFromCurrentUser ? 'I sent this' : 'They sent this'}.`,
      timestamp: new Date(Date.now() - (count - i) * 60 * 60 * 1000).toISOString(),
      status: isFromCurrentUser ? (['sent', 'delivered', 'read'][i % 3] as MessageStatus) : 'read',
      type: 'text',
    });
  }

  return messages.reverse(); // Newest first
}

// Chat Service Class
class ChatService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Initialize WebSocket connection
  connect(userId: string) {
    // In production, replace with your WebSocket server URL
    // this.ws = new WebSocket(`wss://your-server.com/chat?userId=${userId}`);

    console.log('Chat service connected for user:', userId);

    // Mock connection for now
    // this.setupEventListeners();
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
  }

  private handleMessage(data: any) {
    // Handle different message types
    switch (data.type) {
      case 'new_message':
        // Dispatch to state management
        break;
      case 'message_read':
        // Update message status
        break;
      case 'typing_start':
      case 'typing_stop':
        // Update typing indicator
        break;
      case 'user_online':
      case 'user_offline':
        // Update online status
        break;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    setTimeout(() => {
      this.reconnectAttempts++;
      // this.connect(userId); // Need to store userId
    }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
  }

  // Send message
  async sendMessage(conversationId: string, text: string): Promise<Message> {
    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: 'current_user',
      text,
      timestamp: new Date().toISOString(),
      status: 'sending',
      type: 'text',
    };

    // Check if online
    if (!navigator.onLine) {
      // Queue for later
      await indexedDBService.queueMessage({
        ...message,
        tempId: message.id,
      });

      // Save to IndexedDB immediately
      await indexedDBService.saveMessage(message);

      return message;
    }

    try {
      // Send via WebSocket if connected
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'send_message',
          conversationId,
          text,
          tempId: message.id,
        }));
      }

      // Save to IndexedDB
      await indexedDBService.saveMessage(message);

      // Simulate network delay for demo
      await new Promise((resolve) => setTimeout(resolve, 500));

      message.status = 'sent';
      await indexedDBService.saveMessage(message);

      return message;
    } catch (error) {
      message.status = 'failed';
      await indexedDBService.saveMessage(message);
      throw error;
    }
  }

  // Mark messages as read
  markAsRead(conversationId: string, messageIds: string[]) {
    // Send read receipt to server
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'mark_read',
        conversationId,
        messageIds,
      }));
    }
  }

  // Send typing indicator
  sendTypingIndicator(conversationId: string, isTyping: boolean) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: isTyping ? 'typing_start' : 'typing_stop',
        conversationId,
      }));
    }
  }

  // Load older messages (pagination)
  async loadOlderMessages(conversationId: string, beforeMessageId: string): Promise<Message[]> {
    // Try to load from IndexedDB first
    const cachedMessages = await indexedDBService.getMessages(conversationId, 50);

    if (cachedMessages.length > 0) {
      return cachedMessages;
    }

    // Otherwise fetch from server
    // In production: await api.loadMessages(conversationId, beforeMessageId);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockMessages(conversationId, 20));
      }, 500);
    });
  }

  // Sync queued messages when back online
  async syncQueuedMessages() {
    const queuedMessages = await indexedDBService.getQueuedMessages();

    for (const queuedMsg of queuedMessages) {
      try {
        // Send the message
        const message = await this.sendMessage(queuedMsg.conversationId, queuedMsg.text);

        // Remove from queue on success
        await indexedDBService.removeFromQueue(queuedMsg.id);

        console.log('Synced queued message:', message.id);
      } catch (error) {
        console.error('Failed to sync message:', error);
        // Keep in queue for next sync attempt
      }
    }
  }

  // Initialize offline support
  async initOfflineSupport() {
    await indexedDBService.init();

    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('Back online - syncing messages...');
      this.syncQueuedMessages();
    });

    window.addEventListener('offline', () => {
      console.log('Went offline - messages will be queued');
    });
  }

  // Load conversations from cache
  async loadCachedConversations(): Promise<Conversation[]> {
    return await indexedDBService.getConversations();
  }

  // Cache conversation
  async cacheConversation(conversation: Conversation) {
    await indexedDBService.saveConversation(conversation);
  }
}

export const chatService = new ChatService();
