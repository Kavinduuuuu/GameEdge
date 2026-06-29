'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DeviceSelector, TimeSlotGrid, CalendarView, BookingConfirmation } from '@/components/booking/DeviceSelector';
import { useBooking } from '@/hooks/useBooking';
import { formatDate, isWeekend, isPeakHour } from '@/lib/utils';
import { cn } from '@/lib/utils';

type BookingStep = 1 | 2 | 3 | 4;

const STEPS = [
  { number: 1, label: 'Device' },
  { number: 2, label: 'Date' },
  { number: 3, label: 'Time' },
  { number: 4, label: 'Confirm' },
];

export default function BookingPage() {
  const [step, setStep] = useState<BookingStep>(1);
  const [selectedDevice, setSelectedDevice] = useState<'pc' | 'ps5' | 'pool_table' | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ id: string; startTime: string; endTime: string; price: number; pricingTier: string } | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const { createBooking, isLoading } = useBooking();

  const deviceNames = {
    pc: 'Gaming PC',
    ps5: 'PlayStation 5',
    pool_table: 'Pool Table',
  };

  const deviceRates = {
    pc: 8,
    ps5: 10,
    pool_table: 12,
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedDevice !== null;
      case 2: return selectedDate !== null;
      case 3: return selectedSlot !== null;
      default: return false;
    }
  };

  const handleConfirm = async () => {
    if (!selectedDevice || !selectedDate || !selectedSlot) return;

    const result = await createBooking({
      deviceId: `${selectedDevice}-01`,
      deviceName: deviceNames[selectedDevice],
      deviceType: selectedDevice,
      date: selectedDate.toISOString().split('T')[0],
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      pricingTier: selectedSlot.pricingTier as 'standard' | 'peak' | 'weekend',
      totalPrice: selectedSlot.price,
    });

    if (result.success && result.booking) {
      setBookingId(result.booking.id);
    }
  };

  const getEndTime = (startTime: string) => {
    const [hours] = startTime.split(':').map(Number);
    return `${(hours + 1).toString().padStart(2, '0')}:00`;
  };

  const mockSlots = [
    { id: 'ts-1', startTime: '10:00', endTime: '11:00', isAvailable: true, pricingTier: 'standard', price: deviceRates[selectedDevice || 'pc'] },
    { id: 'ts-2', startTime: '11:00', endTime: '12:00', isAvailable: true, pricingTier: 'standard', price: deviceRates[selectedDevice || 'pc'] },
    { id: 'ts-3', startTime: '12:00', endTime: '13:00', isAvailable: true, pricingTier: 'standard', price: deviceRates[selectedDevice || 'pc'] },
    { id: 'ts-4', startTime: '13:00', endTime: '14:00', isAvailable: false, pricingTier: 'standard', price: deviceRates[selectedDevice || 'pc'] },
    { id: 'ts-5', startTime: '14:00', endTime: '15:00', isAvailable: true, pricingTier: 'standard', price: deviceRates[selectedDevice || 'pc'] },
    { id: 'ts-6', startTime: '15:00', endTime: '16:00', isAvailable: true, pricingTier: 'standard', price: deviceRates[selectedDevice || 'pc'] },
    { id: 'ts-7', startTime: '16:00', endTime: '17:00', isAvailable: true, pricingTier: 'standard', price: deviceRates[selectedDevice || 'pc'] },
    { id: 'ts-8', startTime: '17:00', endTime: '18:00', isAvailable: true, pricingTier: 'peak', price: deviceRates[selectedDevice || 'pc'] * 1.5 },
    { id: 'ts-9', startTime: '18:00', endTime: '19:00', isAvailable: false, pricingTier: 'peak', price: deviceRates[selectedDevice || 'pc'] * 1.5 },
    { id: 'ts-10', startTime: '19:00', endTime: '20:00', isAvailable: true, pricingTier: 'peak', price: deviceRates[selectedDevice || 'pc'] * 1.5 },
    { id: 'ts-11', startTime: '20:00', endTime: '21:00', isAvailable: true, pricingTier: 'peak', price: deviceRates[selectedDevice || 'pc'] * 1.5 },
    { id: 'ts-12', startTime: '21:00', endTime: '22:00', isAvailable: true, pricingTier: 'peak', price: deviceRates[selectedDevice || 'pc'] * 1.5 },
    { id: 'ts-13', startTime: '22:00', endTime: '23:00', isAvailable: true, pricingTier: 'standard', price: deviceRates[selectedDevice || 'pc'] },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Book a Station</h1>
          <p className="text-muted-foreground">Select your device, date, and time</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.number}>
              <div className="flex items-center">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    step >= s.number
                      ? 'bg-gameedge-primary text-white'
                      : 'bg-white/10 text-muted-foreground'
                  )}
                >
                  {step > s.number ? <Check className="h-4 w-4" /> : s.number}
                </div>
                <span
                  className={cn(
                    'ml-2 text-sm hidden sm:inline',
                    step >= s.number ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'w-8 sm:w-16 h-0.5 mx-2',
                    step > s.number ? 'bg-gameedge-primary' : 'bg-white/10'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Select Device Type</h2>
                <DeviceSelector selectedType={selectedDevice} onSelect={setSelectedDevice} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Select Date</h2>
                <CalendarView selectedDate={selectedDate} onSelect={setSelectedDate} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Select Time Slot</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <div className="h-3 w-3 rounded bg-white/10 mr-1.5" /> Standard
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground ml-3">
                    <div className="h-3 w-3 rounded bg-gameedge-warning/30 mr-1.5" /> Peak
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground ml-3">
                    <div className="h-3 w-3 rounded bg-white/2 mr-1.5 opacity-50" /> Unavailable
                  </div>
                </div>
                <TimeSlotGrid
                  slots={mockSlots}
                  selectedSlotId={selectedSlot?.id || null}
                  onSelect={setSelectedSlot}
                />
              </div>
            )}

            {step === 4 && bookingId ? (
              <BookingConfirmation
                deviceName={deviceNames[selectedDevice!]}
                date={formatDate(selectedDate!)}
                startTime={selectedSlot!.startTime}
                endTime={selectedSlot!.endTime}
                price={selectedSlot!.price}
                pricingTier={selectedSlot!.pricingTier}
                bookingId={bookingId}
              />
            ) : step === 4 ? (
              <BookingConfirmation
                deviceName={deviceNames[selectedDevice!]}
                date={formatDate(selectedDate!)}
                startTime={selectedSlot!.startTime}
                endTime={selectedSlot!.endTime}
                price={selectedSlot!.price}
                pricingTier={selectedSlot!.pricingTier}
                isSubmitting={isLoading}
                onConfirm={handleConfirm}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step === 4 && !bookingId ? (
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(3)}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        ) : step < 4 ? (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1) as BookingStep)}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={() => setStep((s) => Math.min(4, s + 1) as BookingStep)}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : null}

        {/* Success state navigation */}
        {bookingId && (
          <div className="flex justify-center mt-6">
            <Button asChild>
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
