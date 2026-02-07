import { createClient } from '@supabase/supabase-js';
import {
  Match,
  saveMatches,
  getMatches,
  getMatch,
  saveMatch,
  clearMatches,
  setCacheMetadata,
  isCacheValid,
  clearExpiredCache,
} from './indexedDB';

// Re-export Match type for convenience
export type { Match } from './indexedDB';

// Initialize Supabase client (lazy initialization)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create client if credentials are provided
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const MATCHES_CACHE_KEY = 'matches_list';
const CACHE_TTL_SECONDS = 3600; // 1 hour

export interface MatchFilters {
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
  interests?: string[];
  minCompatibility?: number;
}

// Offline-first: Try cache first, then network
export async function fetchMatches(
  filters?: MatchFilters,
  forceRefresh: boolean = false
): Promise<{ matches: Match[]; fromCache: boolean }> {
  try {
    // Clear expired cache on each fetch
    await clearExpiredCache();

    // Check if cache is valid and we're not forcing refresh
    if (!forceRefresh && (await isCacheValid(MATCHES_CACHE_KEY))) {
      const cachedMatches = await getMatches();
      if (cachedMatches.length > 0) {
        console.log('Returning matches from cache');
        return { matches: applyFilters(cachedMatches, filters), fromCache: true };
      }
    }

    // Try to fetch from network
    if (navigator.onLine) {
      console.log('Fetching matches from network');

      // If Supabase is not configured, use mock data
      if (!supabase) {
        console.log('Supabase not configured, using mock data');
        const matches = generateMockMatches(20);
        await saveMatches(matches);
        await setCacheMetadata(MATCHES_CACHE_KEY, CACHE_TTL_SECONDS);
        return { matches: applyFilters(matches, filters), fromCache: false };
      }

      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('compatibility', { ascending: false })
        .limit(50);

      if (error) throw error;

      const matches = (data || []) as Match[];

      // Save to cache
      await saveMatches(matches);
      await setCacheMetadata(MATCHES_CACHE_KEY, CACHE_TTL_SECONDS);

      return { matches: applyFilters(matches, filters), fromCache: false };
    } else {
      // Offline: return cached data
      console.log('Offline: returning cached matches');
      const cachedMatches = await getMatches();
      return { matches: applyFilters(cachedMatches, filters), fromCache: true };
    }
  } catch (error) {
    console.error('Error fetching matches:', error);

    // Fallback to cache on error
    const cachedMatches = await getMatches();
    return { matches: applyFilters(cachedMatches, filters), fromCache: true };
  }
}

// Fetch single match with offline support
export async function fetchMatchById(id: string): Promise<Match | null> {
  try {
    // Try cache first
    const cachedMatch = await getMatch(id);
    if (cachedMatch) return cachedMatch;

    // Try network if online and Supabase is configured
    if (navigator.onLine && supabase) {
      const { data, error } = await supabase.from('matches').select('*').eq('id', id).single();

      if (error) throw error;

      const match = data as Match;
      await saveMatch(match);
      return match;
    }

    return null;
  } catch (error) {
    console.error('Error fetching match:', error);
    return null;
  }
}

// Like a match (with optimistic update)
export async function likeMatch(matchId: string): Promise<boolean> {
  try {
    // Optimistic update: update local cache immediately
    const match = await getMatch(matchId);
    if (match) {
      // Store like action in pending queue if offline
      if (!navigator.onLine) {
        await storePendingAction({ type: 'like', matchId, timestamp: Date.now() });
        return true;
      }
    }

    // Send to server if online and Supabase is configured
    if (supabase) {
      const { error } = await supabase.from('user_actions').insert({
        action_type: 'like',
        match_id: matchId,
        timestamp: new Date().toISOString(),
      });

      if (error) throw error;
    } else {
      console.log('Supabase not configured, action logged locally');
    }

    return true;
  } catch (error) {
    console.error('Error liking match:', error);
    return false;
  }
}

