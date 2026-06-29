'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/providers/WebSocketProvider';
import type { Device } from '@/types';

const MOCK_DEVICES: Device[] = [
  { id: 'pc-01', name: 'PC Station 1', type: 'pc', stationNumber: 1, status: 'available', specs: { cpu: 'i7-13700K', gpu: 'RTX 4070', ram: '32GB DDR5', monitor: '27" 240Hz', peripherals: ['Keyboard', 'Mouse', 'Headset'] }, hourlyRate: 8 },
  { id: 'pc-02', name: 'PC Station 2', type: 'pc', stationNumber: 2, status: 'occupied', specs: { cpu: 'i7-13700K', gpu: 'RTX 4070', ram: '32GB DDR5', monitor: '27" 240Hz', peripherals: ['Keyboard', 'Mouse', 'Headset'] }, hourlyRate: 8 },
  { id: 'pc-03', name: 'PC Station 3', type: 'pc', stationNumber: 3, status: 'available', specs: { cpu: 'i7-13700K', gpu: 'RTX 4070', ram: '32GB DDR5', monitor: '27" 240Hz', peripherals: ['Keyboard', 'Mouse', 'Headset'] }, hourlyRate: 8 },
  { id: 'pc-04', name: 'PC Station 4', type: 'pc', stationNumber: 4, status: 'available', specs: { cpu: 'i7-13700K', gpu: 'RTX 4070', ram: '32GB DDR5', monitor: '27" 240Hz', peripherals: ['Keyboard', 'Mouse', 'Headset'] }, hourlyRate: 8 },
  { id: 'pc-05', name: 'PC Station 5', type: 'pc', stationNumber: 5, status: 'occupied', specs: { cpu: 'i7-13700K', gpu: 'RTX 4070', ram: '32GB DDR5', monitor: '27" 240Hz', peripherals: ['Keyboard', 'Mouse', 'Headset'] }, hourlyRate: 8 },
  { id: 'ps5-01', name: 'PS5 Station 1', type: 'ps5', stationNumber: 6, status: 'available', specs: { controllers: 2, tvSize: '55" 4K', games: ['FIFA 24', 'Spider-Man 2', 'God of War'] }, hourlyRate: 10 },
  { id: 'ps5-02', name: 'PS5 Station 2', type: 'ps5', stationNumber: 7, status: 'available', specs: { controllers: 2, tvSize: '55" 4K', games: ['FIFA 24', 'Spider-Man 2', 'God of War'] }, hourlyRate: 10 },
  { id: 'ps5-03', name: 'PS5 Station 3', type: 'ps5', stationNumber: 8, status: 'occupied', specs: { controllers: 2, tvSize: '55" 4K', games: ['FIFA 24', 'Spider-Man 2', 'God of War'] }, hourlyRate: 10 },
  { id: 'pool-01', name: 'Pool Table 1', type: 'pool_table', stationNumber: 9, status: 'available', hourlyRate: 12 },
  { id: 'pool-02', name: 'Pool Table 2', type: 'pool_table', stationNumber: 10, status: 'available', hourlyRate: 12 },
];

export function useDeviceAvailability(deviceType?: 'pc' | 'ps5' | 'pool_table') {
  const { devices: wsDevices } = useWebSocket();
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (wsDevices.length > 0) {
      setDevices((prev) => {
        const updated = [...prev];
        wsDevices.forEach((wsDevice) => {
          const index = updated.findIndex((d) => d.id === wsDevice.id);
          if (index >= 0) {
            updated[index] = wsDevice;
          }
        });
        return updated;
      });
    }
  }, [wsDevices]);

  const filteredDevices = deviceType
    ? devices.filter((d) => d.type === deviceType)
    : devices;

  const availableCount = filteredDevices.filter((d) => d.status === 'available').length;
  const totalCount = filteredDevices.length;

  const refresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  return {
    devices: filteredDevices,
    isLoading,
    availableCount,
    totalCount,
    refresh,
  };
}
