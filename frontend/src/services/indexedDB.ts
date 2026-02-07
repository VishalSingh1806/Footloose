// IndexedDB helper for offline caching
const DB_NAME = 'FootlooseDB';
const DB_VERSION = 1;
const MATCHES_STORE = 'matches';
const CACHE_METADATA_STORE = 'cache_metadata';

export interface Match {
  id: string;
  userId: string; // e.g., "TVSW1769"
  name: string;
  age: number;
  bio: string;
  photos: string[];
  compatibility: number;
  location: string;
  country: string;
  interests: string[];
  createdAt: string;
  distance?: number;

  // Physical attributes
  height: string; // e.g., "5'4\""
  weight: string; // e.g., "52 kg"
  complexion: string; // Fair, Wheatish, Dark
  bodyType?: string;

  // Religion & Community
  religion: string;
  community: string;
  caste?: string;
  subCaste?: string;
  motherTongue: string;

  // Education & Career
  education: string;
  educationDetail?: string; // e.g., "IIM Bangalore"
  occupation: string;
  occupationDetail?: string; // e.g., "HR Manager at Tech Company"
  annualIncome: string; // e.g., "₹4-5 Lakhs"
  workingAs?: string;

  // Family
  familyStatus: string; // Middle Class, Upper Middle Class, Rich
  familyType: string; // Joint, Nuclear
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string; // e.g., "1 brother, 1 sister"
  familyLocation: string;

  // Lifestyle
  maritalStatus: string;
  eatingHabits: string;
  drinking: string;
  smoking: string;
  hobbies: string[];
  languages: string[];
  physicallyChallenged: boolean;

  // Partner Preferences
  partnerPreferences: {
    ageRange: string;
    heightRange: string;
    maritalStatus: string[];
    education: string[];
    location: string[];
  };

  // Metadata
  verified: boolean;
  premium: boolean;
  profileManagedBy?: string;
  lastActive: string; // e.g., "Active yesterday"
  isNewlyJoined: boolean; // Joined < 7 days
  isDailyRecommendation?: boolean;
}

interface CacheMetadata {
  key: string;
  timestamp: number;
  expiresAt: number;
}

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create matches store
      if (!database.objectStoreNames.contains(MATCHES_STORE)) {
        const matchesStore = database.createObjectStore(MATCHES_STORE, { keyPath: 'id' });
        matchesStore.createIndex('compatibility', 'compatibility', { unique: false });
        matchesStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Create cache metadata store
      if (!database.objectStoreNames.contains(CACHE_METADATA_STORE)) {
        database.createObjectStore(CACHE_METADATA_STORE, { keyPath: 'key' });
      }
    };
  });
}

// Generic get from store
async function getFromStore<T>(storeName: string, key: string): Promise<T | null> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// Generic put to store
async function putToStore<T>(storeName: string, data: T): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Generic get all from store
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// Generic clear store
async function clearStore(storeName: string): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Matches-specific functions
export async function saveMatches(matches: Match[]): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(MATCHES_STORE, 'readwrite');
    const store = transaction.objectStore(MATCHES_STORE);

    matches.forEach((match) => store.put(match));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getMatches(): Promise<Match[]> {
  return getAllFromStore<Match>(MATCHES_STORE);
}

export async function getMatch(id: string): Promise<Match | null> {
  return getFromStore<Match>(MATCHES_STORE, id);
}

export async function saveMatch(match: Match): Promise<void> {
  return putToStore(MATCHES_STORE, match);
}

export async function clearMatches(): Promise<void> {
  return clearStore(MATCHES_STORE);
}

// Cache metadata functions
export async function setCacheMetadata(key: string, ttlSeconds: number = 3600): Promise<void> {
  const metadata: CacheMetadata = {
    key,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttlSeconds * 1000,
  };
  return putToStore(CACHE_METADATA_STORE, metadata);
}

export async function getCacheMetadata(key: string): Promise<CacheMetadata | null> {
  return getFromStore<CacheMetadata>(CACHE_METADATA_STORE, key);
}

export async function isCacheValid(key: string): Promise<boolean> {
  const metadata = await getCacheMetadata(key);
  if (!metadata) return false;
  return Date.now() < metadata.expiresAt;
}

export async function clearExpiredCache(): Promise<void> {
  const database = await initDB();
  const allMetadata = await getAllFromStore<CacheMetadata>(CACHE_METADATA_STORE);
  const now = Date.now();

  const expiredKeys = allMetadata.filter((m) => m.expiresAt < now).map((m) => m.key);

  if (expiredKeys.length === 0) return;

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(CACHE_METADATA_STORE, 'readwrite');
    const store = transaction.objectStore(CACHE_METADATA_STORE);

    expiredKeys.forEach((key) => store.delete(key));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
