// ============================================================================
// Device Routes
// GET    /api/v1/devices          — List all devices (filter by type, status)
// GET    /api/v1/devices/:id      — Device detail with current booking
// POST   /api/v1/devices          — Create device (admin)
// PATCH  /api/v1/devices/:id      — Update device status/details (admin)
// DELETE /api/v1/devices/:id      — Remove device (admin)
// ============================================================================

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CreateDeviceSchema, UpdateDeviceSchema, DeviceQuerySchema, type DeviceType, type DeviceStatus } from '@gameedge/shared';
import { NotFoundError, ConflictError } from '../utils/errors';
import { broadcastDeviceStatus } from '../ws/server';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/v1/devices
router.get('/', validate(DeviceQuerySchema, 'query'), async (req: Request, res: Response) => {
  const { type, status } = req.query as { type?: string; status?: string };

  let devices = await db.devices.getAll();

  if (type) {
    devices = devices.filter(d => d.type === type);
  }
  if (status) {
    devices = devices.filter(d => d.status === status);
  }

  res.json(devices);
});

// GET /api/v1/devices/:id
router.get('/:id', async (req: Request, res: Response) => {
  const device = await db.devices.get(req.params.id);
  if (!device) {
    throw new NotFoundError('Device not found');
  }

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const allBookings = await db.bookings.filter(b =>
    b.deviceId === device.id &&
    b.date === today &&
    b.startTime <= currentTime &&
    b.endTime > currentTime &&
    (b.status === 'confirmed' || b.status === 'active')
  );

  const currentBooking = allBookings.length > 0 ? allBookings[0] : null;
  res.json({ ...device, currentBooking });
});

// POST /api/v1/devices (admin only)
router.post('/', authMiddleware, requireRole('admin'), validate(CreateDeviceSchema), async (req: Request, res: Response) => {
  const data = req.body as { id: string; type: DeviceType; name: string; specs?: Record<string, string> };

  const existing = await db.devices.get(data.id);
  if (existing) {
    throw new ConflictError('Device with this ID already exists');
  }

  const device = {
    id: data.id,
    type: data.type as DeviceType,
    status: 'available' as const,
    name: data.name,
    specs: data.specs,
    createdAt: new Date().toISOString(),
  };

  await db.devices.add(device);
  logger.audit('Device created', { deviceId: data.id, createdBy: req.user!.id });

  res.status(201).json(device);
});

// PATCH /api/v1/devices/:id (admin only)
router.patch('/:id', authMiddleware, requireRole('admin'), validate(UpdateDeviceSchema), async (req: Request, res: Response) => {
  const device = await db.devices.get(req.params.id);
  if (!device) {
    throw new NotFoundError('Device not found');
  }

  const updates = req.body;
  await db.devices.update(device.id, updates);

  logger.audit('Device updated', { deviceId: device.id, updates, updatedBy: req.user!.id });

  if (updates.status) {
    broadcastDeviceStatus({ deviceId: device.id, status: updates.status, lastUpdated: new Date().toISOString() });
  }

  const updated = await db.devices.get(device.id);
  res.json(updated);
});

// DELETE /api/v1/devices/:id (admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  const device = await db.devices.get(req.params.id);
  if (!device) {
    throw new NotFoundError('Device not found');
  }

  await db.devices.delete(device.id);

  const slots = await db.timeSlots.filter(s => s.deviceId === device.id);
  for (const slot of slots) {
    await db.timeSlots.delete(slot.id);
  }
  const bookings = await db.bookings.filter(b => b.deviceId === device.id);
  for (const booking of bookings) {
    await db.bookings.delete(booking.id);
  }

  logger.audit('Device deleted', { deviceId: device.id, deletedBy: req.user!.id });
  res.status(204).end();
});

export default router;
