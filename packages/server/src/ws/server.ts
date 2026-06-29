// ============================================================================
// WebSocket Server — Real-time updates
// Events: cafe:status, device:status, booking:update
// ============================================================================

import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { config } from '../config/index';
import { logger } from '../utils/logger';

interface WSClient {
  ws: WebSocket;
  ip: string;
  messageCount: number;
  lastMessageTime: number;
}

let wss: WebSocketServer | null = null;
const clients = new Set<WSClient>();
const ORIGIN_WHITELIST = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

export function initWebSocket(server: Server): void {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    // Origin validation
    const origin = req.headers.origin;
    if (origin && !ORIGIN_WHITELIST.some(o => origin.startsWith(o))) {
      logger.warn('WebSocket connection rejected — bad origin', { origin });
      ws.close(4001, 'Origin not allowed');
      return;
    }

    const client: WSClient = {
      ws,
      ip: req.socket.remoteAddress || 'unknown',
      messageCount: 0,
      lastMessageTime: Date.now(),
    };
    clients.add(client);

    logger.info('WebSocket client connected', { ip: client.ip, totalClients: clients.size });

    ws.on('message', (data) => {
      // Rate limiting
      const now = Date.now();
      if (now - client.lastMessageTime > 60_000) {
        client.messageCount = 0;
        client.lastMessageTime = now;
      }
      client.messageCount++;

      if (client.messageCount > config.wsRateLimit) {
        logger.warn('WebSocket rate limit exceeded', { ip: client.ip });
        ws.send(JSON.stringify({ error: 'Rate limit exceeded' }));
        return;
      }

      // Handle subscription messages
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'subscribe') {
          ws.send(JSON.stringify({ type: 'subscribed', channel: msg.channel }));
        }
      } catch {
        // Ignore non-JSON messages
      }
    });

    ws.on('close', () => {
      clients.delete(client);
      logger.info('WebSocket client disconnected', { ip: client.ip, totalClients: clients.size });
    });

    ws.on('error', (err) => {
      logger.error('WebSocket error', { ip: client.ip, error: err.message });
      clients.delete(client);
    });

    // Send welcome message
    ws.send(JSON.stringify({ type: 'connected', message: 'Welcome to GameEdge real-time updates' }));
  });

  logger.info('WebSocket server initialized on path /ws');
}

// Broadcast to all connected clients
export function broadcast(event: string, data: unknown): void {
  if (!wss) return;
  const message = JSON.stringify({ type: event, data, timestamp: new Date().toISOString() });
  Array.from(clients).forEach(client => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

// Broadcast cafe status update
export function broadcastCafeStatus(data: { isOpen: boolean; currentOccupancy: number; maxCapacity: number; lastUpdated: string }): void {
  broadcast('cafe:status', data);
}

// Broadcast device status change
export function broadcastDeviceStatus(data: { deviceId: string; status: string; lastUpdated: string }): void {
  broadcast('device:status', data);
}

// Broadcast booking update
export function broadcastBookingUpdate(data: { action: string; booking: unknown }): void {
  broadcast('booking:update', data);
}
