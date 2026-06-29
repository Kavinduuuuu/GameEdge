'use client';

import { useState, useCallback } from 'react';
import type { Booking, TimeSlot } from '@/types';
import { generateId } from '@/lib/utils';

const TIME_SLOTS: TimeSlot[] = [
  { id: 'ts-1', startTime: '10:00', endTime: '11:00', isAvailable: true, pricingTier: 'standard', price: 8 },
  { id: 'ts-2', startTime: '11:00', endTime: '12:00', isAvailable: true, pricingTier: 'standard', price: 8 },
  { id: 'ts-3', startTime: '12:00', endTime: '13:00', isAvailable: true, pricingTier: 'standard', price: 8 },
  { id: 'ts-4', startTime: '13:00', endTime: '14:00', isAvailable: false, pricingTier: 'standard', price: 8 },
  { id: 'ts-5', startTime: '14:00', endTime: '15:00', isAvailable: true, pricingTier: 'standard', price: 8 },
  { id: 'ts-6', startTime: '15:00', endTime: '16:00', isAvailable: true, pricingTier: 'standard', price: 8 },
  { id: 'ts-7', startTime: '16:00', endTime: '17:00', isAvailable: true, pricingTier: 'standard', price: 8 },
  { id: 'ts-8', startTime: '17:00', endTime: '18:00', isAvailable: true, pricingTier: 'peak', price: 12 },
  { id: 'ts-9', startTime: '18:00', endTime: '19:00', isAvailable: false, pricingTier: 'peak', price: 12 },
  { id: 'ts-10', startTime: '19:00', endTime: '20:00', isAvailable: true, pricingTier: 'peak', price: 12 },
  { id: 'ts-11', startTime: '20:00', endTime: '21:00', isAvailable: true, pricingTier: 'peak', price: 12 },
  { id: 'ts-12', startTime: '21:00', endTime: '22:00', isAvailable: true, pricingTier: 'peak', price: 12 },
  { id: 'ts-13', startTime: '22:00', endTime: '23:00', isAvailable: true, pricingTier: 'standard', price: 8 },
];

export function useBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTimeSlots = useCallback((_deviceId: string, _date: string): TimeSlot[] => {
    return TIME_SLOTS;
  }, []);

  const createBooking = useCallback(
    async (data: {
      deviceId: string;
      deviceName: string;
      deviceType: 'pc' | 'ps5' | 'pool_table';
      date: string;
      startTime: string;
      endTime: string;
      pricingTier: 'standard' | 'peak' | 'weekend';
      totalPrice: number;
    }): Promise<{ success: boolean; booking?: Booking; error?: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const booking: Booking = {
          id: 'BK-' + generateId().substring(0, 8).toUpperCase(),
          userId: 'demo-user',
          ...data,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };

        setBookings((prev) => [booking, ...prev]);
        setIsLoading(false);
        return { success: true, booking };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Booking failed';
        setError(message);
        setIsLoading(false);
        return { success: false, error: message };
      }
    },
    []
  );

  const cancelBooking = useCallback(async (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
    return { success: true };
  }, []);

  const getUserBookings = useCallback(async (_userId: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsLoading(false);
    return bookings;
  }, [bookings]);

  return {
    bookings,
    isLoading,
    error,
    getTimeSlots,
    createBooking,
    cancelBooking,
    getUserBookings,
  };
}
