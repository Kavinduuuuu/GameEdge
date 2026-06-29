// ============================================================================
// Express App Setup
// ============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/index';
import { errorHandler, notFoundHandler } from './middleware/error';
import authRoutes from './routes/auth';
import cafeRoutes from './routes/cafe';
import deviceRoutes from './routes/devices';
import slotRoutes from './routes/slots';
import slotUpdateRoutes from './routes/slotUpdate';
import bookingRoutes from './routes/bookings';
import gameRoutes from './routes/games';
import reviewRoutes from './routes/reviews';
import reviewModerateRoutes from './routes/reviewModerate';
import posRoutes from './routes/pos';
import analyticsRoutes from './routes/analytics';
import { initWebSocket } from './ws/server';

export function createApp() {
  const app = express();

  // --- Security ---
  app.use(helmet());

  // --- CORS ---
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (config.corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

  // --- Rate Limiting ---
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: config.generalRateLimit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: config.authRateLimit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many auth attempts, please try again later.' },
  });

  app.use('/api/', generalLimiter);
  app.use('/api/v1/auth/', authLimiter);

  // --- Body Parsing ---
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // --- Request Logging ---
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

  // --- Health Check ---
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'gameedge-server',
      version: '0.1.0',
    });
  });

  // --- API Routes v1 ---
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/cafe', cafeRoutes);
  app.use('/api/v1/devices', deviceRoutes);
  app.use('/api/v1/devices', slotRoutes);  // uses deviceId param
  app.use('/api/v1/slots', slotUpdateRoutes);
  app.use('/api/v1/bookings', bookingRoutes);
  app.use('/api/v1/games', gameRoutes);
  app.use('/api/v1/games', reviewRoutes);   // uses gameId param
  app.use('/api/v1/reviews', reviewModerateRoutes);
  app.use('/api/v1/pos', posRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);

  // --- Error Handling ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}


