# Match Feed - Daily Batch System

## Overview

This is a **completely revised** match feed implementation that aligns with the philosophy of:
- **NO infinite scroll** - Finite daily batches only (10-15 profiles)
- **NO compatibility percentages** - No false certainty
- **Simple decision-making** - 3 clear actions (Pass, Speed Date, Maybe)
- **Premium filters** - Advanced filtering is a paid feature
- **Serious interface** - Not a dating app, a decision-making tool

## Components

### 1. MatchFeed.jsx
Main feed component with daily batch logic.

**Features:**
- Fetches daily batch from server (10-15 profiles max)
- Caches batch for offline access
- Shows remaining count
- Handles Pass/Maybe/Speed Date actions
- Shows EmptyState when batch exhausted
- Offline support with banner
- Pull-to-refresh for new day checks

**State:**
- `dailyBatch`: Array of match profiles
- `currentIndex`: Current viewing position
- `batchDate`: When batch was generated
- `actions`: Tracking user actions per profile
- `isLoading`, `isOffline`, `error`: UI states

### 2. MatchCard.jsx
Individual match card - simplified design.

**Features:**
- Large portrait photo (400px height)
- Verification badge (if verified)
- Photo count indicator
- Name, age, location overlay on image
- Quick info: height, religion, profession
- Bio preview (2 lines max)
- 3 action buttons: Pass, Speed Date, Maybe
- Tap card to open full profile

**NO:**
- Compatibility percentages
- "Send Interest" button
- Expandable sections
- Multiple action buttons

### 3. EmptyState.jsx
Shown when daily batch is exhausted.

**Features:**
- "That's all for today" message
- Two options:
  1. Adjust Preferences (free)
  2. Upgrade to Premium (if free user)
- Links to preference editor
- Links to subscription plans

**NO:**
- "Keep exploring!" with infinite content
- Random profiles to fill empty state
- Engagement hooks

### 4. DailyBatchStatus.jsx
Shows remaining profile count.

**Features:**
- "X profiles to review"
- "X profiles remaining today" (when low)
- "No more profiles today" (when exhausted)
- Updates in real-time

### 5. FilterPrompt.jsx
Premium upgrade prompt for advanced filters.

**Features:**
- Shows when free user wants filters
- Lists premium filter options
- Links to basic preference editor (free)
- Upgrade to Premium CTA

### 6. MatchCardSkeleton.jsx
Loading skeleton matching card design.

## Backend Integration

### Daily Batch Generation
Server-side algorithm runs at midnight:

1. **Hard Filters:**
   - Age: ±7 years
   - Location: Same city/state
   - Gender: Based on preference
   - Marital status: Never married (default)
   - Active users only (30 days)

2. **Soft Scoring:**
   - Family background: 20%
   - Lifestyle overlap: 20%
   - Value priorities: 30%
   - Weekend activities: 15%
   - Life pace: 15%

3. **Selection:**
   - Calculate composite score (0-100)
   - Filter: Score ≥ 70
   - Sort by score
   - Select top 10-15
   - Randomize order (hide ranking)
   - Store as daily_batch
   - Expires at midnight

### API Endpoints

```
GET  /api/matches/daily-batch
  - Returns today's batch
  - Max 10-15 profiles
  - Cached until midnight

POST /api/matches/pass
  - Mark profile as passed
  - Remove from batch

POST /api/matches/maybe
  - Add to Maybe list
  - Keep in batch

POST /api/matches/speed-date
  - Request speed date
  - Check credit balance
```

## State Management

### Local Storage
```javascript
{
  daily_batch: {
    profiles: [...],
    date: "2026-02-17"
  },
  action_queue: [
    { type: 'pass', matchId: '123', date: '...' }
  ]
}
```

### Offline Support
- Cache today's batch in localStorage
- Show "offline" banner
- Queue actions for sync when reconnected
- Display cached batch with limited features

## Analytics

Track events:
- `daily_batch_viewed`
- `match_card_viewed` (matchId, position)
- `match_passed` (matchId, time spent)
- `match_maybe` (matchId)
- `speed_date_requested` (matchId)
- `batch_exhausted` (time taken)
- `profile_opened_from_feed` (matchId)

## Removed Features

The following were **completely removed** from previous implementation:

❌ Infinite scroll logic
❌ Virtual scrolling (react-window)
❌ "Load more" functionality
❌ Compatibility percentage displays
❌ Match quality indicators
❌ "Send Interest" button
❌ Free filter modal with all options
❌ Swipe gesture handlers
❌ Profile boost badges
❌ "Most Compatible" sorting/badges
❌ Multiple action buttons (now only 3)

## Files to Delete

Delete these files from previous implementation:
- `ActionButtons.tsx` (replaced by MatchCard actions)
- `CompatibilityBadge.tsx` (removed feature)
- `DailyRecommendations.tsx` (replaced by MatchFeed)
- `FilterBar.tsx` (removed feature)
- `FilterModal.tsx` (replaced by FilterPrompt)
- `HomePage.tsx` (replaced by MatchFeed)
- `MatchCard.tsx` (old version, replaced)
- `MatchFeed.tsx` (old version, replaced)
- `NoMatches.tsx` (replaced by EmptyState)
- `PhotoGallery.tsx` (moved to profile detail)

## Usage

```jsx
import { MatchFeed } from './components/home';

function App() {
  return <MatchFeed />;
}
```

## PWA Considerations

- Offline-first architecture
- IndexedDB for batch storage
- Service Worker caches photos
- Actions queued for sync
- Fast card transitions
- Lazy-loaded images
- Compressed match data

## Accessibility

- Proper heading hierarchy
- Image alt text for profiles
- Clear button labels
- 48x48px minimum tap targets
- Focus management for keyboard
- Screen reader announcements
- High contrast support

## Philosophy

This is **not a dating app feed**.
This is a **serious decision-making interface**.

- Finite choices prevent decision fatigue
- No percentages prevent false certainty
- Simple actions prevent choice paralysis
- Daily rhythm prevents addiction
- Empty states encourage intentionality
