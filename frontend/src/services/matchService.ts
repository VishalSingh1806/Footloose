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
import { PendingAction } from './types';
import {
  generateMockMatches,
  mockFetchMatchById,
  mockPassAction,
  mockMaybeAction,
  mockLikeAction,
  mockSuperLikeAction,
  mockSyncPendingActions,
  initializeMockData,
} from './mockData';

export type { Match } from './indexedDB';
export { generateMockMatches } from './mockData';

// Initialize mock data pool on module load
initializeMockData();

// ============================================
// SUPABASE CLIENT
// ============================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const MATCHES_CACHE_KEY = 'matches_list';
const CACHE_TTL_SECONDS = 3600;
const PENDING_ACTIONS_KEY = 'fnm_pending_actions';

// ============================================
// FETCH MATCHES
// ============================================

export interface MatchFilters {
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
  interests?: string[];
  minCompatibility?: number;
}

export async function fetchMatches(
  filters?: MatchFilters,
  forceRefresh = false,
): Promise<{ matches: Match[]; fromCache: boolean }> {
  try {
    await clearExpiredCache();

    if (!forceRefresh && (await isCacheValid(MATCHES_CACHE_KEY))) {
      const cached = await getMatches();
      if (cached.length > 0) {
        console.log('[matchService] Returning matches from cache');
        return { matches: applyFilters(cached, filters), fromCache: true };
      }
    }

    if (navigator.onLine) {
      if (!supabase) {
        console.log('[matchService] Supabase not configured, using mock data');
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
      await saveMatches(matches);
      await setCacheMetadata(MATCHES_CACHE_KEY, CACHE_TTL_SECONDS);
      return { matches: applyFilters(matches, filters), fromCache: false };
    }

    const cached = await getMatches();
    return { matches: applyFilters(cached, filters), fromCache: true };
  } catch (error) {
    console.warn('[matchService] Supabase unavailable, using mock data', error);
    const matches = generateMockMatches(20);
    await saveMatches(matches);
    await setCacheMetadata(MATCHES_CACHE_KEY, CACHE_TTL_SECONDS);
    return { matches: applyFilters(matches, filters), fromCache: false };
  }
}

// ============================================
// FETCH MATCH BY ID
// ============================================

export async function fetchMatchById(id: string): Promise<Match | null> {
  try {
    const cached = await getMatch(id);
    if (cached) return cached;

    if (navigator.onLine && supabase) {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const match = data as Match;
      await saveMatch(match);
      return match;
    }

    return await mockFetchMatchById(id);
  } catch (error) {
    console.warn('[matchService] Supabase unavailable for match detail, using mock', error);
    return mockFetchMatchById(id);
  }
}

// ============================================
// PASS ACTION
// ============================================

export async function passMatch(matchId: string, userId = 'local'): Promise<boolean> {
  storePendingAction({ user_id: userId, match_id: matchId, action_type: 'pass', created_at: new Date().toISOString() });

  try {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase.from('user_actions').insert({
      user_id: userId, match_id: matchId, action_type: 'pass', created_at: new Date().toISOString(),
    });

    if (error) throw error;
    removePendingAction(matchId, 'pass');
    return true;
  } catch (error) {
    console.warn('[matchService] Supabase unavailable for pass, using mock', error);
    const result = await mockPassAction(matchId, userId);
    return result.success;
  }
}

// ============================================
// MAYBE / SHORTLIST ACTION
// ============================================

export async function maybeMatch(matchId: string, userId = 'local'): Promise<boolean> {
  storePendingAction({ user_id: userId, match_id: matchId, action_type: 'maybe', created_at: new Date().toISOString() });

  try {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase.from('user_actions').insert({
      user_id: userId, match_id: matchId, action_type: 'maybe', created_at: new Date().toISOString(),
    });

    if (error) throw error;
    removePendingAction(matchId, 'maybe');
    return true;
  } catch (error) {
    console.warn('[matchService] Supabase unavailable for maybe, using mock', error);
    const result = await mockMaybeAction(matchId, userId);
    return result.success;
  }
}

// ============================================
// LIKE ACTION
// ============================================

export async function likeMatch(matchId: string, userId = 'local'): Promise<boolean> {
  storePendingAction({ user_id: userId, match_id: matchId, action_type: 'like', created_at: new Date().toISOString() });

  try {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase.from('user_actions').insert({
      action_type: 'like', match_id: matchId, timestamp: new Date().toISOString(),
    });

    if (error) throw error;
    removePendingAction(matchId, 'like');
    return true;
  } catch (error) {
    console.warn('[matchService] Supabase unavailable for like, using mock', error);
    const result = await mockLikeAction(matchId, userId);
    return result.success;
  }
}

// ============================================
// SUPER-LIKE ACTION
// ============================================

export async function superLikeMatch(matchId: string, userId = 'local'): Promise<boolean> {
  storePendingAction({ user_id: userId, match_id: matchId, action_type: 'super_like', created_at: new Date().toISOString() });

  try {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase.from('user_actions').insert({
      action_type: 'super_like', match_id: matchId, timestamp: new Date().toISOString(),
    });

    if (error) throw error;
    removePendingAction(matchId, 'super_like');
    return true;
  } catch (error) {
    console.warn('[matchService] Supabase unavailable for super-like, using mock', error);
    const result = await mockSuperLikeAction(matchId, userId);
    return result.success;
  }
}

// ============================================
// SYNC PENDING ACTIONS
// ============================================

export async function syncPendingActions(): Promise<void> {
  const pending = getPendingActions();
  if (pending.length === 0) return;

  console.log(`[matchService] Syncing ${pending.length} pending actions...`);

  try {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase.from('user_actions').insert(pending);
    if (error) throw error;

    clearPendingActions();
    console.log('[matchService] Successfully synced pending actions');
  } catch (error) {
    console.warn('[matchService] Supabase unavailable for sync, using mock', error);
    const result = await mockSyncPendingActions(pending);
    if (result.success) {
      clearPendingActions();
      console.log('[matchService] Mock sync completed');
    }
  }
}

// ============================================
// PENDING ACTIONS QUEUE
// ============================================

function getPendingActions(): PendingAction[] {
  try {
    const stored = localStorage.getItem(PENDING_ACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storePendingAction(action: PendingAction): void {
  const pending = getPendingActions();
  pending.push(action);
  localStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(pending));
}

function removePendingAction(matchId: string, actionType: PendingAction['action_type']): void {
  const pending = getPendingActions().filter(
    a => !(a.match_id === matchId && a.action_type === actionType),
  );
  localStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(pending));
}

function clearPendingActions(): void {
  localStorage.removeItem(PENDING_ACTIONS_KEY);
}

export async function clearAllCache(): Promise<void> {
  await clearMatches();
  clearPendingActions();
}

// ============================================
// FILTERS
// ============================================

function applyFilters(matches: Match[], filters?: MatchFilters): Match[] {
  if (!filters) return matches;

  return matches.filter(match => {
    if (filters.minAge && match.age < filters.minAge) return false;
    if (filters.maxAge && match.age > filters.maxAge) return false;
    if (filters.maxDistance && match.distance && match.distance > filters.maxDistance) return false;
    if (filters.minCompatibility && match.compatibility < filters.minCompatibility) return false;
    if (filters.interests?.length) {
      if (!filters.interests.some(i => match.interests.includes(i))) return false;
    }
    return true;
  });
}
