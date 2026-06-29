// ============================================================================
// Validation Middleware — Zod schema validation
// ============================================================================

import type { Request, Response, NextFunction } from 'express';
import { type ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      throw new ValidationError('Input validation failed', result.error.flatten());
    }
    // Replace with parsed/validated data
    (req as any)[source] = result.data;
    next();
  };
}
