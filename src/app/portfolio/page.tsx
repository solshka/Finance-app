import { StockTable } from '@/components/portfolio/StockTable';

export default function PortfolioPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">ポートフォリオ</h1>
      <StockTable />
    </div>
  );
}
