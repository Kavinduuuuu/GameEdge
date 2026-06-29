// ============================================================================
// Games Routes
// GET /api/v1/games     — List games (search, filter by platform/genre)
// GET /api/v1/games/:id — Game detail with reviews summary
// ============================================================================

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database';
import { validate } from '../middleware/validate';
import { GameQuerySchema } from '@gameedge/shared';
import { NotFoundError } from '../utils/errors';

const router = Router();

// GET /api/v1/games
router.get('/', validate(GameQuerySchema, 'query'), async (req: Request, res: Response) => {
  const { search, platform, genre } = req.body as { search?: string; platform?: string; genre?: string };

  let games = await db.games.getAll();

  if (search) {
    const searchLower = search.toLowerCase();
    games = games.filter(g => g.name.toLowerCase().includes(searchLower) || g.description.toLowerCase().includes(searchLower));
  }

  if (platform) {
    games = games.filter(g => g.platform.includes(platform as 'pc' | 'ps5'));
  }

  if (genre) {
    games = games.filter(g => g.genre.toLowerCase() === genre.toLowerCase());
  }

  res.json(games.sort((a, b) => b.rating - a.rating));
});

// GET /api/v1/games/:id
router.get('/:id', async (req: Request, res: Response) => {
  const game = await db.games.get(req.params.id);
  if (!game) {
    throw new NotFoundError('Game not found');
  }

  // Get approved reviews
  const reviews = await db.reviews.filter(r => r.gameId === game.id && r.isApproved);

  const reviewSummary = {
    totalReviews: reviews.length,
    averageRating: reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0,
    ratingDistribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    },
  };

  res.json({ ...game, reviewSummary });
});

export default router;
