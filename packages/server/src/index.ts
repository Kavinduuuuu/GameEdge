// ============================================================================
// GameEdge Server — Entry Point
// Creates HTTP server, initializes WebSocket, seeds DB if empty, and listens.
// ============================================================================

import { createServer } from 'http';
import { config } from './config/index';
import { createApp } from './app';
import { initWebSocket } from './ws/server';
import { db } from './db/database';
import { seedDatabase } from './db/seed';
import { logger } from './utils/logger';

async function start() {
  const app = createApp();
  const server = createServer(app);

  // Initialize WebSocket on the HTTP server
  initWebSocket(server);

  // Seed database if empty
  try {
    const userCount = await db.users.count();
    if (userCount === 0) {
      logger.info('Database empty — running seed script...');
      await seedDatabase();
      logger.info('Seed complete');
    } else {
      logger.info(`Database has ${userCount} users — skipping seed`);
    }
  } catch (err: any) {
    logger.warn('Seed check failed (non-fatal)', { error: err.message });
  }

  // Start listening
  server.listen(config.port, () => {
    logger.info(`GameEdge server running on port ${config.port}`, {
      port: config.port,
      env: process.env.NODE_ENV || 'development',
      healthCheck: `http://localhost:${config.port}/api/health`,
      websocket: `ws://localhost:${config.port}/ws`,
    });
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`Received ${signal} — shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    // Force exit after 10s
    setTimeout(() => {
      logger.warn('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  logger.error('Fatal startup error', { error: err.message, stack: err.stack });
  process.exit(1);
});
