import {
  Transaction,
  CreditUsage,
  UserSubscription,
  CreditBalance,
} from '../types/subscription';

const DB_NAME = 'FootlooseSubscription';
const DB_VERSION = 1;

class SubscriptionDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Transactions store
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', {
            keyPath: 'id',
          });
          transactionStore.createIndex('userId', 'userId', { unique: false });
          transactionStore.createIndex('createdAt', 'createdAt', {
            unique: false,
          });
          transactionStore.createIndex('status', 'status', { unique: false });
          transactionStore.createIndex('type', 'type', { unique: false });
        }

        // Credit usage store
        if (!db.objectStoreNames.contains('creditUsage')) {
          const usageStore = db.createObjectStore('creditUsage', {
            keyPath: 'id',
          });
          usageStore.createIndex('userId', 'userId', { unique: false });
          usageStore.createIndex('timestamp', 'timestamp', { unique: false });
          usageStore.createIndex('type', 'type', { unique: false });
        }

        // Subscriptions store
        if (!db.objectStoreNames.contains('subscriptions')) {
          const subStore = db.createObjectStore('subscriptions', {
            keyPath: 'id',
          });
          subStore.createIndex('userId', 'userId', { unique: false });
          subStore.createIndex('status', 'status', { unique: false });
        }

        // Credit balance store
        if (!db.objectStoreNames.contains('creditBalance')) {
          db.createObjectStore('creditBalance', { keyPath: 'userId' });
        }

        // Pending payments queue
        if (!db.objectStoreNames.contains('pendingPayments')) {
          db.createObjectStore('pendingPayments', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };
    });
  }

  // Transaction methods
  async saveTransaction(transaction: Transaction): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['transactions'], 'readwrite');
      const store = tx.objectStore('transactions');
      const request = store.put(transaction);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['transactions'], 'readonly');
      const store = tx.objectStore('transactions');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const transactions = request.result || [];
        // Sort by date descending
        transactions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        resolve(transactions);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['transactions'], 'readonly');
      const store = tx.objectStore('transactions');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Credit usage methods
  async saveCreditUsage(usage: CreditUsage): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['creditUsage'], 'readwrite');
      const store = tx.objectStore('creditUsage');
      const request = store.put(usage);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCreditUsage(
    userId: string,
    limit?: number
  ): Promise<CreditUsage[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['creditUsage'], 'readonly');
      const store = tx.objectStore('creditUsage');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        let usage = request.result || [];
        // Sort by timestamp descending
        usage.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        if (limit) {
          usage = usage.slice(0, limit);
        }
        resolve(usage);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Credit balance methods
  async saveCreditBalance(balance: CreditBalance): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['creditBalance'], 'readwrite');
      const store = tx.objectStore('creditBalance');
      const request = store.put(balance);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCreditBalance(userId: string): Promise<CreditBalance | null> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['creditBalance'], 'readonly');
      const store = tx.objectStore('creditBalance');
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Subscription methods
  async saveSubscription(subscription: UserSubscription): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['subscriptions'], 'readwrite');
      const store = tx.objectStore('subscriptions');
      const request = store.put(subscription);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSubscription(userId: string): Promise<UserSubscription | null> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['subscriptions'], 'readonly');
      const store = tx.objectStore('subscriptions');
      const index = store.index('userId');
      const request = index.get(userId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Pending payments queue
  async queuePendingPayment(payment: any): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['pendingPayments'], 'readwrite');
      const store = tx.objectStore('pendingPayments');
      const request = store.add(payment);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingPayments(): Promise<any[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['pendingPayments'], 'readonly');
      const store = tx.objectStore('pendingPayments');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async clearPendingPayment(id: number): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['pendingPayments'], 'readwrite');
      const store = tx.objectStore('pendingPayments');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Cleanup old data
  async cleanupOldTransactions(daysToKeep: number = 90): Promise<void> {
    await this.init();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['transactions'], 'readwrite');
      const store = tx.objectStore('transactions');
      const index = store.index('createdAt');
      const request = index.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const transaction = cursor.value;
          if (new Date(transaction.createdAt) < cutoffDate) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const subscriptionDB = new SubscriptionDB();
