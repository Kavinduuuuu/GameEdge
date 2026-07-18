import StatsCards from '../components/dashboard/StatsCards';
import RevenueChart from '../components/dashboard/RevenueChart';
import OccupancyChart from '../components/dashboard/OccupancyChart';
import PeakHoursChart from '../components/dashboard/PeakHoursChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <span className="text-sm text-slate-400">ERP Overview</span>
      </div>
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OccupancyChart />
      </div>
      <PeakHoursChart />
    </div>
  );
}
