import { apiClient, apiGet, apiPatch } from './client';

export interface Booking {
  id: string;
  userId: string;
  deviceId: string;
  timeSlotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'no_show';
  totalPrice: number;
  createdAt: string;
}

export interface CreateBookingInput {
  deviceId: string;
  timeSlotId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export const bookingsApi = {
  getAll: (params?: { userId?: string; date?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.set('userId', params.userId);
    if (params?.date) searchParams.set('date', params.date);
    if (params?.status) searchParams.set('status', params.status);
    const qs = searchParams.toString();
    return apiClient<Booking[]>(`/bookings${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) => apiClient<Booking>(`/bookings/${id}`),

  create: (data: CreateBookingInput) =>
    apiClient<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: { status?: string }) =>
    apiClient<Booking>(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  cancel: (id: string) =>
    apiClient<void>(`/bookings/${id}`, { method: 'DELETE' }),
};