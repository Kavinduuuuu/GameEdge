'use client';

import React from 'react';
import { Monitor, Gamepad2, CircleDot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DeviceSelectorProps {
  selectedType: 'pc' | 'ps5' | 'pool_table' | null;
  onSelect: (type: 'pc' | 'ps5' | 'pool_table') => void;
}

const deviceTypes = [
  {
    type: 'pc' as const,
    name: 'Gaming PC',
    description: 'High-end RTX 4070, 240Hz monitors',
    icon: Monitor,
    rate: '$8/hr',
  },
  {
    type: 'ps5' as const,
    name: 'PlayStation 5',
    description: '55" 4K TV, 2 controllers included',
    icon: Gamepad2,
    rate: '$10/hr',
  },
  {
    type: 'pool_table' as const,
    name: 'Pool Table',
    description: 'Professional tournament-quality table',
    icon: CircleDot,
    rate: '$12/hr',
  },
];

export function DeviceSelector({ selectedType, onSelect }: DeviceSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {deviceTypes.map((device) => (
        <button
          key={device.type}
          onClick={() => onSelect(device.type)}
          className={cn(
            'text-left transition-all duration-200',
            'rounded-xl border p-4',
            selectedType === device.type
              ? 'border-gameedge-primary bg-gameedge-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
          )}
        >
          <device.icon
            className={cn(
              'h-8 w-8 mb-3',
              selectedType === device.type ? 'text-gameedge-primary' : 'text-muted-foreground'
            )}
          />
          <h3 className="font-semibold text-foreground">{device.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{device.description}</p>
          <p className="text-sm font-medium text-gameedge-primary mt-2">{device.rate}</p>
        </button>
      ))}
    </div>
  );
}

interface TimeSlotGridProps {
  slots: Array<{
    id: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    pricingTier: 'standard' | 'peak' | 'weekend';
    price: number;
  }>;
  selectedSlotId: string | null;
  onSelect: (slot: { id: string; startTime: string; endTime: string; price: number; pricingTier: string }) => void;
}

export function TimeSlotGrid({ slots, selectedSlotId, onSelect }: TimeSlotGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {slots.map((slot) => {
        const hour = parseInt(slot.startTime.split(':')[0]);
        const isSelected = selectedSlotId === slot.id;

        return (
          <button
            key={slot.id}
            onClick={() => slot.isAvailable && onSelect(slot)}
            disabled={!slot.isAvailable}
            className={cn(
              'p-3 rounded-lg border text-sm font-medium transition-all',
              slot.isAvailable
                ? isSelected
                  ? 'border-gameedge-primary bg-gameedge-primary/20 text-gameedge-primary shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : slot.pricingTier === 'peak'
                    ? 'border-gameedge-warning/50 bg-gameedge-warning/10 text-gameedge-warning hover:bg-gameedge-warning/20'
                    : 'border-white/10 bg-white/5 text-foreground hover:bg-white/10'
                : 'border-white/5 bg-white/2 text-muted-foreground cursor-not-allowed opacity-50'
            )}
          >
            <div>{slot.startTime}</div>
            <div className="text-xs mt-0.5 opacity-75">
              {slot.pricingTier === 'peak' ? 'Peak' : slot.pricingTier === 'weekend' ? 'Weekend' : 'Standard'}
            </div>
            <div className="text-xs mt-0.5">${slot.price}</div>
          </button>
        );
      })}
    </div>
  );
}

interface CalendarViewProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

export function CalendarView({ selectedDate, onSelect }: CalendarViewProps) {
  const [days, setDays] = React.useState<Date[]>([]);

  React.useEffect(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    setDays(dates);
  }, []);

  const formatDay = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const formatDateNum = (date: Date) => date.getDate();

  const isSameDay = (a: Date | null, b: Date) => {
    if (!a) return false;
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((date) => (
        <button
          key={date.toISOString()}
          onClick={() => onSelect(date)}
          className={cn(
            'flex flex-col items-center p-3 rounded-lg border transition-all',
            isSameDay(selectedDate, date)
              ? 'border-gameedge-primary bg-gameedge-primary/20 text-gameedge-primary'
              : 'border-white/10 bg-white/5 text-foreground hover:bg-white/10'
          )}
        >
          <span className="text-xs text-muted-foreground">{formatDay(date)}</span>
          <span className="text-lg font-semibold mt-1">{formatDateNum(date)}</span>
          <span className="text-xs text-muted-foreground">
            {date.getMonth() + 1}/{date.getDate()}
          </span>
        </button>
      ))}
    </div>
  );
}

interface BookingConfirmationProps {
  deviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  pricingTier: string;
  bookingId?: string;
  isSubmitting?: boolean;
  onConfirm?: () => void;
}

export function BookingConfirmation({
  deviceName,
  date,
  startTime,
  endTime,
  price,
  pricingTier,
  bookingId,
  isSubmitting,
  onConfirm,
}: BookingConfirmationProps) {
  if (bookingId) {
    return (
      <Card className="text-center">
        <CardContent className="pt-8 pb-8">
          <div className="w-16 h-16 rounded-full bg-gameedge-success/20 flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-gameedge-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
          <p className="text-muted-foreground mb-4">Your booking has been confirmed.</p>
          <div className="bg-white/5 rounded-lg p-4 inline-block">
            <p className="text-xs text-muted-foreground">Booking ID</p>
            <p className="font-mono text-lg text-gameedge-primary">{bookingId}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Review & Confirm</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Device</span>
            <span className="text-foreground font-medium">{deviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="text-foreground">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time</span>
            <span className="text-foreground">{startTime} - {endTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rate</span>
            <span className="text-foreground capitalize">{pricingTier}</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between">
            <span className="text-foreground font-medium">Total</span>
            <span className="text-gameedge-primary font-bold text-lg">${price.toFixed(2)}</span>
          </div>
        </div>
        <Button className="w-full mt-6" size="lg" onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Confirm Booking'}
        </Button>
      </CardContent>
    </Card>
  );
}
