// ============================================================================
// Time Slot Routes
// GET   /api/v1/devices/:deviceId/slots — Available slots for date range
// POST  /api/v1/devices/:deviceId/slots — Create/configure slots (admin)
// PATCH /api/v1/slots/:id               — Update slot (admin)
// ============================================================================

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CreateSlotSchema, UpdateSlotSchema, SlotQuerySchema, type PricingTier } from '@gameedge/shared';
import { NotFoundError, ConflictError } from '../utils/errors';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/v1/devices/:deviceId/slots
router.get('/:deviceId/slots', validate(SlotQuerySchema, 'query'), async (req: Request, res: Response) => {
  const { deviceId } = req.params;
  const { startDate, endDate } = req.body as { startDate: string; endDate: string };

  const device = await db.devices.get(deviceId);
  if (!device) {
    throw new NotFoundError('Device not found');
  }

  const slots = await db.timeSlots.filter(s => s.deviceId === deviceId && s.date >= startDate && s.date <= endDate);

  res.json(slots.sort((a, b) => a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)));
});

// POST /api/v1/devices/:deviceId/slots (admin only)
router.post('/:deviceId/slots', authMiddleware, requireRole('admin'), validate(CreateSlotSchema), async (req: Request, res: Response) => {
  const { deviceId } = req.params;
  const data = req.body as { deviceId: string; date: string; startTime: string; endTime: string; isAvailable: boolean; pricingTier: string };

  const device = await db.devices.get(deviceId);
  if (!device) {
    throw new NotFoundError('Device not found');
  }

  const slotId = `${deviceId}_${data.date}_${data.startTime.replace(':', '')}`;

  const existing = await db.timeSlots.get(slotId);
  if (existing) {
    throw new ConflictError('Time slot already exists');
  }

  const slot = {
    id: slotId,
    deviceId: data.deviceId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    isAvailable: data.isAvailable ?? true,
    pricingTier: (data.pricingTier ?? 'standard') as PricingTier,
  };

  await db.timeSlots.add(slot);
  logger.audit('Time slot created', { slotId, createdBy: req.user!.id });

  res.status(201).json(slot);
});

export default router;
