import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { MonthlyChart } from '@/components/dashboard/MonthlyChart';
import { PortfolioPieChart } from '@/components/dashboard/PortfolioPieChart';
import { CategoryBreakdownChart } from '@/components/dashboard/CategoryBreakdownChart';

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyChart />
        <CategoryBreakdownChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioPieChart />
      </div>
    </div>
  );
}
