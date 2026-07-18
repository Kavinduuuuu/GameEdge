import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OccupancyChartProps {
  data: { type: string; total: number; occupied: number }[];
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  return (
    <div className="card p-5">
      <h3 className="text-lg font-semibold text-white mb-4">Device Occupancy by Type</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="type" stroke="#64748b" fontSize={12} tick={{ fill: '#94a3b8' }} />
            <YAxis stroke="#64748b" fontSize={12} tick={{ fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Bar dataKey="total" fill="#334155" radius={[4, 4, 0, 0]} name="Total" />
            <Bar dataKey="occupied" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Occupied" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
