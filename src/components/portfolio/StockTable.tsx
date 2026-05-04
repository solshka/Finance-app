'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useFinanceStore } from '@/store/financeStore';
import { Stock } from '@/types';
import {
  formatCurrency,
  calcStockValue,
  calcUnrealizedPnL,
  calcPnLRate,
} from '@/lib/utils';
import { StockDialog } from './StockDialog';
import { Pencil, Trash2, Plus, RefreshCw } from 'lucide-react';

export function StockTable() {
  const { stocks, deleteStock, updateStock } = useFinanceStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Stock | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Stock | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  const fetchPrices = useCallback(async () => {
    if (stocks.length === 0) return;
    setRefreshing(true);
    try {
      const tickers = stocks.map((s) => s.ticker).join(',');
      const res = await fetch(`/api/stock-price?tickers=${encodeURIComponent(tickers)}`);
      const prices: Record<string, number | null> = await res.json();
      stocks.forEach((s) => {
        const price = prices[s.ticker];
        if (price != null) updateStock(s.id, { currentPrice: price });
      });
    } finally {
      setRefreshing(false);
    }
  }, [stocks, updateStock]);

  useEffect(() => {
    fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (stock: Stock) => {
    setEditing(stock);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteStock(deleteTarget.id);
      setDeleteTarget(undefined);
    }
  };

  const totalValue = stocks.reduce((sum, s) => sum + calcStockValue(s), 0);
  const totalCost = stocks.reduce((sum, s) => sum + s.shares * s.avgPrice, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLRate = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-6 text-sm">
          <span className="text-muted-foreground">評価額合計: <strong className="text-foreground">{formatCurrency(totalValue)}</strong></span>
          <span className={`font-medium ${totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            含み損益: {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            <span className="text-xs ml-1">({totalPnLRate >= 0 ? '+' : ''}{totalPnLRate.toFixed(2)}%)</span>
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchPrices} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            現在値を更新
          </Button>
          <Button onClick={handleAdd} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            銘柄追加
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>銘柄コード</TableHead>
              <TableHead className="text-right">保有株数</TableHead>
              <TableHead className="text-right">平均取得単価</TableHead>
              <TableHead className="text-right">現在値</TableHead>
              <TableHead className="text-right">評価額</TableHead>
              <TableHead className="text-right">含み損益</TableHead>
              <TableHead className="text-right">損益率</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  銘柄が登録されていません
                </TableCell>
              </TableRow>
            ) : (
              stocks.map((stock) => {
                const pnl = calcUnrealizedPnL(stock);
                const rate = calcPnLRate(stock);
                const isPos = pnl >= 0;
                return (
                  <TableRow key={stock.id}>
                    <TableCell className="font-semibold">{stock.ticker}</TableCell>
                    <TableCell className="text-right">{stock.shares.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(stock.avgPrice)}</TableCell>
                    <TableCell className="text-right">
                      {stock.currentPrice > 0
                        ? formatCurrency(stock.currentPrice)
                        : <span className="text-muted-foreground text-xs">取得中...</span>}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(calcStockValue(stock))}</TableCell>
                    <TableCell className={`text-right font-medium ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPos ? '+' : ''}{formatCurrency(pnl)}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPos ? '+' : ''}{rate.toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleEdit(stock)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(stock)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <StockDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          fetchPrices();
        }}
        stock={editing}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(undefined)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>削除の確認</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            「{deleteTarget?.ticker}」を削除しますか？この操作は元に戻せません。
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
