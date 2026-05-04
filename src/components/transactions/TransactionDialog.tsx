'use client';

import { useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFinanceStore } from '@/store/financeStore';
import { Transaction } from '@/types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CUSTOM_VALUE } from '@/lib/categories';

const schema = z
  .object({
    date: z.string().min(1, '日付を入力してください'),
    amount: z.coerce.number().positive('金額は正の数を入力してください'),
    type: z.enum(['income', 'expense']),
    expenseType: z.enum(['fixed', 'variable']).optional(),
    category: z.string().min(1, 'カテゴリを入力してください'),
    note: z.string().optional(),
    isSubscription: z.boolean(),
  })
  .refine(
    (data) => data.type === 'income' || data.expenseType !== undefined,
    { message: '支出種別を選択してください', path: ['expenseType'] }
  );

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

function resolveSelectValue(category: string, type: 'income' | 'expense'): string {
  const presets = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  return (presets as readonly string[]).includes(category) ? category : CUSTOM_VALUE;
}

export function TransactionDialog({ open, onClose, transaction }: Props) {
  const { addTransaction, updateTransaction } = useFinanceStore();
  const isEdit = !!transaction;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
      type: 'expense',
      category: '',
      note: '',
      isSubscription: false,
    },
  });

  const watchType = form.watch('type');
  const presets = watchType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const [selectValue, setSelectValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    if (transaction) {
      const sv = resolveSelectValue(transaction.category, transaction.type);
      setSelectValue(sv);
      setShowCustomInput(sv === CUSTOM_VALUE);
      form.reset({
        date: transaction.date,
        amount: transaction.amount,
        type: transaction.type,
        expenseType: transaction.expenseType,
        category: transaction.category,
        note: transaction.note ?? '',
        isSubscription: transaction.isSubscription,
      });
    } else {
      setSelectValue('');
      setShowCustomInput(false);
      form.reset({
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        type: 'expense',
        expenseType: undefined,
        category: '',
        note: '',
        isSubscription: false,
      });
    }
  }, [transaction, open, form]);

  // type が変わったらカテゴリをリセット
  useEffect(() => {
    setSelectValue('');
    setShowCustomInput(false);
    form.setValue('category', '');
  }, [watchType, form]);

  const handleSelectChange = (value: string) => {
    setSelectValue(value);
    if (value === CUSTOM_VALUE) {
      setShowCustomInput(true);
      form.setValue('category', '');
    } else {
      setShowCustomInput(false);
      form.setValue('category', value, { shouldValidate: true });
    }
  };

  const onSubmit = (values: FormValues) => {
    const data = {
      date: values.date,
      amount: values.amount,
      type: values.type,
      expenseType: values.type === 'expense' ? values.expenseType : undefined,
      category: values.category,
      note: values.note,
      isSubscription: values.type === 'expense' ? values.isSubscription : false,
    };
    if (isEdit && transaction) {
      updateTransaction(transaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? '収支を編集' : '収支を追加'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>日付</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>種別</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      if (v === 'income') {
                        form.setValue('expenseType', undefined);
                        form.setValue('isSubscription', false);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">収入</SelectItem>
                      <SelectItem value="expense">支出</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchType === 'expense' && (
              <FormField
                control={form.control}
                name="expenseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>支出種別</FormLabel>
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fixed">固定費</SelectItem>
                        <SelectItem value="variable">変動費</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>金額（円）</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="例: 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリ</FormLabel>
                  <Select value={selectValue} onValueChange={handleSelectChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {presets.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                      <SelectItem value={CUSTOM_VALUE}>その他（手入力）</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomInput && (
                    <FormControl>
                      <Input
                        placeholder="カテゴリを入力"
                        value={field.value}
                        onChange={field.onChange}
                        className="mt-2"
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchType === 'expense' && (
              <FormField
                control={form.control}
                name="isSubscription"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input"
                        checked={field.value}
                        onChange={field.onChange}
                        id="isSubscription"
                      />
                    </FormControl>
                    <FormLabel htmlFor="isSubscription" className="!mt-0 cursor-pointer">
                      サブスクリプション
                    </FormLabel>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ（任意）</FormLabel>
                  <FormControl>
                    <Input placeholder="メモ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
