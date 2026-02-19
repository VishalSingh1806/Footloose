import {
  UserProfile,
  ProfilePhoto,
  VerificationInfo,
  PartnerPreferences,
  PrivacySettings,
  ProfileCompleteness,
  ProfileAnalytics,
  TrustBadge,
} from '../types/profile';

const CURRENT_USER_ID = 'current_user';

// Mock current user profile
const MOCK_PROFILE: UserProfile = {
  id: 'profile_1',
  userId: CURRENT_USER_ID,
  name: 'Rajesh Kumar',
  age: 29,
  dateOfBirth: '1995-03-15',
  gender: 'male',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  height: "5'8\"",
  weight: '75 kg',
  religion: 'Hindu',
  community: 'Brahmin',
  motherTongue: 'Hindi',
  caste: 'Brahmin',
  education: 'B.Tech',
  educationDetails: 'Computer Science, IIT Bombay',
  profession: 'Software Engineer',
  employer: 'Tech Corp',
  income: '₹15-20 LPA',
  fatherOccupation: 'Business',
  motherOccupation: 'Teacher',
  siblings: 1,
  diet: 'vegetarian',
  smoking: false,
  drinking: false,
  hobbies: ['Reading', 'Traveling', 'Photography'],
  maritalStatus: 'never_married',
  bio: "I'm a software engineer living in Mumbai who loves exploring new places and trying new cuisines. Family-oriented person looking for a life partner who shares similar values and interests.",
  photos: [
    {
      id: 'photo_1',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      isPrimary: true,
      order: 1,
      uploadedAt: '2026-01-01T00:00:00Z',
      status: 'approved',
    },
    {
      id: 'photo_2',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      isPrimary: false,
      order: 2,
      uploadedAt: '2026-01-02T00:00:00Z',
      status: 'approved',
    },
    {
      id: 'photo_3',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      isPrimary: false,
      order: 3,
      uploadedAt: '2026-01-03T00:00:00Z',
      status: 'pending',
    },
  ],
  visibility: 'active',
  verified: true,
  trustScore: 85,
  completeness: 80,
  verification: {
    phoneVerified: true,
    emailVerified: true,
    photoVerified: true,
    idVerified: true,
    incomeVerified: false,
    educationVerified: false,
    phone: {
      status: 'verified',
      verifiedAt: '2026-01-01T00:00:00Z',
    },
    email: {
      status: 'verified',
      verifiedAt: '2026-01-01T00:00:00Z',
    },
    governmentId: {
      status: 'verified',
      idType: 'aadhaar',
      verifiedAt: '2026-01-15T00:00:00Z',
    },
    photo: {
      status: 'verified',
      verifiedAt: '2026-01-10T00:00:00Z',
    },
    company: {
      status: 'not_submitted',
    },
  },
  privacySettings: {
    showOnline: true,
    showDistance: true,
    allowMessages: true,
    showInSearch: true,
    incognito: false,
    photoVisibility: 'everyone',
    contactVisibility: 'matches',
    lastSeenVisibility: 'everyone',
    blockedUsers: [],
  },
  partnerPreferences: {
    ageRange: { min: 24, max: 34 },
    heightRange: { min: 160, max: 180 },
    maritalStatus: ['Never Married'],
    religion: ['Hindu'],
    education: ["Bachelor's", "Master's"],
    profession: ['Business Owner', 'Employed'],
    diet: ['Vegetarian'],
    smoking: ['No'],
    drinking: ['No', 'Socially'],
  },
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-02-10T00:00:00Z',
  lastActive: new Date().toISOString(),
};

// Get current user profile
export async function getUserProfile(): Promise<UserProfile> {
  await delay(300);
  const stored = localStorage.getItem('userProfile');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Merge with MOCK_PROFILE to ensure all fields exist
      const merged: UserProfile = {
        ...MOCK_PROFILE,
        ...parsed,
        bio: parsed.bio || MOCK_PROFILE.bio || '',
        photos: parsed.photos || MOCK_PROFILE.photos || [],
        verification: parsed.verification || MOCK_PROFILE.verification,
        privacySettings: parsed.privacySettings || MOCK_PROFILE.privacySettings,
        partnerPreferences: parsed.partnerPreferences || MOCK_PROFILE.partnerPreferences,
      };
      // Update localStorage with merged data
      localStorage.setItem('userProfile', JSON.stringify(merged));
      return merged;
    } catch (error) {
      // If parsing fails, clear and return MOCK_PROFILE
      console.error('Error parsing stored profile:', error);
      localStorage.setItem('userProfile', JSON.stringify(MOCK_PROFILE));
      return MOCK_PROFILE;
    }
  }
  localStorage.setItem('userProfile', JSON.stringify(MOCK_PROFILE));
  return MOCK_PROFILE;
}

// Update profile
export async function updateProfile(
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  await delay(500);
  const current = await getUserProfile();
  const updated: UserProfile = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem('userProfile', JSON.stringify(updated));
  return updated;
}

