'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, LogOut, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookingHistory, Stats } from '@/components/dashboard/BookingHistory';
import { useAuth } from '@/providers/AuthProvider';
import type { Booking } from '@/types';

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-A1B2C3D4',
    userId: 'demo-user',
    deviceId: 'pc-01',
    deviceName: 'PC Station 1',
    deviceType: 'pc',
    date: '2024-02-15',
    startTime: '14:00',
    endTime: '16:00',
    status: 'confirmed',
    totalPrice: 16,
    pricingTier: 'standard',
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: 'BK-E5F6G7H8',
    userId: 'demo-user',
    deviceId: 'ps5-02',
    deviceName: 'PS5 Station 2',
    deviceType: 'ps5',
    date: '2024-02-08',
    startTime: '19:00',
    endTime: '21:00',
    status: 'completed',
    totalPrice: 24,
    pricingTier: 'peak',
    createdAt: '2024-02-05T14:30:00Z',
  },
  {
    id: 'BK-I9J0K1L2',
    userId: 'demo-user',
    deviceId: 'pool-01',
    deviceName: 'Pool Table 1',
    deviceType: 'pool_table',
    date: '2024-02-01',
    startTime: '15:00',
    endTime: '17:00',
    status: 'completed',
    totalPrice: 24,
    pricingTier: 'standard',
    createdAt: '2024-01-28T09:15:00Z',
  },
];

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();

  // Redirect if not authenticated (in a real app, use middleware)
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-8 pb-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Sign in Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your dashboard.
            </p>
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name || 'Gamer'}</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <Stats
          totalBookings={MOCK_BOOKINGS.length}
          totalHours={MOCK_BOOKINGS.reduce((acc, b) => {
            const [startH] = b.startTime.split(':').map(Number);
            const [endH] = b.endTime.split(':').map(Number);
            return acc + (endH - startH);
          }, 0)}
          favoriteGame="Valorant"
        />
      </div>

      {/* Active Booking */}
      {MOCK_BOOKINGS.find((b) => b.status === 'confirmed') && (
        <Card className="mb-8 border-gameedge-primary/30 bg-gameedge-primary/5">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="success" className="mb-2">Active Booking</Badge>
                <h3 className="text-lg font-semibold text-foreground">
                  {MOCK_BOOKINGS.find((b) => b.status === 'confirmed')?.deviceName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {MOCK_BOOKINGS.find((b) => b.status === 'confirmed')?.date} at{' '}
                  {MOCK_BOOKINGS.find((b) => b.status === 'confirmed')?.startTime}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gameedge-primary">
                  <CountdownTimer targetDate="2024-02-15T14:00:00" />
                </p>
                <p className="text-xs text-muted-foreground">remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking History */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Booking History</h2>
          <Link href="/booking">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </Link>
        </div>
        <BookingHistory
          bookings={MOCK_BOOKINGS}
          onCancel={(id) => console.log('Cancel:', id)}
          onRebook={(booking) => console.log('Rebook:', booking.id)}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/booking">
          <Card className="hover:border-gameedge-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6 pb-6 text-center">
              <Calendar className="h-8 w-8 text-gameedge-primary mx-auto mb-2" />
              <p className="font-medium text-foreground">Book Again</p>
              <p className="text-xs text-muted-foreground">Quick rebook your favorite station</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/games">
          <Card className="hover:border-gameedge-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6 pb-6 text-center">
              <Clock className="h-8 w-8 text-gameedge-secondary mx-auto mb-2" />
              <p className="font-medium text-foreground">Browse Games</p>
              <p className="text-xs text-muted-foreground">Discover new titles to play</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard">
          <Card className="hover:border-gameedge-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6 pb-6 text-center">
              <User className="h-8 w-8 text-gameedge-success mx-auto mb-2" />
              <p className="font-medium text-foreground">My Reviews</p>
              <p className="text-xs text-muted-foreground">View your game reviews</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = React.useState('00:00:00');

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span>{timeLeft}</span>;
}
