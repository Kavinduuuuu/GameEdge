// ============================================================================
// Cafe Status Routes
// GET /api/v1/cafe/status — Get current cafe status
// PATCH /api/v1/cafe/status — Update cafe status (admin)
// ============================================================================

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UpdateCafeStatusSchema } from '@gameedge/shared';
import { broadcastCafeStatus } from '../ws/server';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/v1/cafe/status
router.get('/status', async (_req: Request, res: Response) => {
  const status = await db.cafeStatus.get('cafe');
  if (!status) {
    res.json({ isOpen: false, currentOccupancy: 0, maxCapacity: 80, lastUpdated: new Date().toISOString() });
    return;
  }
  res.json(status);
});

// PATCH /api/v1/cafe/status (admin only)
router.patch('/status', authMiddleware, requireRole('admin'), validate(UpdateCafeStatusSchema), async (req: Request, res: Response) => {
  const existing = await db.cafeStatus.get('cafe');
  const updates = req.body as Record<string, unknown>;
  if (existing) {
    await db.cafeStatus.update('cafe', {
      isOpen: (updates.isOpen as boolean) ?? existing.isOpen,
      maxCapacity: (updates.maxCapacity as number) ?? existing.maxCapacity,
      lastUpdated: new Date().toISOString(),
    });
  } else {
    await db.cafeStatus.add({
      id: 'cafe',
      isOpen: (updates.isOpen as boolean) ?? false,
      currentOccupancy: 0,
      maxCapacity: (updates.maxCapacity as number) ?? 80,
      lastUpdated: new Date().toISOString(),
    });
  }

  const updatedStatus = await db.cafeStatus.get('cafe');
  if (!updatedStatus) {
    throw new Error('Failed to retrieve cafe status after update');
  }

  logger.audit('Cafe status updated', { updatedBy: req.user!.id, status: updatedStatus });

  // Broadcast to WebSocket clients
  broadcastCafeStatus(updatedStatus);

  res.json(updatedStatus);
});

export default router;