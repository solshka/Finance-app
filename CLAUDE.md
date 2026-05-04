# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

No test runner is configured.

## Architecture

**Personal finance tracker** built with Next.js App Router, TypeScript, and Japanese UI.

### Stack
- **Next.js 16** (App Router) + React 19
- **Zustand 5** with `persist` middleware → localStorage key `"finance-store"`
- **Shadcn/ui** (Radix UI) + **Tailwind CSS 4** (OKLCH color space, CSS variables)
- **Recharts** for charts, **React Hook Form** + **Zod 4** for forms
- Path alias: `@/*` → `src/*`

### Routes
| Route | Purpose |
|---|---|
| `/` | Dashboard — SummaryCards, MonthlyChart, PortfolioPieChart |
| `/transactions` | Transaction CRUD with filters by type/month/category |
| `/portfolio` | Stock holdings CRUD with P&L calculations |

### State (`src/store/financeStore.ts`)
Single Zustand store holds `transactions[]` and `stocks[]` with add/update/delete methods. Persisted to localStorage — no backend.

### Key types (`src/types/index.ts`)
- `Transaction` — `date`, `amount`, `type` (income/expense), `expenseType` (fixed/variable), `category`, `note`, `isSubscription`
- `Stock` — `ticker`, `shares`, `avgPrice`, `currentPrice`

### Utilities (`src/lib/utils.ts`)
- `cn()` — clsx + tailwind-merge
- `formatCurrency()` — JPY formatting
- Stock helpers: `calcStockValue`, `calcStockCost`, `calcUnrealizedPnL`, `calcPnLRate`
- Date helpers: `getMonthKey`, `getCurrentMonthKey`, `getLast6Months`, `formatMonthLabel`

### Component layout
```
src/components/
  layout/      # Sidebar (client, active-route detection)
  dashboard/   # SummaryCards, MonthlyChart, PortfolioPieChart
  transactions/# TransactionTable, TransactionDialog, TransactionFilters
  portfolio/   # StockTable, StockDialog
  ui/          # Shadcn/ui primitives (button, card, dialog, form, …)
```

Interactive components are Client Components (`"use client"`). Page-level files in `src/app/` are Server Components.
