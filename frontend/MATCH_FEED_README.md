# Match Feed - PWA Implementation

## Overview
The Match Feed is a fully PWA-optimized component that provides an offline-first, app-like experience for browsing potential matches. Built with React + TypeScript and following PWA best practices.

## 🚀 PWA Features Implemented

### 1. ✅ Offline-First Architecture
- **IndexedDB Caching**: All match data is cached locally using IndexedDB
- **Cache-First Strategy**: Matches load instantly from cache, then sync with network
- **Automatic Fallback**: When offline, app shows cached matches with indicator
- **Smart Cache Expiration**: 1-hour TTL for match data, 7 days for images

### 2. 📱 Service Worker Integration
- **Auto-Update**: Service worker updates automatically with new builds
- **Runtime Caching**: Three caching strategies:
  - **API Calls**: NetworkFirst (10s timeout, falls back to cache)
  - **Images**: CacheFirst (7-day expiration, 200 max entries)
  - **Static Assets**: Precached at install time
- **Background Sync**: Pending actions (likes/passes) sync when back online

### 3. 🎨 App-Like Feel
- **Swipe Gestures**:
  - Swipe right = Like
  - Swipe left = Pass
  - Swipe up = Super Like
  - Touch/mouse support with visual feedback
- **Pull-to-Refresh**: Native-like pull gesture to refresh matches
- **Smooth Animations**: 300ms transitions for all interactions
- **Native Gestures**: Touch-optimized with proper touch-action handling

### 4. ⚡ Performance Optimizations
- **Lazy Loading**: Images load on-demand with blur placeholder
- **Image Preloading**: Next photo preloads while viewing current
- **Virtual Scrolling**: Only renders current match card (not entire list)
- **Optimistic Updates**: Actions update UI immediately, sync later
- **Skeleton Screens**: Smooth loading states instead of spinners

### 5. 📲 Install Prompt
- **Detection**: Automatically detects if app is already installed
- **Smart Banner**: Shows install prompt only to non-installed users
- **One-Click Install**: Native browser install dialog
- **Dismissible**: User can close banner if not interested

### 6. 🔔 Push Notification Ready
- **Service Worker**: Already registered and listening
- **Permission Handling**: Ready to request notification permissions
- **Background Sync**: Infrastructure in place for match notifications

### 7. 📊 Offline Indicator
- **Network Status**: Real-time online/offline detection
- **User Feedback**: Banner appears when offline
- **Graceful Degradation**: All features work offline with cached data

## 📁 Component Structure

```
/src/components/home/
├── MatchFeed.tsx              # Main feed container with PWA logic
├── MatchCard.tsx              # Swipeable match card with gestures
├── FilterModal.tsx            # Filter preferences modal
├── CompatibilityBadge.tsx     # 80%+ compatibility indicator
├── NoMatches.tsx              # Empty state with refresh
├── MatchCardSkeleton.tsx      # Loading skeleton
└── index.ts                   # Barrel exports

/src/services/
├── matchService.ts            # API layer with offline support
└── indexedDB.ts               # IndexedDB helper functions

/src/hooks/
├── useInstallPrompt.ts        # PWA install detection
└── useOnlineStatus.ts         # Network status detection
```

## 🎯 Features

### MatchFeed Component
- Displays one match at a time (Tinder-style)
- Pull-to-refresh gesture
- Online/offline indicator
- Install prompt banner (if not installed)
- Remaining matches counter
- Filter integration (placeholder)

### MatchCard Component
- **Photo Carousel**: 3 photos per match, tap sides to navigate
- **Swipe Gestures**: Touch and mouse support
- **Visual Feedback**: Shows "LIKE", "PASS", or "SUPER LIKE" overlay
- **Lazy Loading**: Images load progressively with blur effect
- **Expandable Details**: Tap center to show/hide full profile
- **Action Buttons**: Like, Pass, Super Like buttons at bottom

### FilterModal Component
- Age range slider
- Distance radius slider (5-100 km)
- Minimum compatibility slider (50-100%)
- Interest tags (multi-select)
- Reset filters button
- Apply button

### Supporting Components
- **CompatibilityBadge**: Gradient badge for 80%+ compatibility
- **NoMatches**: Empty state with refresh and preferences CTA
- **MatchCardSkeleton**: Animated loading placeholder

## 🛠️ Technical Implementation

### Offline-First Data Flow
```
1. User opens app
   ↓
2. Check IndexedDB cache
   ↓
3. Show cached matches immediately
   ↓
4. Fetch from network (if online)
   ↓
5. Update cache with fresh data
   ↓
6. Update UI if data changed
```

### Optimistic Updates
```
User swipes/clicks action
   ↓
UI updates immediately
   ↓
If online: Send to server
If offline: Queue action in localStorage
   ↓
When back online: Sync pending actions
```

### Service Worker Caching
```javascript
// NetworkFirst for API calls
- Try network first (10s timeout)
- If network fails, use cache
- Cache successful responses

// CacheFirst for images
- Check cache first
- If miss, fetch from network
- Cache for 7 days
```

