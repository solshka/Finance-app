import { create } from 'zustand';
import { FinanceState, Transaction, Stock } from '@/types';

const generateId = () => Math.random().toString(36).slice(2, 11);

export const useFinanceStore = create<FinanceState>()((set) => ({
  transactions: [],
  stocks: [],

  hydrate: (transactions, stocks) => set({ transactions, stocks }),

  addTransaction: async (t) => {
    const tx: Transaction = { ...t, id: generateId(), createdAt: Date.now() };
    set((state) => ({ transactions: [tx, ...state.transactions] }));
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx),
    });
  },

  updateTransaction: async (id, t) => {
    set((state) => ({
      transactions: state.transactions.map((tx) => (tx.id === id ? { ...tx, ...t } : tx)),
    }));
    await fetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t),
    });
  },

  deleteTransaction: async (id) => {
    set((state) => ({ transactions: state.transactions.filter((tx) => tx.id !== id) }));
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
  },

  addStock: async (s) => {
    const stock: Stock = { ...s, id: generateId(), updatedAt: Date.now() };
    set((state) => ({ stocks: [...state.stocks, stock] }));
    await fetch('/api/stocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stock),
    });
  },

  updateStock: async (id, s) => {
    set((state) => ({
      stocks: state.stocks.map((stock) =>
        stock.id === id ? { ...stock, ...s, updatedAt: Date.now() } : stock
      ),
    }));
    await fetch(`/api/stocks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, updatedAt: Date.now() }),
    });
  },

  deleteStock: async (id) => {
    set((state) => ({ stocks: state.stocks.filter((stock) => stock.id !== id) }));
    await fetch(`/api/stocks/${id}`, { method: 'DELETE' });
  },
}));
