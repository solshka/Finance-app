'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFinanceStore } from '@/store/financeStore';
import {
  formatCurrency,
  getCurrentMonthKey,
  getMonthKey,
  calcStockValue,
  calcStockCost,
} from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet, BarChart3, PiggyBank } from 'lucide-react';

export function SummaryCards() {
  const { transactions, stocks } = useFinanceStore();
  const currentMonth = getCurrentMonthKey();

  const {
    totalIncome,
    totalExpense,
    fixedExpense,
    variableExpense,
    subscriptionExpense,
    netBalance,
  } = useMemo(() => {
    const monthTx = transactions.filter(
      (tx) => getMonthKey(tx.date) === currentMonth
    );
    const income = monthTx
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expense = monthTx
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const fixed = monthTx
      .filter((tx) => tx.type === 'expense' && tx.expenseType === 'fixed')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const variable = monthTx
      .filter((tx) => tx.type === 'expense' && tx.expenseType === 'variable')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const subscription = monthTx
      .filter((tx) => tx.type === 'expense' && tx.isSubscription)
      .reduce((sum, tx) => sum + tx.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      fixedExpense: fixed,
      variableExpense: variable,
      subscriptionExpense: subscription,
      netBalance: income - expense,
    };
  }, [transactions, currentMonth]);

  const { portfolioValue, unrealizedPnL } = useMemo(() => {
    const value = stocks.reduce((sum, s) => sum + calcStockValue(s), 0);
    const cost = stocks.reduce((sum, s) => sum + calcStockCost(s), 0);
    return { portfolioValue: value, unrealizedPnL: value - cost };
  }, [stocks]);

  const isPositive = (n: number) => n >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">今月の収入</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">今月の支出</CardTitle>
          <TrendingDown className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-rose-600">{formatCurrency(totalExpense)}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="outline" className="text-xs">固定 {formatCurrency(fixedExpense)}</Badge>
            <Badge variant="outline" className="text-xs">変動 {formatCurrency(variableExpense)}</Badge>
            <Badge variant="secondary" className="text-xs">サブスク {formatCurrency(subscriptionExpense)}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">今月の収支</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${isPositive(netBalance) ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatCurrency(netBalance)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">ポートフォリオ評価額</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(portfolioValue)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">含み損益</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${isPositive(unrealizedPnL) ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isPositive(unrealizedPnL) ? '+' : ''}{formatCurrency(unrealizedPnL)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
