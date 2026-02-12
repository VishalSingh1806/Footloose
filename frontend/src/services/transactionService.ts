import { Transaction, TransactionFilters } from '../types/subscription';
import { subscriptionDB } from './subscriptionDB';
import { mockAPI } from './mockAPI';

const CURRENT_USER_ID = 'current_user'; // TODO: Get from auth context

// Get all transactions
export async function getTransactions(
  filters?: TransactionFilters
): Promise<Transaction[]> {
  try {
    // Get from IndexedDB
    let transactions = await subscriptionDB.getTransactions(CURRENT_USER_ID);

    // Apply filters
    if (filters) {
      if (filters.type) {
        transactions = transactions.filter(t => t.type === filters.type);
      }
      if (filters.status) {
        transactions = transactions.filter(t => t.status === filters.status);
      }
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        transactions = transactions.filter(
          t => new Date(t.createdAt) >= startDate
        );
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        transactions = transactions.filter(
          t => new Date(t.createdAt) <= endDate
        );
      }
    }

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

// Get transaction by ID
export async function getTransactionById(
  id: string
): Promise<Transaction | null> {
  try {
    return await subscriptionDB.getTransactionById(id);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
}

// Get transactions grouped by date
export async function getTransactionsGroupedByDate(): Promise<
  Record<string, Transaction[]>
> {
  const transactions = await getTransactions();
  const grouped: Record<string, Transaction[]> = {};

  transactions.forEach(transaction => {
    const date = new Date(transaction.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });

    if (!grouped[monthName]) {
      grouped[monthName] = [];
    }
    grouped[monthName].push(transaction);
  });

  return grouped;
}

// Get transaction statistics
export async function getTransactionStats() {
  const transactions = await getTransactions();

  const totalSpent = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const totalCredits = transactions
    .filter(t => t.status === 'success' && t.credits)
    .reduce((sum, t) => sum + (t.credits || 0), 0);

  const successfulTransactions = transactions.filter(
    t => t.status === 'success'
  ).length;

  const failedTransactions = transactions.filter(
    t => t.status === 'failed'
  ).length;

  return {
    totalSpent,
    totalCredits,
    successfulTransactions,
    failedTransactions,
    totalTransactions: transactions.length,
  };
}

// Export transactions as CSV
export function exportTransactionsAsCSV(transactions: Transaction[]): string {
  const headers = [
    'Transaction ID',
    'Type',
    'Amount',
    'GST',
    'Total Amount',
    'Credits',
    'Status',
    'Payment Method',
    'Payment ID',
    'Date',
  ];

  const rows = transactions.map(t => [
    t.id,
    t.type,
    t.amount,
    t.gst,
    t.totalAmount,
    t.credits || 0,
    t.status,
    t.paymentMethod || '',
    t.razorpayPaymentId || '',
    new Date(t.createdAt).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
}

// Download transactions as CSV
export async function downloadTransactionsCSV(filters?: TransactionFilters) {
  const transactions = await getTransactions(filters);
  const csv = exportTransactionsAsCSV(transactions);

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
