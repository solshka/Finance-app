import { TransactionTable } from '@/components/transactions/TransactionTable';

export default function TransactionsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">収支管理</h1>
      <TransactionTable />
    </div>
  );
}