// Pass a match (with optimistic update)
export async function passMatch(matchId: string): Promise<boolean> {
  try {
    // Optimistic update: update local cache immediately
    const match = await getMatch(matchId);
    if (match) {
      // Store pass action in pending queue if offline
      if (!navigator.onLine) {
        await storePendingAction({ type: 'pass', matchId, timestamp: Date.now() });
        return true;
      }
    }

    // Send to server if online and Supabase is configured
    if (supabase) {
      const { error } = await supabase.from('user_actions').insert({
        action_type: 'pass',
        match_id: matchId,
        timestamp: new Date().toISOString(),
      });

      if (error) throw error;
    } else {
      console.log('Supabase not configured, action logged locally');
    }

    return true;
  } catch (error) {
    console.error('Error passing match:', error);
    return false;
  }
}

// Super like a match
export async function superLikeMatch(matchId: string): Promise<boolean> {
  try {
    if (!navigator.onLine) {
      await storePendingAction({ type: 'super_like', matchId, timestamp: Date.now() });
      return true;
    }

    if (supabase) {
      const { error } = await supabase.from('user_actions').insert({
        action_type: 'super_like',
        match_id: matchId,
        timestamp: new Date().toISOString(),
      });

      if (error) throw error;
    } else {
      console.log('Supabase not configured, action logged locally');
    }

    return true;
  } catch (error) {
    console.error('Error super liking match:', error);
    return false;
  }
}

// Apply filters to matches
function applyFilters(matches: Match[], filters?: MatchFilters): Match[] {
  if (!filters) return matches;

  return matches.filter((match) => {
    if (filters.minAge && match.age < filters.minAge) return false;
    if (filters.maxAge && match.age > filters.maxAge) return false;
    if (filters.maxDistance && match.distance && match.distance > filters.maxDistance)
      return false;
    if (filters.minCompatibility && match.compatibility < filters.minCompatibility) return false;
    if (filters.interests && filters.interests.length > 0) {
      const hasMatchingInterest = filters.interests.some((interest) =>
        match.interests.includes(interest)
      );
      if (!hasMatchingInterest) return false;
    }
    return true;
  });
}

// Store pending actions for sync when back online
interface PendingAction {
  type: 'like' | 'pass' | 'super_like';
  matchId: string;
  timestamp: number;
}

async function storePendingAction(action: PendingAction): Promise<void> {
  const pending = localStorage.getItem('pending_actions');
  const actions: PendingAction[] = pending ? JSON.parse(pending) : [];
  actions.push(action);
  localStorage.setItem('pending_actions', JSON.stringify(actions));
}

// Sync pending actions when back online
export async function syncPendingActions(): Promise<void> {
  if (!navigator.onLine || !supabase) return;

  const pending = localStorage.getItem('pending_actions');
  if (!pending) return;

  const actions: PendingAction[] = JSON.parse(pending);

  for (const action of actions) {
    try {
      await supabase.from('user_actions').insert({
        action_type: action.type,
        match_id: action.matchId,
        timestamp: new Date(action.timestamp).toISOString(),
      });
    } catch (error) {
      console.error('Error syncing action:', error);
    }
  }

  // Clear pending actions after successful sync
  localStorage.removeItem('pending_actions');
}

// Clear all cached data
export async function clearAllCache(): Promise<void> {
  await clearMatches();
  localStorage.removeItem('pending_actions');
}

