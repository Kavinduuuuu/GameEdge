'use client';

import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/db';

export function useIndexedDB<T>(
  tableName: 'devices' | 'games' | 'reviews' | 'bookings' | 'user',
  fetcher: () => Promise<T[]>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to fetch from network
      const freshData = await fetcher();
      setData(freshData);
      setLastUpdated(new Date());

      // Cache in IndexedDB
      const table = db[tableName];
      if (table) {
        await table.clear();
        await table.bulkAdd(freshData as any);
      }
    } catch {
      // Fallback to cached data
      const cached = await db[tableName].toArray();
      if (cached.length > 0) {
        setData(cached as T[]);
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, lastUpdated, refresh };
}
