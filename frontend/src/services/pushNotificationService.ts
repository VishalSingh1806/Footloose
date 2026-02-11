/**
 * Push Notification Service
 *
 * Handles push notification subscription and messaging
 * Requires service worker to be registered
 */

// VAPID public key - replace with your own from backend
// Generate with: web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY_HERE';

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;

  /**
   * Initialize push notifications
   */
  async init() {
    // Check if service worker and push are supported
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      // Get service worker registration
      this.registration = await navigator.serviceWorker.ready;
      console.log('Service worker ready for push notifications');
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.init();
    }

    if (!this.registration) {
      console.error('No service worker registration');
      return null;
    }

    try {
      // Check if already subscribed
      let subscription = await this.registration.pushManager.getSubscription();

      if (subscription) {
        console.log('Already subscribed to push');
        return subscription;
      }

      // Request permission
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.log('Push permission denied');
        return null;
      }

      // Subscribe
      subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      console.log('Push subscription created:', subscription);

      // Send subscription to backend
      await this.sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();

      if (!subscription) {
        return true;
      }

      await subscription.unsubscribe();

      // Remove from backend
      await this.removeSubscriptionFromServer(subscription);

      console.log('Unsubscribed from push');
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
  }

  /**
   * Check if user is subscribed
   */
  async isSubscribed(): Promise<boolean> {
    if (!this.registration) {
      await this.init();
    }

    if (!this.registration) {
      return false;
    }

    const subscription = await this.registration.pushManager.getSubscription();
    return subscription !== null;
  }

  /**
   * Get current subscription
   */
  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.init();
    }

    if (!this.registration) {
      return null;
    }

    return await this.registration.pushManager.getSubscription();
  }

  /**
   * Send subscription to backend
   */
  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      // In production, send to your backend:
      // await fetch('/api/push/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscription),
      // });

      console.log('Subscription sent to server:', subscription);
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  /**
   * Remove subscription from backend
   */
  private async removeSubscriptionFromServer(subscription: PushSubscription) {
    try {
      // In production, remove from your backend:
      // await fetch('/api/push/unsubscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscription),
      // });

      console.log('Subscription removed from server');
    } catch (error) {
      console.error('Failed to remove subscription from server:', error);
    }
  }

  /**
   * Show local notification (for testing)
   */
  async showNotification(title: string, options?: NotificationOptions) {
    if (!this.registration) {
      await this.init();
    }

    if (!this.registration) {
      console.error('No service worker registration');
      return;
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      console.log('Cannot show notification - permission denied');
      return;
    }

    await this.registration.showNotification(title, {
      badge: '/icon-96.png',
      icon: '/icon-192.png',
      vibrate: [200, 100, 200],
      ...options,
    });
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

export const pushNotificationService = new PushNotificationService();

/**
 * Helper function to show message notification
 */
export async function showMessageNotification(
  senderName: string,
  message: string,
  conversationId: string
) {
  await pushNotificationService.showNotification(`${senderName}`, {
    body: message,
    tag: `chat-${conversationId}`,
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    data: {
      conversationId,
      type: 'chat_message',
      url: `/chat/${conversationId}`,
    },
    actions: [
      {
        action: 'reply',
        title: 'Reply',
      },
      {
        action: 'view',
        title: 'View',
      },
    ],
  });
}