// Upload photo
export async function uploadPhoto(file: File): Promise<ProfilePhoto> {
  await delay(1000);

  // In production: Upload to server/cloud storage
  // For now: Create object URL
  const url = URL.createObjectURL(file);

  const profile = await getUserProfile();
  const newPhoto: ProfilePhoto = {
    id: `photo_${Date.now()}`,
    url,
    isPrimary: profile.photos.length === 0,
    order: profile.photos.length + 1,
    uploadedAt: new Date().toISOString(),
  };

  profile.photos.push(newPhoto);
  await updateProfile({ photos: profile.photos });

  return newPhoto;
}

// Delete photo
export async function deletePhoto(photoId: string): Promise<void> {
  await delay(300);
  const profile = await getUserProfile();
  const filtered = profile.photos.filter(p => p.id !== photoId);

  // Reorder remaining photos
  filtered.forEach((photo, index) => {
    photo.order = index + 1;
    if (index === 0) photo.isPrimary = true;
  });

  await updateProfile({ photos: filtered });
}

// Reorder photos
export async function reorderPhotos(photoIds: string[]): Promise<void> {
  await delay(300);
  const profile = await getUserProfile();

  const reordered = photoIds.map((id, index) => {
    const photo = profile.photos.find(p => p.id === id)!;
    return {
      ...photo,
      order: index + 1,
      isPrimary: index === 0,
    };
  });

  await updateProfile({ photos: reordered });
}

// Set primary photo
export async function setPrimaryPhoto(photoId: string): Promise<void> {
  await delay(300);
  const profile = await getUserProfile();

  profile.photos.forEach(photo => {
    photo.isPrimary = photo.id === photoId;
  });

  // Move to first position
  const primaryPhoto = profile.photos.find(p => p.id === photoId);
  const others = profile.photos.filter(p => p.id !== photoId);
  const reordered = [primaryPhoto!, ...others].map((photo, index) => ({
    ...photo,
    order: index + 1,
  }));

  await updateProfile({ photos: reordered });
}

// Get verification info
export async function getVerificationInfo(): Promise<VerificationInfo> {
  await delay(200);
  return {
    phone: {
      status: 'verified',
      verifiedAt: '2026-01-01T00:00:00Z',
    },
    email: {
      status: 'verified',
      verifiedAt: '2026-01-01T00:00:00Z',
    },
    governmentId: {
      status: 'verified',
      idType: 'aadhaar',
      verifiedAt: '2026-01-15T00:00:00Z',
    },
    photo: {
      status: 'pending',
    },
    company: {
      status: 'not_submitted',
    },
  };
}

// Get partner preferences
export async function getPartnerPreferences(): Promise<PartnerPreferences> {
  await delay(200);
  const stored = localStorage.getItem('partnerPreferences');
  if (stored) {
    return JSON.parse(stored);
  }

  const defaultPrefs: PartnerPreferences = {
    ageRange: { min: 24, max: 34 },
    heightRange: { min: "5'2\"", max: "6'0\"" },
    maritalStatus: ['never_married'],
    religion: ['Hindu'],
    casteNoBar: false,
    education: ['Graduate', 'Post Graduate'],
    profession: ['IT/Software', 'Engineering', 'Healthcare'],
    location: ['Mumbai', 'Pune', 'Delhi'],
    openToRelocate: true,
    diet: ['vegetarian'],
    lifestyle: ['Family-oriented', 'Fitness enthusiast'],
  };

  localStorage.setItem('partnerPreferences', JSON.stringify(defaultPrefs));
  return defaultPrefs;
}

// Update partner preferences
export async function updatePartnerPreferences(
  preferences: Partial<PartnerPreferences>
): Promise<PartnerPreferences> {
  await delay(300);
  const current = await getPartnerPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem('partnerPreferences', JSON.stringify(updated));
  return updated;
}

// Get privacy settings
export async function getPrivacySettings(): Promise<PrivacySettings> {
  await delay(200);
  const stored = localStorage.getItem('privacySettings');
  if (stored) {
    return JSON.parse(stored);
  }

  const defaultSettings: PrivacySettings = {
    profileVisibility: 'everyone',
    showInSearch: true,
    lastSeen: 'matches_only',
    showOnline: true,
    phoneVisible: 'nobody',
    emailVisible: 'nobody',
    profileViewNotification: true,
    likeNotification: true,
    blurPhotosUntil: 'never',
    whoCanSendInterest: 'everyone',
    whoCanRequestSpeedDate: 'verified_only',
    showExactLocation: true,
    showDistance: true,
  };

  localStorage.setItem('privacySettings', JSON.stringify(defaultSettings));
  return defaultSettings;
}

// Update privacy settings
export async function updatePrivacySettings(
  settings: Partial<PrivacySettings>
): Promise<PrivacySettings> {
  await delay(300);
  const current = await getPrivacySettings();
  const updated = { ...current, ...settings };
  localStorage.setItem('privacySettings', JSON.stringify(updated));
  return updated;
}

