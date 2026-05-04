export type TransactionType = 'income' | 'expense';
export type ExpenseType = 'fixed' | 'variable';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  type: TransactionType;
  expenseType?: ExpenseType;
  category: string;
  note?: string;
  isSubscription: boolean;
  createdAt: number;
}

export interface Stock {
  id: string;
  ticker: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  updatedAt: number;
}

export interface FinanceState {
  transactions: Transaction[];
  stocks: Stock[];
  hydrate: (transactions: Transaction[], stocks: Stock[]) => void;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, t: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addStock: (s: Omit<Stock, 'id' | 'updatedAt'>) => Promise<void>;
  updateStock: (id: string, s: Partial<Omit<Stock, 'id'>>) => Promise<void>;
  deleteStock: (id: string) => Promise<void>;
}
