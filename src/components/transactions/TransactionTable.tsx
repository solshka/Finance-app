'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useFinanceStore } from '@/store/financeStore';
import { Transaction } from '@/types';
import { formatCurrency, getMonthKey } from '@/lib/utils';
import { TransactionDialog } from './TransactionDialog';
import { TransactionFilters, Filters } from './TransactionFilters';
import { Pencil, Trash2, Plus } from 'lucide-react';

export function TransactionTable() {
  const { transactions, deleteTransaction } = useFinanceStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Transaction | undefined>();
  const [filters, setFilters] = useState<Filters>({ type: 'all', month: 'all', category: 'all' });

  const categories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))].sort(),
    [transactions]
  );

  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => filters.type === 'all' || tx.type === filters.type)
      .filter((tx) => filters.month === 'all' || getMonthKey(tx.date) === filters.month)
      .filter((tx) => filters.category === 'all' || tx.category === filters.category)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filters]);

  const handleEdit = (tx: Transaction) => {
    setEditing(tx);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteTransaction(deleteTarget.id);
      setDeleteTarget(undefined);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TransactionFilters filters={filters} onChange={setFilters} categories={categories} />
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          追加
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日付</TableHead>
              <TableHead>種別</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead className="text-right">金額</TableHead>
              <TableHead>フラグ</TableHead>
              <TableHead>メモ</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  データがありません
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="whitespace-nowrap">{tx.date}</TableCell>
                  <TableCell>
                    {tx.type === 'income' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">収入</Badge>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <Badge variant="destructive" className="w-fit">支出</Badge>
                        {tx.expenseType && (
                          <span className="text-xs text-muted-foreground">
                            {tx.expenseType === 'fixed' ? '固定費' : '変動費'}
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell className={`text-right font-medium ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </TableCell>
                  <TableCell>
                    {tx.isSubscription && (
                      <Badge variant="secondary" className="text-xs">サブスク</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-32 truncate">
                    {tx.note}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleEdit(tx)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(tx)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        transaction={editing}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(undefined)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>削除の確認</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            「{deleteTarget?.category}」({deleteTarget?.date}) を削除しますか？この操作は元に戻せません。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
