'use client';

import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/financeStore';
import { Stock } from '@/types';

const schema = z.object({
  ticker: z.string().min(1, '銘柄コードを入力してください'),
  shares: z.coerce.number().positive('保有株数は正の数を入力してください'),
  avgPrice: z.coerce.number().positive('平均取得単価は正の数を入力してください'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  stock?: Stock;
}

export function StockDialog({ open, onClose, stock }: Props) {
  const { addStock, updateStock } = useFinanceStore();
  const isEdit = !!stock;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { ticker: '', shares: 0, avgPrice: 0 },
  });

  useEffect(() => {
    if (stock) {
      form.reset({ ticker: stock.ticker, shares: stock.shares, avgPrice: stock.avgPrice });
    } else {
      form.reset({ ticker: '', shares: 0, avgPrice: 0 });
    }
  }, [stock, open, form]);

  const onSubmit = (values: FormValues) => {
    if (isEdit && stock) {
      updateStock(stock.id, values);
    } else {
      addStock({ ...values, currentPrice: 0 });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? '銘柄を編集' : '銘柄を追加'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>銘柄コード</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 7203, AAPL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>保有株数</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" placeholder="例: 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avgPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>平均取得単価（円）</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" placeholder="例: 2500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-muted-foreground">現在値はポートフォリオ画面で自動取得されます。</p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button type="submit">{isEdit ? '更新' : '追加'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
