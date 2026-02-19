// Mock data generators and API simulators
// Used when Supabase is unavailable or in development mode

import { Match } from './indexedDB';
import { UserAction, PendingAction } from './types';

// ============================================
// STATIC DATA POOLS
// ============================================

const NAMES_FEMALE = [
  'Priya', 'Anjali', 'Neha', 'Riya', 'Pooja', 'Sneha', 'Kavita',
  'Divya', 'Swati', 'Shreya', 'Nikita', 'Simran', 'Aarti', 'Meera',
];

const NAMES_MALE = [
  'Rajesh', 'Amit', 'Rahul', 'Vikram', 'Arjun', 'Rohan', 'Karan',
  'Aditya', 'Varun', 'Nikhil', 'Siddharth', 'Akash', 'Ankit', 'Gaurav',
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat',
];

const OCCUPATIONS = [
  'Software Engineer', 'Product Manager', 'Data Analyst',
  'Marketing Manager', 'Financial Analyst', 'Consultant',
  'Doctor', 'Architect', 'Business Analyst', 'Entrepreneur',
];

const EDUCATION = ['MBA', 'B.Tech', 'M.Tech', 'CA', 'MBBS', 'B.Com', 'MA'];

const EDUCATION_DETAIL = ['IIM Bangalore', 'Delhi University', 'IIT Mumbai', 'BITS Pilani'];

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh'];

const COMMUNITIES = ['Brahmin', 'Rajput', 'Kayastha', 'Maratha', 'Kshatriya', 'Vaishya'];

const MOTHER_TONGUES = ['Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati'];

const INCOMES = ['₹3-4 Lakhs', '₹4-5 Lakhs', '₹5-7 Lakhs', '₹7-10 Lakhs', '₹10-15 Lakhs'];

const HOBBIES_POOL = ['Reading', 'Traveling', 'Cooking', 'Music', 'Yoga', 'Sports', 'Photography', 'Painting'];

const LAST_ACTIVE = ['Active today', 'Active yesterday', 'Active 2 days ago', 'Active last week'];

// Seeded random so the same ID always returns the same data
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h ^= h >>> 13;
    h = Math.imul(h, 0x9E3779B9) | 0;
    h ^= h >>> 11;
    return Math.abs(h) / 0x7FFFFFFF;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

// ============================================
// MOCK MATCH GENERATOR
// ============================================

