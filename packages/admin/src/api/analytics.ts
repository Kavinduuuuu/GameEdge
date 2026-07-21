import { apiGet } from './client';

export interface RevenueData {
  period: string;
  revenue: number;
  transactions: number;
  breakdown: { booking: number; pos: number };
}

export interface BookingAnalytics {
  total: number;
  byStatus: Record<string, number>;
  byDate: Record<string, number>;
  revenue: number;
  averageBookingValue: number;
}

export interface DeviceUtilization {
  deviceId: string;
  name: string;
  type: string;
  status: string;
  todayBookings: number;
  utilizationRate: string;
  revenue: number;
}

export interface PeakHourData {
  day: string;
  hours: { hour: string; bookings: number }[];
}

export const analyticsApi = {
  getRevenue: (period: 'daily' | 'weekly' | 'monthly') =>
    apiGet<{ period: string; data: RevenueData[] }>(`/analytics/revenue?period=${period}`),

  getBookings: () => apiGet<BookingAnalytics>('/analytics/bookings'),

  getDevices: () =>
    apiGet<{ devices: DeviceUtilization[]; summary: { totalDevices: number; averageUtilization: string; totalRevenue: number } }>('/analytics/devices'),

  getPeakHours: () =>
    apiGet<{ heatmap: PeakHourData[]; peakHour: string; peakCount: number; summary: { busiest: string } }>('/analytics/peak-hours'),
};
