import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';

interface RevenueChartProps {
  data: { period: string; revenue: number; breakdown: { booking: number; pos: number } }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="card p-5">
      <h3 className="text-lg font-semibold text-white mb-4">Revenue (Last 7 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="period" stroke="#64748b" fontSize={12} tick={{ fill: '#94a3b8' }} />
            <YAxis stroke="#64748b" fontSize={12} tick={{ fill: '#94a3b8' }} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
            />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            <Line type="monotone" dataKey="breakdown.booking" stroke="#22c55e" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="breakdown.pos" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
