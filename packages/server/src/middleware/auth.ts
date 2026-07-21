// ============================================================================
// Authentication Middleware — JWT verification
// ============================================================================

import type { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/index';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { type UserRole } from '@gameedge/shared';

interface JwtPayload {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError();
    }
    next();
  };
}