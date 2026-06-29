// ============================================================================
// Auth Routes
// POST /api/v1/auth/register — Register customer
// POST /api/v1/auth/login    — Login (returns JWT)
// GET  /api/v1/auth/me       — Current user profile
// ============================================================================

import { Router, type Request, type Response } from 'express';
import { validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth';
import { RegisterSchema, LoginSchema } from '@gameedge/shared';
import { registerUser, loginUser, getUserProfile } from '../services/auth';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validate(RegisterSchema), async (req: Request, res: Response) => {
  const data = req.body;
  const result = await registerUser(data);
  res.status(201).json(result);
});

// POST /api/v1/auth/login
router.post('/login', validate(LoginSchema), async (req: Request, res: Response) => {
  const data = req.body;
  const result = await loginUser(data);
  res.json(result);
});

// GET /api/v1/auth/me
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  const profile = await getUserProfile(req.user!.id);
  res.json(profile);
});

export default router;
