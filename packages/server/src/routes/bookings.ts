// ============================================================================
// Booking Routes
// POST   /api/v1/bookings       — Create booking (double-booking prevention)
// GET    /api/v1/bookings       — List bookings (filter by user, date, status)
// GET    /api/v1/bookings/:id   — Booking detail
// PATCH  /api/v1/bookings/:id   — Update booking status
// DELETE /api/v1/bookings/:id   — Cancel booking
// ============================================================================

import { Router, type Request, type Response } from 'express';
import { db, createBookingAtomic } from '../db/database';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CreateBookingSchema, UpdateBookingSchema, BookingQuerySchema, DEVICE_PRICING, type BookingStatus } from '@gameedge/shared';
import { NotFoundError, ForbiddenError, ConflictError, ValidationError } from '../utils/errors';
import { broadcastBookingUpdate } from '../ws/server';
import { logger } from '../utils/logger';

const router = Router();

// POST /api/v1/bookings
router.post('/', authMiddleware, validate(CreateBookingSchema), async (req: Request, res: Response) => {
  const data = req.body as { deviceId: string; timeSlotId: string; date: string; startTime: string; endTime: string };
  const userId = req.user!.id;

  // Get device to determine type-based pricing
  const device = await db.devices.get(data.deviceId);
  if (!device) {
    throw new NotFoundError('Device not found');
  }

  // Get slot for pricing tier
  const slot = await db.timeSlots.get(data.timeSlotId);
  if (!slot) {
    throw new NotFoundError('Time slot not found');
  }

  const pricePerHour = DEVICE_PRICING[device.type]?.[slot.pricingTier] ?? 5;
  const durationHours = 1; // Slot duration is 1 hour
  const totalPrice = pricePerHour * durationHours;

  try {
    const booking = await createBookingAtomic({
      userId,
      deviceId: data.deviceId,
      timeSlotId: data.timeSlotId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'confirmed',
      totalPrice,
    });

    // Update device status
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (data.date === today) {
      await db.devices.update(data.deviceId, { status: 'occupied' });
    }

    logger.audit('Booking created', { bookingId: booking.id, userId, deviceId: data.deviceId });

    // Broadcast booking update
    broadcastBookingUpdate({ action: 'created', booking });

    // Create transaction record
    await db.transactions.add({
      id: crypto.randomUUID(),
      orderId: null,
      bookingId: booking.id,
      amount: totalPrice,
      type: 'booking',
      method: 'cash', // default, can be updated
      status: 'success',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(booking);
  } catch (err) {
    if (err instanceof Error && (err.message.includes('already booked') || err.message.includes('no longer available'))) {
      throw new ConflictError(err.message);
    }
    throw err;
  }
});

// GET /api/v1/bookings
router.get('/', authMiddleware, validate(BookingQuerySchema, 'query'), async (req: Request, res: Response) => {
  const { userId, date, status } = req.body as { userId?: string; date?: string; status?: string };
  const currentUser = req.user!;

  let bookings = await db.bookings.getAll();

  // Customers can only see their own bookings
  if (currentUser.role === 'customer') {
    bookings = bookings.filter(b => b.userId === currentUser.id);
  } else if (userId) {
    bookings = bookings.filter(b => b.userId === userId);
  }

  if (date) {
    bookings = bookings.filter(b => b.date === date);
  }
  if (status) {
    bookings = bookings.filter(b => b.status === status);
  }

  res.json(bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

// GET /api/v1/bookings/:id
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const booking = await db.bookings.get(req.params.id);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Customers can only see their own bookings
  if (req.user!.role === 'customer' && booking.userId !== req.user!.id) {
    throw new ForbiddenError();
  }

  res.json(booking);
});

// PATCH /api/v1/bookings/:id
router.patch('/:id', authMiddleware, validate(UpdateBookingSchema), async (req: Request, res: Response) => {
  const booking = await db.bookings.get(req.params.id);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Customers can only update their own bookings, staff/admin can update any
  if (req.user!.role === 'customer' && booking.userId !== req.user!.id) {
    throw new ForbiddenError();
  }

  const updates = req.body as { status?: BookingStatus };
  const previousStatus = booking.status;
  await db.bookings.update(booking.id, updates);

  // Handle status transitions
  if (updates.status === 'cancelled' || updates.status === 'completed') {
    // Free up the slot
    await db.timeSlots.update(booking.timeSlotId, { isAvailable: true });
    
    // Check if device is now free
    const activeBookings = await db.bookings.filter(b =>
      b.deviceId === booking.deviceId &&
      b.date === booking.date &&
      (b.status === 'confirmed' || b.status === 'active') &&
      b.id !== booking.id
    );

    if (activeBookings.length === 0) {
      await db.devices.update(booking.deviceId, { status: 'available' });
    }
  }

  logger.audit('Booking updated', {
    bookingId: booking.id,
    from: previousStatus,
    to: updates.status,
    updatedBy: req.user!.id,
  });

  // Broadcast booking update
  const updated = await db.bookings.get(booking.id);
  broadcastBookingUpdate({ action: updated!.status === 'cancelled' ? 'cancelled' : 'updated', booking: updated });

  res.json(updated);
});

// DELETE /api/v1/bookings/:id (cancel)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const booking = await db.bookings.get(req.params.id);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // their own bookings
  if (req.user!.role === 'customer' && booking.userId !== req.user!.id) {
    throw new ForbiddenError();
  }

  await db.bookings.update(booking.id, { status: 'cancelled' });
  
  // Free up the slot
  await db.timeSlots.update(booking.timeSlotId, { isAvailable: true });

  // Check if device is now free
  const activeBookings = await db.bookings.filter(b =>
    b.deviceId === booking.deviceId &&
    b.date === booking.date &&
    (b.status === 'confirmed' || b.status === 'active') &&
    b.id !== booking.id
  );

  if (activeBookings.length === 0) {
    await db.devices.update(booking.deviceId, { status: 'available' });
  }

  logger.audit('Booking cancelled', { bookingId: booking.id, cancelledBy: req.user!.id });
  broadcastBookingUpdate({ action: 'cancelled', booking: { ...booking, status: 'cancelled' } });

  res.status(204).end();
});

export default router;