## 🎨 Design System Integration

### Colors
- Primary: `#E63946` (red)
- Secondary: `#F77F00` (orange)
- Text Dark: `#1D3557` (navy)
- Text Medium: `#6C757D` (gray)
- Text Light: `#9CA3AF` (light gray)
- Background: `#FAFAFA` (off-white)

### Typography
- Headers: `font-bold text-2xl-3xl`
- Body: `text-base leading-relaxed`
- Labels: `text-sm font-semibold`
- Captions: `text-xs`

### Spacing
- Card padding: `p-6`
- Component gaps: `gap-4`
- Section spacing: `space-y-6`

### Animations
- Duration: `300ms`
- Easing: `ease-out`
- Hover: `hover:scale-110`
- Active: `active:scale-95`

## 📊 Mock Data

Currently using generated mock data (20 matches):
- Random names, ages, photos
- Compatibility scores (70-100%)
- Sample interests and locations
- Placeholder photos from Picsum

**To connect to real API**: Update `matchService.ts` to use Supabase queries instead of `generateMockMatches()`.

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### PWA Manifest
Located at `/public/manifest.json`:
- App name: "Footloose No More"
- Theme color: `#E63946`
- Display: standalone
- Orientation: portrait
- Icons: 192x192, 512x512

### Service Worker Config
Located in `vite.config.ts`:
- Auto-update mode
- Cache strategies configured
- Dev mode enabled for testing

## 🚀 Usage

### Basic Usage
```tsx
import { MatchFeed } from './components/home';

function App() {
  return <MatchFeed />;
}
```

### With Filters
```tsx
import { MatchFeed } from './components/home';

function App() {
  const handleFilterChange = (filters) => {
    console.log('Filters changed:', filters);
  };

  return <MatchFeed onFilterChange={handleFilterChange} />;
}
```

## 🧪 Testing PWA Features

### Test Offline Mode
1. Open DevTools → Network tab
2. Select "Offline" from throttling dropdown
3. Refresh page - matches still load from cache
4. Try swiping - actions queue for later sync

### Test Install Prompt
1. Open in Chrome (desktop or mobile)
2. Install banner appears if criteria met:
   - HTTPS or localhost
   - Valid manifest
   - Service worker registered
   - Not already installed

### Test Pull-to-Refresh
1. Scroll to top of match feed
2. Pull down with finger/mouse
3. Refresh icon appears
4. Release to refresh matches

### Test Service Worker
1. Open DevTools → Application tab
2. Navigate to Service Workers section
3. See active service worker
4. Check Cache Storage for cached data

## 📱 Mobile Testing

### iOS Safari
- Add to Home Screen
- Standalone mode works
- Safe area insets handled
- Smooth scrolling enabled

### Chrome Android
- Install prompt works
- Add to Home Screen
- Full-screen mode
- Push notifications ready

## 🔄 Sync Behavior

### Pending Actions
- Stored in localStorage as JSON array
- Synced automatically when online
- Cleared after successful sync
- Includes: likes, passes, super likes

### Cache Invalidation
- Match data: 1 hour TTL
- Images: 7 days TTL
- Expired cache cleaned on app load
- Force refresh available via pull-to-refresh

## 🎯 Best Practices Followed

1. ✅ **Offline-First**: Cache then network
2. ✅ **App Shell**: Instant load with skeleton
3. ✅ **Responsive**: Works on all screen sizes
4. ✅ **Accessible**: Proper ARIA labels on buttons
5. ✅ **Performance**: Lazy loading, virtual scrolling
6. ✅ **Native Feel**: Gestures, animations, haptics ready
7. ✅ **Installable**: Meets PWA install criteria
8. ✅ **Reliable**: Works offline with cached data

## 🔜 Future Enhancements

- [ ] Push notifications for new matches
- [ ] Background sync for automatic updates
- [ ] Share API integration
- [ ] Geolocation for distance calculation
- [ ] Haptic feedback (Web Vibration API)
- [ ] WebRTC for video speed dates
- [ ] Progressive image loading (blur-up)
- [ ] A/B testing framework

## 📚 Resources

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

## 🐛 Troubleshooting

### Service Worker Not Registering
- Check console for errors
- Ensure HTTPS or localhost
- Clear browser cache
- Check `vite.config.ts` PWA config

### Matches Not Caching
- Open DevTools → Application → IndexedDB
- Check for "FootlooseDB"
- Verify "matches" store exists
- Check console for IndexedDB errors

### Install Prompt Not Showing
- App must meet PWA criteria
- Must not be already installed
- Some browsers require user engagement
- Check manifest.json is valid

### Images Not Loading
- Check network tab for 404s
- Verify image URLs are valid
- Check service worker cache
- Try clearing cache and reload

---

Built with ❤️ using React, TypeScript, Tailwind CSS, and PWA best practices.
