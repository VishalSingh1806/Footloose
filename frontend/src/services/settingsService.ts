/**
 * Settings Service
 * Handles all settings-related API calls and local storage
 * Offline-first architecture with IndexedDB caching
 */

import type {
  AccountInfo,
  NotificationPreferences,
  BlockedUser,
  SupportTicket,
  SupportTicketData,
  Feedback,
  FeedbackData,
  DataExportRequest,
  AccountDeletionRequest,
  AccessibilitySettings,
  SupportedLanguage,
  CookiePreferences,
} from '../types/settings';

// Mock current user ID
const CURRENT_USER_ID = 'user_123';

// ============================================================================
// Account Settings
// ============================================================================

export async function getAccountInfo(): Promise<AccountInfo> {
  try {
    // Check localStorage first
    const cached = localStorage.getItem('accountInfo');
    if (cached) return JSON.parse(cached);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const accountInfo: AccountInfo = {
      userId: CURRENT_USER_ID,
      userIdDisplay: 'FNM_123456',
      email: 'rajesh@example.com',
      emailVerified: true,
      phoneNumber: '+91 98765 43210',
      phoneVerified: true,
      registrationDate: '2026-01-15T00:00:00Z',
      lastPasswordChange: '2026-01-15T00:00:00Z',
    };

    localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
    return accountInfo;
  } catch (error) {
    console.error('Failed to get account info:', error);
    throw error;
  }
}

export async function changeEmail(newEmail: string, otp: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Update cached account info
  const accountInfo = await getAccountInfo();
  accountInfo.email = newEmail;
  accountInfo.emailVerified = true;
  localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
}

export async function changePhone(newPhone: string, otp: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const accountInfo = await getAccountInfo();
  accountInfo.phoneNumber = newPhone;
  accountInfo.phoneVerified = true;
  localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const accountInfo = await getAccountInfo();
  accountInfo.lastPasswordChange = new Date().toISOString();
  localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
}

export async function deactivateAccount(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // In real app, would call API to deactivate
}

// ============================================================================
// Notification Settings
// ============================================================================

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  masterEnabled: true,
  push: {
    newMatches: true,
    speedDateRequests: true,
    speedDateReminders: true,
    newMessages: true,
    profileViews: false,
    likesReceived: true,
    interestsReceived: true,
    promotional: true,
  },
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    mode: 'mute_all',
  },
  email: {
    dailyDigest: true,
    dailyDigestTime: '09:00',
    weeklySummary: true,
    weeklySummaryDay: 'monday',
    activityUpdates: true,
    activityFrequency: 'batched',
    promotional: true,
  },
  sms: {
    enabled: false,
    importantAlerts: true,
  },
  sounds: {
    enabled: true,
    soundType: 'default',
    vibration: true,
  },
  inApp: {
    banners: true,
    badgeCount: true,
  },
};

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const cached = localStorage.getItem('notificationPreferences');
    if (cached) return JSON.parse(cached);

    await new Promise((resolve) => setTimeout(resolve, 300));
    return DEFAULT_NOTIFICATION_PREFERENCES;
  } catch (error) {
    console.error('Failed to get notification preferences:', error);
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
}

export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<void> {
  const current = await getNotificationPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem('notificationPreferences', JSON.stringify(updated));
  await new Promise((resolve) => setTimeout(resolve, 500));
}

// ============================================================================
// Blocked Users
// ============================================================================

export async function getBlockedUsers(): Promise<BlockedUser[]> {
  try {
    const cached = localStorage.getItem('blockedUsers');
    if (cached) return JSON.parse(cached);

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock data
    const blockedUsers: BlockedUser[] = [
      {
        id: 'blocked_1',
        userId: 'user_456',
        name: 'Priya',
        age: 28,
        photoUrl: 'https://i.pravatar.cc/150?img=5',
        blockedAt: '2026-02-05T10:30:00Z',
        reason: 'inappropriate_behavior',
      },
      {
        id: 'blocked_2',
        userId: 'user_789',
        name: 'Amit',
        age: 32,
        photoUrl: 'https://i.pravatar.cc/150?img=12',
        blockedAt: '2026-02-01T14:20:00Z',
        reason: 'spam',
      },
    ];

    localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
    return blockedUsers;
  } catch (error) {
    console.error('Failed to get blocked users:', error);
    return [];
  }
}

export async function unblockUser(userId: string): Promise<void> {
  const blockedUsers = await getBlockedUsers();
  const updated = blockedUsers.filter((user) => user.userId !== userId);
  localStorage.setItem('blockedUsers', JSON.stringify(updated));
  await new Promise((resolve) => setTimeout(resolve, 500));
}

// ============================================================================
// Support Tickets
// ============================================================================

export async function getSupportTickets(): Promise<SupportTicket[]> {
  try {
    const cached = localStorage.getItem('supportTickets');
    if (cached) return JSON.parse(cached);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const tickets: SupportTicket[] = [
      {
        id: 'ticket_1',
        ticketId: 'SUPP_12345',
        userId: CURRENT_USER_ID,
        subject: 'Account login issue',
        category: 'account_issues',
        description: 'Cannot log in with my phone number',
        priority: 'high',
        status: 'in_progress',
        createdAt: '2026-02-10T09:00:00Z',
        updatedAt: '2026-02-11T14:30:00Z',
      },
    ];

    localStorage.setItem('supportTickets', JSON.stringify(tickets));
    return tickets;
  } catch (error) {
    console.error('Failed to get support tickets:', error);
    return [];
  }
}

