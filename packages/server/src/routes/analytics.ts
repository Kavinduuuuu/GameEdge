// ============================================================================
// Analytics Routes
// GET /api/v1/analytics/revenue   — Revenue data (daily/weekly/monthly)
// GET /api/v1/analytics/bookings  — Booking analytics
// GET /api/v1/analytics/devices   — Device utilization
// GET /api/v1/analytics/peak-hours — Peak hours heatmap data
// ============================================================================

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AnalyticsRevenueQuerySchema } from '@gameedge/shared';
import _ from 'lodash';

// Simple groupBy since we may not have lodash as dependency
function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

const router = Router();

// GET /api/v1/analytics/revenue
router.get('/revenue', authMiddleware, requireRole('admin', 'staff'), validate(AnalyticsRevenueQuerySchema, 'query'), async (req: Request, res: Response) => {
  const { period } = req.body as { period: 'daily' | 'weekly' | 'monthly' };

  const transactions = await db.transactions
    .filter(t => t.status === 'success')
    .getAll();

  // Group by period
  const grouped = groupBy(transactions, (t) => {
    const date = t.createdAt.slice(0, 10); // YYYY-MM-DD
    if (period === 'weekly') {
      const d = new Date(t.createdAt);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      return weekStart.toISOString().slice(0, 10);
    }
    if (period === 'monthly') {
      return date.slice(0, 7); // YYYY-MM
    }
    return date;
  });

  const revenue = Object.entries(grouped).map(([periodKey, txs]) => ({
    period: periodKey,
    revenue: Math.round(txs.reduce((sum, t) => sum + t.amount, 0) * 100) / 100,
    transactions: txs.length,
    breakdown: {
      booking: Math.round(txs.filter(t => t.type === 'booking').reduce((sum, t) => sum + t.amount, 0) * 100) / 100,
      pos: Math.round(txs.filter(t => t.type === 'pos').reduce((sum, t) => sum + t.amount, 0) * 100) / 100,
    },
  })).sort((a, b) => a.period.localeCompare(b.period));

  res.json({ period, data: revenue });
});

// GET /api/v1/analytics/bookings
router.get('/bookings', authMiddleware, requireRole('admin', 'staff'), async (_req: Request, res: Response) => {
  const bookings = await db.bookings.getAll();

  const byStatus = groupBy(bookings, b => b.status);
  const byDate = groupBy(bookings, b => b.date);

  const stats = {
    total: bookings.length,
    byStatus: Object.fromEntries(Object.entries(byStatus).map(([k, v]) => [k, v.length])),
    byDate: Object.fromEntries(Object.entries(byDate).map(([k, v]) => [k, v.length])),
    revenue: Math.round(bookings.filter(b => b.status === 'completed' || b.status === 'active' || b.status === 'confirmed').reduce((sum, b) => sum + b.totalPrice, 0) * 100) / 100,
    averageBookingValue: bookings.length > 0
      ? Math.round((bookings.reduce((sum, b) => sum + b.totalPrice, 0) / bookings.length) * 100) / 100
      : 0,
  };

  res.json(stats);
});

// GET /api/v1/analytics/devices
router.get('/devices', authMiddleware, requireRole('admin', 'staff'), async (_req: Request, res: Response) => {
  const devices = await db.devices.getAll();
  const bookings = await db.bookings
    .filter(b => b.status === 'confirmed' || b.status === 'active' || b.status === 'completed')
    .getAll();

  const today = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter(b => b.date === today);

  const utilization = devices.map(device => {
    const deviceBookings = todayBookings.filter(b => b.deviceId === device.id);
    const totalSlots = 14; // 10am to midnight = 14 hours
    const utilizedHours = deviceBookings.length; // Each booking is 1 hour
    const utilizationRate = Math.round((utilizedHours / totalSlots) * 100);

    return {
      deviceId: device.id,
      name: device.name,
      type: device.type,
      status: device.status,
      todayBookings: deviceBookings.length,
      utilizationRate: `${utilizationRate}%`,
      revenue: Math.round(deviceBookings.reduce((sum, b) => sum + b.totalPrice, 0) * 100) / 100,
    };
  });

  res.json({
    devices: utilization,
    summary: {
      totalDevices: devices.length,
      averageUtilization: `${Math.round(utilization.reduce((sum, d) => sum + parseInt(d.utilizationRate), 0) / devices.length)}%`,
      totalRevenue: Math.round(utilization.reduce((sum, d) => sum + d.revenue, 0) * 100) / 100,
    },
  });
});

// GET /api/v1/analytics/peak-hours
router.get('/peak-hours', authMiddleware, requireRole('admin', 'staff'), async (_req: Request, res: Response) => {
  const bookings = await db.bookings
    .filter(b => b.status === 'confirmed' || b.status === 'active' || b.status === 'completed')
    .getAll();

  // Create heatmap: day of week x hour
  const heatmap = new Map<string, Map<string, number>>();

  for (const booking of bookings) {
    const d = new Date(booking.date);
    const dayOfWeek = d.getDay(); // 0=Sun
    const hour = booking.startTime.slice(0, 2);

    if (!heatmap.has(String(dayOfWeek))) {
      heatmap.set(String(dayOfWeek), new Map());
    }
    const dayMap = heatmap.get(String(dayOfWeek))!;
    dayMap.set(hour, (dayMap.get(hour) || 0) + 1);
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 14 }, (_, i) => `${String(i + 10).padStart(2, '0')}`);

  const heatmapData = days.map((day, dayIndex) => ({
    day,
    hours: hours.map(hour => ({
      hour: `${hour}:00`,
      bookings: heatmap.get(String(dayIndex))?.get(hour) || 0,
    })),
  }));

  // Find peak hour
  let peakHour = '00';
  let peakCount = 0;
  for (const [, dayMap] of heatmap) {
    for (const [hour, count] of dayMap) {
      if (count > peakCount) {
        peakCount = count;
        peakHour = hour;
      }
    }
  }

  res.json({
    heatmap: heatmapData,
    peakHour: `${peakHour}:00`,
    peakCount,
    summary: {
      busiest: peakCount > 0 ? `${peakHour}:00 with ${peakCount} bookings` : 'No bookings yet',
    },
  });
});

export default router;