// Calculate profile completeness
export async function calculateProfileCompleteness(): Promise<ProfileCompleteness> {
  const profile = await getUserProfile();
  const preferences = await getPartnerPreferences();
  const verification = await getVerificationInfo();

  let breakdown = {
    basicDetails: 0,
    photos: 0,
    bio: 0,
    familyDetails: 0,
    education: 0,
    lifestyle: 0,
    partnerPreferences: 0,
    verification: 0,
  };

  const missing: string[] = [];

  // Basic Details (20%)
  if (profile.name && profile.age && profile.city && profile.height) {
    breakdown.basicDetails = 20;
  } else {
    missing.push('Complete basic details');
  }

  // Photos (15%)
  const photoCount = profile.photos.length;
  if (photoCount >= 5) {
    breakdown.photos = 15;
  } else if (photoCount >= 3) {
    breakdown.photos = 12;
    missing.push(`Add ${5 - photoCount} more photos`);
  } else {
    breakdown.photos = photoCount * 3;
    missing.push(`Add ${5 - photoCount} more photos`);
  }

  // Bio (15%)
  if (profile.bio && profile.bio.length > 100) {
    breakdown.bio = 15;
  } else {
    missing.push('Add a detailed bio');
  }

  // Family Details (10%)
  if (profile.familyType && profile.fatherOccupation) {
    breakdown.familyDetails = 10;
  } else {
    missing.push('Add family details');
  }

  // Education (10%)
  if (profile.education && profile.employer) {
    breakdown.education = 10;
  } else if (profile.education) {
    breakdown.education = 8;
    missing.push('Add employer name');
  } else {
    missing.push('Add education details');
  }

  // Lifestyle (10%)
  if (profile.hobbies && profile.hobbies.length > 0) {
    breakdown.lifestyle = 10;
  } else {
    missing.push('Add hobbies and interests');
  }

  // Partner Preferences (10%)
  if (preferences.ageRange && preferences.education && preferences.location) {
    breakdown.partnerPreferences = 10;
  } else {
    missing.push('Complete partner preferences');
  }

  // Verification (10%)
  let verificationPoints = 0;
  if (verification.phone.status === 'verified') verificationPoints += 2;
  if (verification.email.status === 'verified') verificationPoints += 2;
  if (verification.governmentId.status === 'verified') verificationPoints += 4;
  if (verification.photo.status === 'verified') verificationPoints += 2;
  breakdown.verification = verificationPoints;

  if (verificationPoints < 10) {
    missing.push('Complete verification');
  }

  const overall = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return {
    overall,
    breakdown,
    missing,
  };
}

// Get profile analytics
export async function getProfileAnalytics(
  timeRange: 'week' | 'month' | 'all' = 'week'
): Promise<ProfileAnalytics> {
  await delay(300);
  return {
    views: {
      total: 1247,
      trend: 12, // +12%
    },
    likes: {
      total: 24,
      trend: 8, // +8%
    },
    messages: {
      total: 156,
      trend: -5, // -5%
    },
    matches: {
      total: 12,
      trend: 25, // +25%
    },
    viewsHistory: generateViewTrend(),
    demographics: {
      age: {
        '24-28': 35,
        '29-33': 42,
        '34-38': 18,
        '39+': 5,
      },
      location: {
        Mumbai: 45,
        Pune: 25,
        Delhi: 15,
        Bangalore: 10,
        Others: 5,
      },
      profession: {
        'IT/Software': 40,
        Engineering: 20,
        Healthcare: 15,
        Finance: 12,
        Others: 13,
      },
    },
  };
}

// Get trust badges
export async function getTrustBadges(): Promise<TrustBadge[]> {
  await delay(200);
  return [
    {
      id: 'verified_user',
      name: 'Verified User',
      description: 'ID and photo verified',
      icon: '✓',
      earned: true,
    },
    {
      id: 'active_responder',
      name: 'Active Responder',
      description: 'Responds to messages within 24 hours',
      icon: '💬',
      earned: true,
    },
    {
      id: '3_speed_dates',
      name: '3 Speed Dates',
      description: 'Completed 3 speed dates',
      icon: '📹',
      earned: true,
    },
    {
      id: '10_speed_dates',
      name: '10 Speed Dates',
      description: 'Complete 10 speed dates',
      icon: '🎥',
      earned: false,
      requirement: 'Complete 7 more speed dates',
    },
    {
      id: '50_messages',
      name: '50 Messages Sent',
      description: 'Sent 50 messages',
      icon: '📨',
      earned: false,
      requirement: 'Send 32 more messages',
    },
  ];
}

// Toggle profile visibility
export async function toggleProfileVisibility(
  visible: boolean
): Promise<UserProfile> {
  await delay(300);
  const visibility = visible ? 'active' : 'paused';
  return await updateProfile({ visibility });
}

// Helper functions
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateViewTrend() {
  const trend = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    trend.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 30) + 10,
    });
  }
  return trend;
}