// Generate mock matrimonial data for development
export function generateMockMatches(count: number = 20): Match[] {
  const names = [
    'Priya',
    'Anjali',
    'Sneha',
    'Kavita',
    'Neha',
    'Pooja',
    'Riya',
    'Simran',
    'Divya',
    'Aarti',
    'Rahul',
    'Amit',
    'Rohan',
    'Karan',
    'Arjun',
    'Vikram',
    'Aditya',
    'Sanjay',
    'Rajesh',
    'Nikhil',
  ];

  const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh'];
  const communities = [
    'Brahmin - Bhumihar',
    'Rajput',
    'Kayastha',
    'Vaishya',
    'Kshatriya',
    'Maratha',
  ];
  const motherTongues = ['Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati'];
  const educations = ['MBA', 'B.Tech', 'M.Tech', 'CA', 'MBBS', 'B.Com', 'MA'];
  const occupations = [
    'Human Resources Professional',
    'Software Engineer',
    'Doctor',
    'Chartered Accountant',
    'Business Analyst',
    'Marketing Manager',
  ];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata'];
  const countries = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Singapore'];

  return Array.from({ length: count }, (_, i) => {
    const age = Math.floor(Math.random() * 10) + 25;
    const isVerified = Math.random() > 0.3;
    const isPremium = Math.random() > 0.6;
    const isNewlyJoined = Math.random() > 0.7;
    const compatibility = Math.floor(Math.random() * 30) + 70;

    return {
      id: `match-${i + 1}`,
      userId: `TVSW${1000 + i}`,
      name: names[i % names.length],
      age,
      bio: 'Looking for a life partner who values family, tradition, and mutual respect. Seeking someone with similar values and aspirations for a happy married life.',
      photos: [
        `https://picsum.photos/seed/${i + 1}/400/600`,
        `https://picsum.photos/seed/${i + 100}/400/600`,
        `https://picsum.photos/seed/${i + 200}/400/600`,
        `https://picsum.photos/seed/${i + 300}/400/600`,
      ],
      compatibility,
      location: cities[Math.floor(Math.random() * cities.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      interests: ['Reading', 'Traveling', 'Cooking', 'Music', 'Yoga'].slice(
        0,
        Math.floor(Math.random() * 3) + 2
      ),
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      distance: Math.floor(Math.random() * 50) + 5,

      // Physical
      height: `5'${Math.floor(Math.random() * 8) + 2}"`,
      weight: `${Math.floor(Math.random() * 20) + 50} kg`,
      complexion: ['Fair', 'Wheatish', 'Dark'][Math.floor(Math.random() * 3)],

      // Religion
      religion: religions[Math.floor(Math.random() * religions.length)],
      community: communities[Math.floor(Math.random() * communities.length)],
      motherTongue: motherTongues[Math.floor(Math.random() * motherTongues.length)],

      // Education & Career
      education: educations[Math.floor(Math.random() * educations.length)],
      educationDetail: ['IIM Bangalore', 'Delhi University', 'IIT Mumbai'][
        Math.floor(Math.random() * 3)
      ],
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      occupationDetail: 'Working at a reputed organization',
      annualIncome: ['₹3-4 Lakhs', '₹4-5 Lakhs', '₹5-7 Lakhs', '₹7-10 Lakhs'][
        Math.floor(Math.random() * 4)
      ],
      workingAs: 'Professional',

      // Family
      familyStatus: ['Middle Class', 'Upper Middle Class', 'Rich'][Math.floor(Math.random() * 3)],
      familyType: ['Joint Family', 'Nuclear Family'][Math.floor(Math.random() * 2)],
      fatherOccupation: ['Business', 'Service', 'Retired'][Math.floor(Math.random() * 3)],
      motherOccupation: ['Homemaker', 'Teacher', 'Working Professional'][
        Math.floor(Math.random() * 3)
      ],
      siblings: ['1 Brother', '1 Sister', '1 Brother, 1 Sister', 'No Siblings'][
        Math.floor(Math.random() * 4)
      ],
      familyLocation: cities[Math.floor(Math.random() * cities.length)],

      // Lifestyle
      maritalStatus: 'Never Married',
      eatingHabits: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian'][Math.floor(Math.random() * 3)],
      drinking: ['Never', 'Occasionally', 'Socially'][Math.floor(Math.random() * 3)],
      smoking: ['Never', 'Occasionally'][Math.floor(Math.random() * 2)],
      hobbies: ['Reading', 'Traveling', 'Cooking', 'Music', 'Sports', 'Yoga'].slice(
        0,
        Math.floor(Math.random() * 4) + 2
      ),
      languages: ['Hindi', 'English', 'Marathi'].slice(0, Math.floor(Math.random() * 2) + 1),
      physicallyChallenged: false,

      // Partner Preferences
      partnerPreferences: {
        ageRange: `${age - 3}-${age + 5} years`,
        heightRange: "5'4\" - 5'10\"",
        maritalStatus: ['Never Married'],
        education: ['Graduate', 'Post Graduate'],
        location: [
          cities[Math.floor(Math.random() * cities.length)],
          cities[Math.floor(Math.random() * cities.length)],
        ],
      },

      // Metadata
      verified: isVerified,
      premium: isPremium,
      profileManagedBy: Math.random() > 0.7 ? 'Relative/Friend' : undefined,
      lastActive: [
        'Active today',
        'Active yesterday',
        'Active 2 days ago',
        'Active last week',
      ][Math.floor(Math.random() * 4)],
      isNewlyJoined,
      isDailyRecommendation: i < 10 && compatibility >= 85, // First 10 high-compatibility matches
    };
  });
}
