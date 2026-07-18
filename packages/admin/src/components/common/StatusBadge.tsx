import React from 'react';

interface StatusBadgeProps {
  status: string;
  colorMap: Record<string, string>;
}

const defaultColors: Record<string, string> = {
  available: 'bg-green-900/50 text-green-300 border-green-700',
  occupied: 'bg-red-900/50 text-red-300 border-red-700',
  maintenance: 'bg-amber-900/50 text-amber-300 border-amber-700',
  offline: 'bg-gray-700/50 text-gray-300 border-gray-600',
  pending: 'bg-amber-900/50 text-amber-300 border-amber-700',
  confirmed: 'bg-blue-900/50 text-blue-300 border-blue-700',
  active: 'bg-green-900/50 text-green-300 border-green-700',
  completed: 'bg-gray-700/50 text-gray-300 border-gray-600',
  cancelled: 'bg-red-900/50 text-red-300 border-red-700',
  paid: 'bg-green-900/50 text-green-300 border-green-700',
  success: 'bg-green-900/50 text-green-300 border-green-700',
  failed: 'bg-red-900/50 text-red-300 border-red-700',
  blocked: 'bg-amber-900/50 text-amber-300 border-amber-700',
};

export function StatusBadge({ status, colorMap }: StatusBadgeProps) {
  const colorClass = colorMap[status] || defaultColors[status] || 'bg-gray-700/50 text-gray-300 border-gray-600';

  return (
    <span className={`badge border ${colorClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
}
