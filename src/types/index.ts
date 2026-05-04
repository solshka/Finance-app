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
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, t: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;
  addStock: (s: Omit<Stock, 'id' | 'updatedAt'>) => void;
  updateStock: (id: string, s: Partial<Omit<Stock, 'id'>>) => void;
  deleteStock: (id: string) => void;
}
