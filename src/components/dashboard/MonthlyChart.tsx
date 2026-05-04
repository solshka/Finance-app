'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/store/financeStore';
import { getLast6Months, getMonthKey, formatMonthLabel } from '@/lib/utils';

export function MonthlyChart() {
  const { transactions } = useFinanceStore();

  const data = useMemo(() => {
    const months = getLast6Months();
    return months.map((month) => {
      const monthTx = transactions.filter((tx) => getMonthKey(tx.date) === month);
      const income = monthTx
        .filter((tx) => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
      const expense = monthTx
        .filter((tx) => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);
      return { month: formatMonthLabel(month), income, expense };
    });
  }, [transactions]);

  const formatYAxis = (value: number) => {
    if (value >= 10000) return `${(value / 10000).toFixed(0)}万`;
    return String(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">月次収支（過去6ヶ月）</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} width={55} />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0 }).format(Number(value))
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="income" name="収入" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="支出" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
