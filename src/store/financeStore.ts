import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinanceState, Transaction, Stock } from '@/types';

const generateId = () => Math.random().toString(36).slice(2, 11);

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: [],
      stocks: [],

      addTransaction: (t) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            { ...t, id: generateId(), createdAt: Date.now() },
          ],
        })),

      updateTransaction: (id, t) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...t } : tx
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),

      addStock: (s) =>
        set((state) => ({
          stocks: [
            ...state.stocks,
            { ...s, id: generateId(), updatedAt: Date.now() },
          ],
        })),

      updateStock: (id, s) =>
        set((state) => ({
          stocks: state.stocks.map((stock) =>
            stock.id === id
              ? { ...stock, ...s, updatedAt: Date.now() }
              : stock
          ),
        })),

      deleteStock: (id) =>
        set((state) => ({
          stocks: state.stocks.filter((stock) => stock.id !== id),
        })),
    }),
    {
      name: 'finance-store',
    }
  )
);
