'use client';

import React from 'react';
import { useCafeStatus } from '@/hooks/useCafeStatus';
import { cn } from '@/lib/utils';

export function CafeStatusBadge() {
  const { status, isLive } = useCafeStatus();

  return (
    <div className="inline-flex items-center space-x-2">
      <span
        className={cn(
          'relative flex h-3 w-3',
          isLive && 'animate-pulse'
        )}
      >
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75',
            status.isOpen ? 'bg-gameedge-success animate-ping' : 'bg-gameedge-danger'
          )}
        />
        <span
          className={cn(
            'relative inline-flex rounded-full h-3 w-3',
            status.isOpen ? 'bg-gameedge-success' : 'bg-gameedge-danger'
          )}
        />
      </span>
      <span
        className={cn(
          'text-sm font-medium',
          status.isOpen ? 'text-gameedge-success' : 'text-gameedge-danger'
        )}
      >
        {status.isOpen ? 'OPEN NOW' : 'CLOSED'}
      </span>
    </div>
  );
}

export function OccupancyBar() {
  const { status } = useCafeStatus();
  const percentage = Math.round((status.currentOccupancy / status.totalStations) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">Occupancy</span>
        <span className="text-foreground font-medium">
          {status.currentOccupancy}/{status.totalStations} stations
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            percentage < 50 ? 'bg-gameedge-success' : percentage < 80 ? 'bg-gameedge-warning' : 'bg-gameedge-danger'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
