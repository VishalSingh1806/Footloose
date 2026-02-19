import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './services/serviceWorkerRegistration';
import { chatService } from './services/chatService';
import { pushNotificationService } from './services/pushNotificationService';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

// Initialize app services
async function initializeApp() {
  // Register service worker
  await registerServiceWorker();

  // Initialize offline support for chat
  await chatService.initOfflineSupport();

  // Initialize push notifications
  await pushNotificationService.init();

  console.log('App services initialized');
}

// Initialize on load
window.addEventListener('load', () => {
  initializeApp().catch(console.error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SubscriptionProvider>
      <App />
    </SubscriptionProvider>
  </StrictMode>
);
