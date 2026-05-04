'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '@/store/financeStore';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useFinanceStore((s) => s.hydrate);

  useEffect(() => {
    Promise.all([
      fetch('/api/transactions').then((r) => r.json()),
      fetch('/api/stocks').then((r) => r.json()),
    ]).then(([transactions, stocks]) => {
      hydrate(transactions, stocks);
    });
  }, [hydrate]);

  return <>{children}</>;
}
