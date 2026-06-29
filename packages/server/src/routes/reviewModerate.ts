// ============================================================================
// Review Moderation Routes (admin)
// PATCH  /api/v1/reviews/:id — Approve/reject
// DELETE /api/v1/reviews/:id — Delete
// ============================================================================

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ModerateReviewSchema } from '@gameedge/shared';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

const router = Router();

// PATCH /api/v1/reviews/:id (admin only)
router.patch('/:id', authMiddleware, requireRole('admin'), validate(ModerateReviewSchema), async (req: Request, res: Response) => {
  const review = await db.reviews.get(req.params.id);
  if (!review) {
    throw new NotFoundError('Review not found');
  }

  const { isApproved } = req.body as { isApproved: boolean };
  await db.reviews.update(review.id, { isApproved });

  logger.audit('Review moderated', {
    reviewId: review.id,
    isApproved,
    moderatedBy: req.user!.id,
  });

  const updated = await db.reviews.get(review.id);
  res.json(updated);
});

// DELETE /api/v1/reviews/:id (admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  const review = await db.reviews.get(req.params.id);
  if (!review) {
    throw new NotFoundError('Review not found');
  }

  await db.reviews.delete(review.id);
  logger.audit('Review deleted', { reviewId: review.id, deletedBy: req.user!.id });

  res.status(204).end();
});

export default router;
