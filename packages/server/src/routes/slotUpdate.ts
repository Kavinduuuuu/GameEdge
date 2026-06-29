// ============================================================================
// Slot Update Route (standalone since it's /api/v1/slots/:id)
// ============================================================================

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UpdateSlotSchema } from '@gameedge/shared';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

const router = Router();

// PATCH /api/v1/slots/:id (admin only)
router.patch('/:id', authMiddleware, requireRole('admin'), validate(UpdateSlotSchema), async (req: Request, res: Response) => {
  const slot = await db.timeSlots.get(req.params.id);
  if (!slot) {
    throw new NotFoundError('Time slot not found');
  }

  const updates = req.body as { isAvailable?: boolean; pricingTier?: string };
  await db.timeSlots.update(slot.id, updates);

  logger.audit('Slot updated', { slotId: slot.id, updates, updatedBy: req.user!.id });

  const updated = await db.timeSlots.get(slot.id);
  res.json(updated);
});

export default router;