export function generateMockMatch(id: string): Match {
  const rand = seededRandom(id);
  const isFemale = rand() > 0.5;
  const name = pick(isFemale ? NAMES_FEMALE : NAMES_MALE, rand);
  const age = 25 + Math.floor(rand() * 11);
  const city = pick(CITIES, rand);
  const heightFeet = 4 + Math.floor(rand() * 3);
  const heightInches = Math.floor(rand() * 12);
  const weight = 45 + Math.floor(rand() * 35);
  const religion = pick(RELIGIONS, rand);
  const compatibility = 70 + Math.floor(rand() * 30);

  return {
    id,
    userId: `TVSW${1000 + Math.floor(rand() * 9000)}`,
    name,
    age,
    bio: 'Looking for a life partner who values family, tradition, and mutual respect. Seeking someone with similar values and aspirations for a happy married life.',
    photos: [
      `https://picsum.photos/seed/${id}-1/400/600`,
      `https://picsum.photos/seed/${id}-2/400/600`,
      `https://picsum.photos/seed/${id}-3/400/600`,
    ],
    compatibility,
    location: city,
    country: rand() > 0.7 ? pick(['USA', 'UK', 'Canada', 'Australia'], rand) : 'India',
    interests: HOBBIES_POOL.slice(0, 2 + Math.floor(rand() * 4)),
    createdAt: new Date(Date.now() - rand() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    distance: 5 + Math.floor(rand() * 50),

    // Physical
    height: `${heightFeet}'${heightInches}"`,
    weight: `${weight} kg`,
    complexion: pick(['Fair', 'Wheatish', 'Dark'], rand),

    // Religion
    religion,
    community: pick(COMMUNITIES, rand),
    motherTongue: pick(MOTHER_TONGUES, rand),

    // Education & Career
    education: pick(EDUCATION, rand),
    educationDetail: pick(EDUCATION_DETAIL, rand),
    occupation: pick(OCCUPATIONS, rand),
    occupationDetail: 'Working at a reputed organization',
    annualIncome: pick(INCOMES, rand),
    workingAs: 'Professional',

    // Family
    familyStatus: pick(['Middle Class', 'Upper Middle Class', 'Rich'], rand),
    familyType: pick(['Joint Family', 'Nuclear Family'], rand),
    fatherOccupation: pick(['Business', 'Service', 'Retired'], rand),
    motherOccupation: pick(['Homemaker', 'Teacher', 'Working Professional'], rand),
    siblings: pick(['1 Brother', '1 Sister', '1 Brother, 1 Sister', 'No Siblings'], rand),
    familyLocation: pick(CITIES, rand),

    // Lifestyle
    maritalStatus: 'Never Married',
    eatingHabits: pick(['Vegetarian', 'Non-Vegetarian', 'Eggetarian'], rand),
    drinking: pick(['Never', 'Occasionally', 'Socially'], rand),
    smoking: pick(['Never', 'Occasionally'], rand),
    hobbies: HOBBIES_POOL.slice(0, 2 + Math.floor(rand() * 4)),
    languages: ['Hindi', 'English'].slice(0, 1 + Math.floor(rand() * 2)),
    physicallyChallenged: false,

    // Partner Preferences
    partnerPreferences: {
      ageRange: `${age - 3}-${age + 5} years`,
      heightRange: "5'4\" - 5'10\"",
      maritalStatus: ['Never Married'],
      education: ['Graduate', 'Post Graduate'],
      location: [city, pick(CITIES, rand)],
    },

    // Metadata
    verified: rand() > 0.3,
    premium: rand() > 0.6,
    profileManagedBy: rand() > 0.7 ? 'Relative/Friend' : undefined,
    lastActive: pick(LAST_ACTIVE, rand),
    isNewlyJoined: rand() > 0.7,
    isDailyRecommendation: compatibility >= 85,
  };
}

export function generateMockMatches(count: number): Match[] {
  return Array.from({ length: count }, (_, i) => generateMockMatch(`mock-${i + 1}`));
}

// ============================================
// MATCH CACHE
// Pre-populated so the same ID always returns consistent data
// ============================================

const matchCache = new Map<string, Match>();

export function initializeMockData(): void {
  if (matchCache.size > 0) return; // already initialized
  const initial = generateMockMatches(20);
  initial.forEach(m => matchCache.set(m.id, m));
  console.log('[MOCK] Initialized with 20 mock matches');
}

export function getMockMatchById(id: string): Match {
  if (!matchCache.has(id)) {
    matchCache.set(id, generateMockMatch(id));
  }
  return matchCache.get(id)!;
}

export function getAllMockMatches(): Match[] {
  return Array.from(matchCache.values());
}

// ============================================
// MOCK API RESPONSE SIMULATORS
// ============================================

function delay(ms = 250): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function mockFetchMatchById(matchId: string): Promise<Match> {
  await delay(300);
  const match = getMockMatchById(matchId);
  console.log('[MOCK] Fetched match by ID:', matchId);
  return match;
}

export async function mockPassAction(
  matchId: string,
  userId: string,
): Promise<{ success: boolean; action: UserAction }> {
  await delay(200);
  const action: UserAction = {
    id: `action-pass-${Date.now()}`,
    user_id: userId,
    match_id: matchId,
    action_type: 'pass',
    created_at: new Date().toISOString(),
  };
  console.log('[MOCK] Pass action recorded:', action);
  return { success: true, action };
}

export async function mockMaybeAction(
  matchId: string,
  userId: string,
): Promise<{ success: boolean; action: UserAction }> {
  await delay(200);
  const action: UserAction = {
    id: `action-maybe-${Date.now()}`,
    user_id: userId,
    match_id: matchId,
    action_type: 'maybe',
    created_at: new Date().toISOString(),
  };
  console.log('[MOCK] Maybe action recorded:', action);
  return { success: true, action };
}

export async function mockLikeAction(
  matchId: string,
  userId: string,
): Promise<{ success: boolean; action: UserAction; mutual: boolean }> {
  await delay(200);
  const action: UserAction = {
    id: `action-like-${Date.now()}`,
    user_id: userId,
    match_id: matchId,
    action_type: 'like',
    created_at: new Date().toISOString(),
  };
  const mutual = Math.random() < 0.2;
  console.log('[MOCK] Like action recorded:', action, mutual ? '(MUTUAL MATCH!)' : '');
  return { success: true, action, mutual };
}

export async function mockSuperLikeAction(
  matchId: string,
  userId: string,
): Promise<{ success: boolean; action: UserAction }> {
  await delay(200);
  const action: UserAction = {
    id: `action-superlike-${Date.now()}`,
    user_id: userId,
    match_id: matchId,
    action_type: 'super_like',
    created_at: new Date().toISOString(),
  };
  console.log('[MOCK] Super-like action recorded:', action);
  return { success: true, action };
}

export async function mockSyncPendingActions(
  actions: PendingAction[],
): Promise<{ success: boolean; synced: number }> {
  await delay(500);
  console.log(`[MOCK] Synced ${actions.length} pending actions`);
  return { success: true, synced: actions.length };
}
