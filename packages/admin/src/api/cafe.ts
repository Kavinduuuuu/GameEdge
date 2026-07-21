import { apiClient, apiGet, apiPatch } from './client';

export interface CafeStatus {
  id: string;
  isOpen: boolean;
  currentOccupancy: number;
  maxCapacity: number;
  lastUpdated: string;
}

export const cafeApi = {
  getStatus: () => apiGet<CafeStatus>('/cafe/status'),

  updateStatus: (data: { isOpen?: boolean; maxCapacity?: number }) =>
    apiPatch<CafeStatus>('/cafe/status', data),
};
