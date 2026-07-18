import { apiClient } from './client';

export interface Device {
  id: string;
  type: 'pc' | 'ps5' | 'pool_table';
  status: 'available' | 'occupied' | 'maintenance' | 'offline';
  name: string;
  specs?: Record<string, string>;
  createdAt: string;
}

export interface CreateDeviceInput {
  id: string;
  type: 'pc' | 'ps5' | 'pool_table';
  name: string;
  specs?: Record<string, string>;
}

export interface UpdateDeviceInput {
  name?: string;
  status?: 'available' | 'occupied' | 'maintenance' | 'offline';
  specs?: Record<string, string>;
}

export const devicesApi = {
  getAll: (type?: string, status?: string) => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    const qs = params.toString();
    return apiClient<Device[]>(`/devices${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) => apiClient<Device>(`/devices/${id}`),

  create: (data: CreateDeviceInput) =>
    apiClient<Device>('/devices', { method: 'POST', body: data }),

  update: (id: string, data: UpdateDeviceInput) =>
    apiClient<Device>(`/devices/${id}`, { method: 'PATCH', body: data }),

  delete: (id: string) =>
    apiClient<void>(`/devices/${id}`, { method: 'DELETE' }),
};