export async function createSupportTicket(data: SupportTicketData): Promise<SupportTicket> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const ticket: SupportTicket = {
    id: `ticket_${Date.now()}`,
    ticketId: `SUPP_${Math.floor(Math.random() * 99999)}`,
    userId: CURRENT_USER_ID,
    subject: data.subject,
    category: data.category,
    description: data.description,
    priority: data.priority,
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const tickets = await getSupportTickets();
  tickets.unshift(ticket);
  localStorage.setItem('supportTickets', JSON.stringify(tickets));

  return ticket;
}

// ============================================================================
// Feedback
// ============================================================================

export async function submitFeedback(data: FeedbackData): Promise<Feedback> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const feedback: Feedback = {
    id: `feedback_${Date.now()}`,
    userId: CURRENT_USER_ID,
    type: data.type,
    description: data.description,
    rating: data.rating,
    contactAllowed: data.contactAllowed,
    createdAt: new Date().toISOString(),
  };

  return feedback;
}

// ============================================================================
// Data Export
// ============================================================================

export async function requestDataExport(): Promise<DataExportRequest> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const exportRequest: DataExportRequest = {
    id: `export_${Date.now()}`,
    userId: CURRENT_USER_ID,
    status: 'pending',
    requestedAt: new Date().toISOString(),
  };

  const exports = await getDataExports();
  exports.unshift(exportRequest);
  localStorage.setItem('dataExports', JSON.stringify(exports));

  return exportRequest;
}

export async function getDataExports(): Promise<DataExportRequest[]> {
  const cached = localStorage.getItem('dataExports');
  return cached ? JSON.parse(cached) : [];
}

// ============================================================================
// Account Deletion
// ============================================================================

export async function requestAccountDeletion(
  reasons: string[],
  additionalFeedback?: string
): Promise<AccountDeletionRequest> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 30);

  const deletionRequest: AccountDeletionRequest = {
    userId: CURRENT_USER_ID,
    reasons,
    additionalFeedback,
    scheduledDate: scheduledDate.toISOString(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem('accountDeletion', JSON.stringify(deletionRequest));
  return deletionRequest;
}

export async function cancelAccountDeletion(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  localStorage.removeItem('accountDeletion');
}

export async function getAccountDeletionStatus(): Promise<AccountDeletionRequest | null> {
  const cached = localStorage.getItem('accountDeletion');
  return cached ? JSON.parse(cached) : null;
}

// ============================================================================
// Accessibility Settings
// ============================================================================

const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  textSize: 16,
  highContrast: false,
  reducedMotion: false,
  colorBlindMode: 'none',
  tapTimeout: 0.3,
  tapTargetSize: 'default',
  soundEffects: true,
  vibrationFeedback: true,
  focusIndicators: false,
};

export async function getAccessibilitySettings(): Promise<AccessibilitySettings> {
  const cached = localStorage.getItem('accessibilitySettings');
  return cached ? JSON.parse(cached) : DEFAULT_ACCESSIBILITY_SETTINGS;
}

export async function updateAccessibilitySettings(
  settings: Partial<AccessibilitySettings>
): Promise<void> {
  const current = await getAccessibilitySettings();
  const updated = { ...current, ...settings };
  localStorage.setItem('accessibilitySettings', JSON.stringify(updated));
  await new Promise((resolve) => setTimeout(resolve, 300));
}

// ============================================================================
// Language Settings
// ============================================================================

export async function getLanguage(): Promise<SupportedLanguage> {
  const cached = localStorage.getItem('appLanguage');
  return (cached as SupportedLanguage) || 'en';
}

export async function setLanguage(language: SupportedLanguage): Promise<void> {
  localStorage.setItem('appLanguage', language);
  await new Promise((resolve) => setTimeout(resolve, 300));
}

// ============================================================================
// Cookie Preferences
// ============================================================================

export async function getCookiePreferences(): Promise<CookiePreferences> {
  const cached = localStorage.getItem('cookiePreferences');
  return cached
    ? JSON.parse(cached)
    : { essential: true, analytics: true, marketing: true };
}

export async function updateCookiePreferences(
  preferences: CookiePreferences
): Promise<void> {
  localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
  await new Promise((resolve) => setTimeout(resolve, 300));
}

// ============================================================================
// Logout
// ============================================================================

export async function logout(): Promise<void> {
  // Clear sensitive data but keep some preferences
  const keysToKeep = [
    'notificationPreferences',
    'accessibilitySettings',
    'appLanguage',
    'cookiePreferences',
  ];

  const storage: Record<string, string> = {};
  keysToKeep.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) storage[key] = value;
  });

  localStorage.clear();

  // Restore preferences
  Object.entries(storage).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });

  await new Promise((resolve) => setTimeout(resolve, 500));
}
