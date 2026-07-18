import React from 'react';
import { DollarSign, Calendar, Monitor, DoorOpen } from 'lucide-react';
import clsx from 'clsx';
import { formatCurrency } from '../../utils/format';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: 'blue' | 'green' | 'red' | 'amber';
  action?: React.ReactNode;
}

function StatCard({ title, value, subtitle, icon, accent = 'blue', action }: StatCardProps) {
  const accentColor = {
    blue: 'bg-accent-blue/10 text-accent-blue',
    green: 'bg-accent-green/10 text-accent-green',
    red: 'bg-accent-red/10 text-accent-red',
    amber: 'bg-accent-amber/10 text-accent-amber',
  }[accent];

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={clsx('p-3 rounded-xl', accentColor)}>{icon}</div>
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface StatsCardsProps {
  revenue: number;
  activeBookings: number;
  utilization: string;
  cafeOpen: boolean;
  onToggleCafe: () => void;
}

export function StatsCards({ revenue, activeBookings, utilization, cafeOpen, onToggleCafe }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Today's Revenue"
        value={formatCurrency(revenue)}
        subtitle="Total from bookings + POS"
        icon={<DollarSign className="w-5 h-5" />}
        accent="green"
      />
      <StatCard
        title="Active Bookings"
        value={activeBookings}
        subtitle="Currently in progress"
        icon={<Calendar className="w-5 h-5" />}
        accent="blue"
      />
      <StatCard
        title="Device Utilization"
        value={utilization}
        subtitle="Occupied / Total"
        icon={<Monitor className="w-5 h-5" />}
        accent="amber"
      />
      <StatCard
        title="Cafe Status"
        value={cafeOpen ? 'OPEN' : 'CLOSED'}
        subtitle="Current operating status"
        icon={<DoorOpen className="w-5 h-5" />}
        accent={cafeOpen ? 'green' : 'red'}
        action={
          <button onClick={onToggleCafe} className={clsx('w-full text-sm py-1.5 rounded-lg font-medium transition-colors',
            cafeOpen ? 'bg-accent-red/20 text-accent-red hover:bg-accent-red/30' : 'bg-accent-green/20 text-accent-green hover:bg-accent-green/30'
          )}>
            {cafeOpen ? 'Close Cafe' : 'Open Cafe'}
          </button>
        }
      />
    </div>
  );
}
