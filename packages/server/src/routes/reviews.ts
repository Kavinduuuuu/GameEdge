// ============================================================================
// Reviews Routes
// POST   /api/v1/games/:gameId/reviews — Submit review
// GET    /api/v1/games/:gameId/reviews — List reviews for game
// PATCH  /api/v1/reviews/:id            — Moderate review (admin)
// DELETE /api/v1/reviews/:id            — Delete review
// ============================================================================

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CreateReviewSchema, ModerateReviewSchema } from '@gameedge/shared';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { logger } from '../utils/logger';

const router = Router();

// POST /api/v1/games/:gameId/reviews
router.post('/:gameId/reviews', authMiddleware, validate(CreateReviewSchema), async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const data = req.body as { rating: number; comment: string };

  const game = await db.games.get(gameId);
  if (!game) {
    throw new NotFoundError('Game not found');
  }

  const review = {
    id: crypto.randomUUID(),
    userId: req.user!.id,
    gameId,
    rating: data.rating,
    comment: data.comment,
    createdAt: new Date().toISOString(),
    isApproved: false, // reviews require moderation
  };

  await db.reviews.add(review);
  logger.audit('Review submitted', { reviewId: review.id, gameId, userId: req.user!.id, rating: data.rating });

  res.status(201).json(review);
});

// GET /api/v1/games/:gameId/reviews
router.get('/:gameId/reviews', async (req: Request, res: Response) => {
  const { gameId } = req.params;

  const game = await db.games.get(gameId);
  if (!game) {
    throw new NotFoundError('Game not found');
  }

  const reviews = await db.reviews.filter(r => r.gameId === gameId && r.isApproved);

  res.json(reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

export default router;
