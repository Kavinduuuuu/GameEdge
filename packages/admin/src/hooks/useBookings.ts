import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi, type Booking, type CreateBookingInput } from '../api/bookings';

export function useBookings(params?: { userId?: string; date?: string; status?: string }) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => bookingsApi.getAll(params),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookingInput) => bookingsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: string } }) =>
      bookingsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}
