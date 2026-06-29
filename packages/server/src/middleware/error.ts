// ============================================================================
// Error Handling Middleware
// ============================================================================

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(422).json({
      error: 'Validation failed',
      details: err.flatten(),
    });
    return;
  }

  // Known application errors
  if (err instanceof AppError) {
    const body: Record<string, unknown> = { error: err.message };
    if (err instanceof ValidationError && err.details) {
      body.details = err.details;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  // Unknown / unexpected errors
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  res.status(500).json({
    error: 'Internal server error',
  });
}

// Handle 404
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Route not found' });
}
