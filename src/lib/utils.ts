import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Stock } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calcStockValue(stock: Stock): number {
  return stock.shares * stock.currentPrice;
}

export function calcStockCost(stock: Stock): number {
  return stock.shares * stock.avgPrice;
}

export function calcUnrealizedPnL(stock: Stock): number {
  return calcStockValue(stock) - calcStockCost(stock);
}

export function calcPnLRate(stock: Stock): number {
  const cost = calcStockCost(stock);
  if (cost === 0) return 0;
  return (calcUnrealizedPnL(stock) / cost) * 100;
}

export function getMonthKey(date: string): string {
  return date.slice(0, 7); // YYYY-MM
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function getLast6Months(): string[] {
  const result: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    result.push(`${y}-${m}`);
  }
  return result;
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  return `${year}/${month}`;
}
