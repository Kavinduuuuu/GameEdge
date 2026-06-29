// ============================================================================
// Configuration — Environment variables with sensible defaults
// NEVER hardcode secrets. Use .env for production.
// ============================================================================

import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://localhost:5174').split(','),
  wsRateLimit: parseInt(process.env.WS_RATE_LIMIT || '30', 10),      // messages per minute
  generalRateLimit: parseInt(process.env.GENERAL_RATE_LIMIT || '100', 10),  // requests per 15min
  authRateLimit: parseInt(process.env.AUTH_RATE_LIMIT || '5', 10),    // requests per 15min
  dbName: process.env.DB_NAME || 'gameedge_db',
};
