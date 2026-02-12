// Profile Types

export type ProfileVisibility = 'active' | 'paused' | 'under_review';
export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'not_submitted';
export type MaritalStatus = 'never_married' | 'divorced' | 'widowed' | 'awaiting_divorce';
export type Diet = 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian';

export interface UserProfile {
  id: string;
  userId: string;

  // Basic Info
  name: string;
  age: number;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';

  // Location
  city: string;
  state: string;
  country: string;

  // Physical
  height: string; // "5'8\""
  weight?: string;
  bodyType?: string;
  complexion?: string;

  // Religious
  religion: string;
  community?: string;
  caste?: string;
  subcaste?: string;

  // Family
  familyType?: string;
  familyStatus?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  siblings?: number;

  // Education & Career
  education: string;
  educationDetails?: string;
  profession: string;
  employer?: string;
  income?: string;

  // Lifestyle
  diet: Diet;
  smoking: boolean;
  drinking: boolean;
  hobbies?: string[];
  interests?: string[];

  // Marital
  maritalStatus: MaritalStatus;
  children?: number;

  // Profile
  bio: string;
  photos: ProfilePhoto[];

  // Additional profile info
  motherTongue?: string;

  // Status
  visibility: ProfileVisibility;
  verified: boolean;
  trustScore: number;
  completeness: number;

  // Nested data
  verification: VerificationInfo;
  privacySettings: PrivacySettings;
  partnerPreferences: PartnerPreferences;

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastActive: string;
}

export interface ProfilePhoto {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
  uploadedAt: string;
  uploadStatus?: 'uploading' | 'uploaded' | 'failed';
  status?: 'approved' | 'pending' | 'rejected'; // Approval status for moderation
}

export interface VerificationInfo {
  // Helper boolean fields for quick access
  phoneVerified: boolean;
  emailVerified: boolean;
  photoVerified: boolean;
  idVerified: boolean;
  incomeVerified: boolean;
  educationVerified: boolean;

  // Detailed verification info
  phone: {
    status: VerificationStatus;
    verifiedAt?: string;
  };
  email: {
    status: VerificationStatus;
    verifiedAt?: string;
  };
  governmentId: {
    status: VerificationStatus;
    idType?: 'aadhaar' | 'pan' | 'passport' | 'driving_license';
    verifiedAt?: string;
    rejectionReason?: string;
  };
  photo: {
    status: VerificationStatus;
    verifiedAt?: string;
    rejectionReason?: string;
  };
  company?: {
    status: VerificationStatus;
    verifiedAt?: string;
    companyName?: string;
  };
}

export interface PartnerPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  heightRange: {
    min: number; // in cm
    max: number; // in cm
  };
  maritalStatus: string[];
  religion: string[];
  education: string[];
  profession: string[];
  diet: string[];
  smoking: string[];
  drinking: string[];

  // Legacy/optional fields
  community?: string[];
  casteNoBar?: boolean;
  incomeRange?: {
    min: number;
    max: number;
  };
  location?: string[];
  openToRelocate?: boolean;
  lifestyle?: string[];
  additionalPreferences?: string;
  dealbreakers?: string;
}

export interface PrivacySettings {
  // General toggles
  showOnline: boolean;
  showDistance: boolean;
  allowMessages: boolean;
  showInSearch: boolean;
  incognito: boolean;

  // Visibility controls
  photoVisibility: 'everyone' | 'matches' | 'premium' | 'nobody';
  contactVisibility: 'everyone' | 'matches' | 'premium' | 'nobody';
  lastSeenVisibility: 'everyone' | 'matches' | 'premium' | 'nobody';

  // Blocked users
  blockedUsers: string[];

  // Legacy fields (for backward compatibility)
  profileVisibility?: 'everyone' | 'premium_only' | 'mutual_matches';
  lastSeen?: 'everyone' | 'matches_only' | 'nobody';
  phoneVisible?: 'nobody' | 'mutual_after_speeddate' | 'premium_matches' | 'everyone';
  emailVisible?: 'nobody' | 'mutual_after_speeddate' | 'premium_matches' | 'everyone';
  profileViewNotification?: boolean;
  likeNotification?: boolean;
  blurPhotosUntil?: 'never' | 'mutual_interest' | 'speeddate_completed';
  whoCanSendInterest?: 'everyone' | 'verified_only' | 'premium_only';
  whoCanRequestSpeedDate?: 'everyone' | 'verified_only' | 'premium_only';
  showExactLocation?: boolean;
}

export interface ProfileCompleteness {
  overall: number;
  breakdown: {
    basicDetails: number;
    photos: number;
    bio: number;
    familyDetails: number;
    education: number;
    lifestyle: number;
    partnerPreferences: number;
    verification: number;
  };
  missing: string[];
}

export interface ProfileAnalytics {
  views: {
    total: number;
    trend: number; // percentage change
  };
  likes: {
    total: number;
    trend: number;
  };
  messages: {
    total: number;
    trend: number;
  };
  matches: {
    total: number;
    trend: number;
  };
  viewsHistory: { date: string; views: number }[];
  demographics: {
    age: Record<string, number>;
    location: Record<string, number>;
    profession: Record<string, number>;
  };

  // Legacy fields (for backward compatibility)
  totalViews?: number;
  viewsThisMonth?: number;
  viewTrend?: { date: string; views: number }[];
  likesReceived?: number;
  profileViewSources?: {
    search: number;
    recommendations: number;
    mutual: number;
  };
  averageCompatibility?: number;
  peakViewTimes?: string[];
  viewerDemographics?: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    professions: Record<string, number>;
  };
  conversionFunnel?: {
    views: number;
    likes: number;
    speedDateRequests: number;
    matches: number;
  };
}

export interface TrustBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  requirement?: string;
}
