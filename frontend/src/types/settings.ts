/**
 * Settings Type Definitions
 * Footloose No More - Settings Module
 */

// ============================================================================
// Account Settings
// ============================================================================

export interface AccountInfo {
  userId: string;
  userIdDisplay: string; // e.g., "FNM_123456"
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneVerified: boolean;
  registrationDate: string;
  lastPasswordChange?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EmailChangeData {
  newEmail: string;
  otp: string;
}

export interface PhoneChangeData {
  newPhone: string;
  otp: string;
}

// ============================================================================
// Notification Settings
// ============================================================================

export interface NotificationPreferences {
  masterEnabled: boolean;

  // Push Notifications
  push: {
    newMatches: boolean;
    speedDateRequests: boolean;
    speedDateReminders: boolean;
    newMessages: boolean;
    profileViews: boolean;
    likesReceived: boolean;
    interestsReceived: boolean;
    promotional: boolean;
  };

  // Quiet Hours
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string; // "08:00"
    days: string[]; // ["monday", "tuesday", ...]
    mode: 'mute_all' | 'mute_promotional' | 'important_only';
  };

  // Email Notifications
  email: {
    dailyDigest: boolean;
    dailyDigestTime: string; // "09:00"
    weeklySummary: boolean;
    weeklySummaryDay: string; // "monday"
    activityUpdates: boolean;
    activityFrequency: 'realtime' | 'batched';
    promotional: boolean;
  };

  // SMS Notifications
  sms: {
    enabled: boolean;
    importantAlerts: boolean;
  };

  // Sounds & Vibration
  sounds: {
    enabled: boolean;
    soundType: string;
    vibration: boolean;
  };

  // In-App
  inApp: {
    banners: boolean;
    badgeCount: boolean;
  };
}

// ============================================================================
// Blocked Users
// ============================================================================

export interface BlockedUser {
  id: string;
  userId: string;
  name: string;
  age: number;
  photoUrl: string;
  blockedAt: string;
  reason?: string;
}

// ============================================================================
// Support
// ============================================================================

export interface SupportTicket {
  id: string;
  ticketId: string; // e.g., "SUPP_12345"
  userId: string;
  subject: string;
  category: SupportCategory;
  description: string;
  priority: 'low' | 'normal' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  replies?: SupportReply[];
}

export interface SupportReply {
  id: string;
  ticketId: string;
  author: 'user' | 'support';
  message: string;
  createdAt: string;
}

export type SupportCategory =
  | 'account_issues'
  | 'technical_problems'
  | 'billing_payments'
  | 'speed_dating_issues'
  | 'report_abuse'
  | 'feature_request'
  | 'other';

export interface SupportTicketData {
  category: SupportCategory;
  subject: string;
  description: string;
  priority: 'low' | 'normal' | 'high';
  attachments?: File[];
}

// ============================================================================
// Feedback
// ============================================================================

export interface Feedback {
  id: string;
  userId: string;
  type: FeedbackType;
  description: string;
  rating?: number; // 1-5 stars
  contactAllowed: boolean;
  attachments?: string[];
  createdAt: string;
}

export type FeedbackType =
  | 'bug_report'
  | 'feature_request'
  | 'user_experience'
  | 'performance_issue'
  | 'design_feedback'
  | 'general_feedback';

export interface FeedbackData {
  type: FeedbackType;
  description: string;
  rating?: number;
  contactAllowed: boolean;
  attachments?: File[];
}

// ============================================================================
// Data & Privacy
// ============================================================================

export interface DataExportRequest {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'ready' | 'expired';
  requestedAt: string;
  completedAt?: string;
  expiresAt?: string;
  downloadUrl?: string;
  fileSize?: string;
}

export interface CookiePreferences {
  essential: boolean; // always true
  analytics: boolean;
  marketing: boolean;
}

// ============================================================================
// Account Deletion
// ============================================================================

export interface AccountDeletionRequest {
  userId: string;
  reasons: string[];
  additionalFeedback?: string;
  scheduledDate: string; // 30 days from now
  status: 'scheduled' | 'cancelled' | 'completed';
  createdAt: string;
}

// ============================================================================
// Language & Accessibility
// ============================================================================

export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'mr'
  | 'ta'
  | 'te'
  | 'gu'
  | 'kn'
  | 'bn';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export interface AccessibilitySettings {
  textSize: number; // 12-24px
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  tapTimeout: number; // 0.1 - 2.0 seconds
  tapTargetSize: 'default' | 'large' | 'extra_large';
  soundEffects: boolean;
  vibrationFeedback: boolean;
  focusIndicators: boolean;
}

// ============================================================================
// FAQ & Help
// ============================================================================

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful?: number;
}

export interface HelpGuide {
  id: string;
  title: string;
  description: string;
  content: string;
  readTime: number; // minutes
  category: string;
  icon: string;
}

// ============================================================================
// App Info
// ============================================================================

export interface AppInfo {
  version: string;
  buildNumber: string;
  lastUpdated: string;
  platform: 'ios' | 'android' | 'web' | 'pwa';
  deviceInfo?: {
    device: string;
    os: string;
    browser: string;
    isPWA: boolean;
    networkStatus: string;
  };
}
