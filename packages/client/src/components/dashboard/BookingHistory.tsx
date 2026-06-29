'use client';

import React from 'react';
import { Clock, History, Star, Monitor, Gamepad2, CircleDot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Booking } from '@/types';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface BookingHistoryProps {
  bookings: Booking[];
  onCancel?: (id: string) => void;
  onRebook?: (booking: Booking) => void;
}

export function BookingHistory({ bookings, onCancel, onRebook }: BookingHistoryProps) {
  const deviceIcons = {
    pc: Monitor,
    ps5: Gamepad2,
    pool_table: CircleDot,
  };

  const statusColors = {
    pending: 'warning',
    confirmed: 'default',
    active: 'success',
    completed: 'secondary',
    cancelled: 'danger',
  } as const;

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-8 pb-8 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No bookings yet.</p>
          <Button className="mt-4" asChild>
            <a href="/booking">Book Your First Session</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const Icon = deviceIcons[booking.deviceType];
        const isActive = booking.status === 'active' || booking.status === 'confirmed';

        return (
          <Card key={booking.id} className={cn(isActive && 'border-gameedge-primary/30')}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gameedge-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{booking.deviceName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(booking.date)} &middot; {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={statusColors[booking.status]}>
                    {booking.status}
                  </Badge>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {formatCurrency(booking.totalPrice)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <p className="text-xs text-muted-foreground font-mono">{booking.id}</p>
                <div className="flex space-x-2">
                  {isActive && onCancel && (
                    <Button variant="ghost" size="sm" onClick={() => onCancel(booking.id)}>
                      Cancel
                    </Button>
                  )}
                  {booking.status === 'completed' && onRebook && (
                    <Button variant="outline" size="sm" onClick={() => onRebook(booking)}>
                      Re-book
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface StatsProps {
  totalBookings: number;
  totalHours: number;
  favoriteGame?: string;
}

export function Stats({ totalBookings, totalHours, favoriteGame }: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gameedge-primary">{totalBookings}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Bookings</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gameedge-secondary">{totalHours}</p>
            <p className="text-sm text-muted-foreground mt-1">Hours Played</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gameedge-success">{favoriteGame || 'N/A'}</p>
            <p className="text-sm text-muted-foreground mt-1">Favorite Game</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
