'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getLast6Months, formatMonthLabel } from '@/lib/utils';

export interface Filters {
  type: 'all' | 'income' | 'expense';
  month: string; // 'all' or 'YYYY-MM'
  category: string; // 'all' or category name
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  categories: string[];
}

export function TransactionFilters({ filters, onChange, categories }: Props) {
  const months = getLast6Months();

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select
        value={filters.type}
        onValueChange={(v) => onChange({ ...filters, type: v as Filters['type'] })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="種別" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          <SelectItem value="income">収入</SelectItem>
          <SelectItem value="expense">支出</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.month}
        onValueChange={(v) => onChange({ ...filters, month: v })}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="月を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべての月</SelectItem>
          {getLast6Months().map((m) => (
            <SelectItem key={m} value={m}>
              {formatMonthLabel(m)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.category}
        onValueChange={(v) => onChange({ ...filters, category: v })}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="カテゴリ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
