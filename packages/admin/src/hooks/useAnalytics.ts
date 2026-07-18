import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics';

export function useRevenueAnalytics(period: 'daily' | 'weekly' | 'monthly') {
  return useQuery({
    queryKey: ['analytics-revenue', period],
    queryFn: () => analyticsApi.getRevenue(period),
  });
}

export function useBookingAnalytics() {
  return useQuery({
    queryKey: ['analytics-bookings'],
    queryFn: () => analyticsApi.getBookings(),
  });
}

export function useDeviceAnalytics() {
  return useQuery({
    queryKey: ['analytics-devices'],
    queryFn: () => analyticsApi.getDevices(),
  });
}

export function usePeakHoursAnalytics() {
  return useQuery({
    queryKey: ['analytics-peak-hours'],
    queryFn: () => analyticsApi.getPeakHours(),
  });
}
