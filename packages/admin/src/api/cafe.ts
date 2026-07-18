import { apiClient } from './client';

export interface CafeStatus {
  id: string;
  isOpen: boolean;
  currentOccupancy: number;
  maxCapacity: number;
  lastUpdated: string;
}

export const cafeApi = {
  getStatus: () => apiClient<CafeStatus>('/cafe/status'),

  updateStatus: (data: { isOpen?: boolean; maxCapacity?: number }) =>
    apiClient<CafeStatus>('/cafe/status', { method: 'PATCH', body: data }),
};
