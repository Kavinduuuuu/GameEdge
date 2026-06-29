'use client';

import { useWebSocket } from '@/providers/WebSocketProvider';

export function useCafeStatus() {
  const { cafeStatus, isConnected, isReconnecting } = useWebSocket();

  const defaultStatus = {
    isOpen: true,
    currentOccupancy: 15,
    totalStations: 28,
    openingTime: '10:00',
    closingTime: '23:00',
    lastUpdated: new Date().toISOString(),
  };

  return {
    status: cafeStatus || defaultStatus,
    isLive: isConnected,
    isReconnecting,
  };
}
