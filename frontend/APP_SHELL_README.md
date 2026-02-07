# App Shell & Navigation Structure

## Overview
The app shell provides the main navigation and layout structure for the post-registration experience. It includes a bottom navigation bar, top bar with contextual actions, and placeholder pages for all main sections.

## Folder Structure

```
/src/components/
├── layout/           # Core layout components
│   ├── AppShell.tsx        # Main routing and state management
│   ├── AppShellDemo.tsx    # Demo wrapper with BrowserRouter
│   ├── Layout.tsx          # Combines TopBar + Content + BottomNav
│   ├── TopBar.tsx          # Top app bar (sticky)
│   ├── BottomNav.tsx       # Bottom navigation (fixed)
│   └── index.ts            # Barrel exports
├── home/            # Match feed (coming next)
│   └── HomePage.tsx
├── speeddate/       # Speed dating feature
│   └── SpeedDatesPage.tsx
├── chat/            # Messaging
│   └── MessagesPage.tsx
├── profile/         # User profile
│   └── ProfilePage.tsx
└── common/          # Shared components (buttons, cards, modals)
```

## Installation

### Install React Router
```bash
npm install react-router-dom
# or
yarn add react-router-dom
```

### Install TypeScript types (if using TypeScript)
```bash
npm install --save-dev @types/react-router-dom
# or
yarn add -D @types/react-router-dom
```

## Components

### 1. BottomNav
Bottom navigation bar with 4 main sections:
- **Matches** (Heart icon) - Shows match feed
- **Speed Dates** (Video icon) - Video dating feature
- **Messages** (Chat icon) - Messaging inbox
- **Profile** (User icon) - User profile

**Features:**
- Active state indicator (3px rounded bar above icon)
- Badge counts for new matches, pending dates, unread messages
- Smooth transitions (200ms)
- Haptic feedback on tap (where supported)
- Safe area padding for iPhone notch

### 2. TopBar
Sticky top app bar with contextual content:
- Left: Back button (optional, based on context)
- Center: Page title
- Right: Action buttons (Filter, Edit, Notifications, etc.)

**Customizable per page:**
- Matches: Filter + Notification bell
- Speed Dates: Notification bell
- Messages: No action buttons
- Profile: Edit button

### 3. Layout
Main layout container that combines:
- TopBar (sticky at top)
- Content area (scrollable, flex-1)
- BottomNav (fixed at bottom)

**Features:**
- Proper scroll handling
- iOS smooth scrolling support
- Safe area padding
- Content clearance for bottom nav

### 4. AppShell
Main app container with routing:
- Manages navigation between main sections
- Provides badge counts (from state/API)
- Customizes TopBar based on active route
- Handles global app state

### 5. AppShellDemo
Demo wrapper that includes BrowserRouter for testing.

## Usage

### Testing the App Shell

After completing registration (Screen 23), clicking "Explore Matches" or "View My Profile" will navigate to the app shell.

### Direct Testing (for development)

To test the app shell directly, you can temporarily update `App.tsx`:

```tsx
function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('app-shell');
  // ... rest of code
}
```

This will load the app shell immediately on app start.

### Navigation Flow

```
Registration Complete (Screen 23)
    ↓
App Shell (/matches)
    ├── /matches        → Match Feed
    ├── /speed-dates    → Speed Dating
    ├── /messages       → Chat/Messages
    └── /profile        → User Profile
```

## Features Demonstrated

1. **Bottom Navigation**
   - 4 main nav items
   - Active state highlighting
   - Badge counts (3 matches, 1 speed date, 2 messages)
   - Smooth transitions

2. **Top Bar**
   - Dynamic title based on route
   - Contextual action buttons
   - Notification indicators

3. **Routing**
   - React Router integration
   - Protected routes (post-login only)
   - Default redirect to /matches
   - Catch-all redirect

4. **Responsive Design**
   - Mobile-first approach
   - Safe area handling (iPhone notch)
   - Works on desktop too (max-width: 600px)

5. **Professional UX**
   - Native-like feel
   - Smooth animations
   - Haptic feedback
   - Optimized for touch

## Next Steps

### 1. Build Match Feed (HomePage.tsx)
The next major component to build. Should include:
- Swipeable profile cards
- Match algorithm integration
- Like/Pass interactions
- Match notifications

### 2. Add State Management
Consider adding:
- React Context for global state
- Redux/Zustand for complex state
- API integration for real data
- WebSocket for real-time updates

### 3. Build Remaining Pages
- Speed Dates: Video call interface, scheduling
- Messages: Chat list, conversation view
- Profile: User profile editor, settings

### 4. Add Common Components
In `/src/components/common/`:
- Button variants
- Card components
- Modal/Dialog
- Loading states
- Empty states
- Error boundaries

## Customization

### Badge Counts
Update badge counts in `AppShell.tsx`:

```tsx
const [badgeCounts, setBadgeCounts] = useState({
  matches: 3,      // New matches
  speedDates: 1,   // Pending speed date requests
  messages: 2,     // Unread messages
});
```

In production, fetch these from your API.

### Top Bar Actions
Customize TopBar buttons in `getTopBarProps()` function in `AppShell.tsx`.

### Styling
All components use:
- Tailwind CSS utility classes
- Design system colors (#E63946, #1D3557, etc.)
- Consistent spacing and sizing
- Smooth transitions

## Testing

Run the app and complete the registration flow to see the app shell in action:

```bash
npm run dev
# or
yarn dev
```

Navigate through registration → Complete profile → Click "Explore Matches" → App Shell loads!

## Troubleshooting

### "Cannot find module 'react-router-dom'"
Install react-router-dom: `npm install react-router-dom`

### Navigation not working
Make sure you're inside the `<BrowserRouter>` context (AppShellDemo provides this).

### Bottom nav not showing
Check that Layout component is being used and BottomNav is rendered.

### Safe area padding issues on iPhone
Test on actual device or iOS simulator. The `env(safe-area-inset-bottom)` CSS variable handles this automatically.

## Design Philosophy

The app shell follows modern dating app patterns (Bumble, Hinge, Tinder):
- Bottom navigation for main sections
- Top bar for contextual actions
- Card-based content
- Smooth, native-like transitions
- Optimized for one-handed mobile use
- Professional, clean aesthetic

---

Ready to build the Match Feed next! 🚀
