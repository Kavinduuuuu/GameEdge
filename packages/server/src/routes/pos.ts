// ============================================================================
// POS Routes
// GET   /api/v1/pos/items        — List POS items
// POST  /api/v1/pos/items        — Create item (admin)
// PATCH /api/v1/pos/items/:id    — Update item (admin)
// POST  /api/v1/pos/orders       — Create order
// POST  /api/v1/pos/checkout     — Process payment + update order to paid
// GET   /api/v1/pos/orders       — List orders (admin: filter by date/status)
// GET   /api/v1/pos/orders/:id   — Order detail
// ============================================================================

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CreatePOSSchema, UpdatePOSSchema, CreateOrderSchema, type POSCategory, type PaymentMethod, type TransactionMethod } from '@gameedge/shared';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/v1/pos/items
router.get('/items', async (_req: Request, res: Response) => {
  const items = await db.posItems.getAll();
  res.json(items);
});

// POST /api/v1/pos/items (admin)
router.post('/items', authMiddleware, requireRole('admin'), validate(CreatePOSSchema), async (req: Request, res: Response) => {
  const data = req.body;

  const item = {
    id: crypto.randomUUID(),
    name: data.name,
    category: data.category as POSCategory,
    price: data.price,
    stock: data.stock ?? 0,
  };

  await db.posItems.add(item);
  logger.audit('POS item created', { itemId: item.id, createdBy: req.user!.id });

  res.status(201).json(item);
});

// PATCH /api/v1/pos/items/:id (admin)
router.patch('/items/:id', authMiddleware, requireRole('admin'), validate(UpdatePOSSchema), async (req: Request, res: Response) => {
  const item = await db.posItems.get(req.params.id);
  if (!item) {
    throw new NotFoundError('POS item not found');
  }

  await db.posItems.update(item.id, req.body);

  logger.audit('POS item updated', { itemId: item.id, updates: req.body, updatedBy: req.user!.id });

  const updated = await db.posItems.get(item.id);
  res.json(updated);
});

// POST /api/v1/pos/orders
router.post('/orders', authMiddleware, validate(CreateOrderSchema), async (req: Request, res: Response) => {
  const data = req.body;
  const userId = req.user!.id;

  // Validate items exist and calculate total
  let total = 0;
  const orderItems: { itemId: string; quantity: number; price: number }[] = [];

  for (const item of data.items) {
    const posItem = await db.posItems.get(item.itemId);
    if (!posItem) {
      throw new NotFoundError(`POS item ${item.itemId} not found`);
    }
    if (posItem.stock < item.quantity) {
      throw new ValidationError(`Insufficient stock for "${posItem.name}". Available: ${posItem.stock}`);
    }

    const price = posItem.price;
    total += price * item.quantity;
    orderItems.push({ itemId: item.itemId, quantity: item.quantity, price });
  }

  const order = {
    id: crypto.randomUUID(),
    userId,
    items: orderItems,
    total: Math.round(total * 100) / 100,
    paymentMethod: data.paymentMethod as PaymentMethod,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  };

  // Deduct stock
  for (const item of data.items) {
    const posItem = await db.posItems.get(item.itemId);
    if (posItem) {
      await db.posItems.update(item.itemId, { stock: posItem.stock - item.quantity });
    }
  }

  await db.orders.add(order);

  // Create transaction
  await db.transactions.add({
    id: crypto.randomUUID(),
    orderId: order.id,
    bookingId: null,
    amount: order.total,
    type: 'pos' as const,
    method: data.paymentMethod as TransactionMethod,
    status: 'pending' as const,
    createdAt: order.createdAt,
  });

  logger.audit('Order created', { orderId: order.id, userId, total: order.total });

  res.status(201).json(order);
});

// POST /api/v1/pos/checkout — Process payment for pending order
router.post('/checkout', authMiddleware, async (req: Request, res: Response) => {
  const { orderId } = req.body as { orderId?: string };
  if (!orderId) {
    throw new ValidationError('orderId required');
  }

  const order = await db.orders.get(orderId);
  if (!order) {
    throw new NotFoundError('Order not found');
  }
  if (req.user!.role === 'customer' && order.userId !== req.user!.id) {
    throw new ForbiddenError();
  }
  if (order.status !== 'pending') {
    throw new ValidationError('Order is not in pending status');
  }

  await db.orders.update(order.id, { status: 'paid' });

  // Update transaction
  const allTransactions = await db.transactions.getAll();
  const tx = allTransactions.find(t => t.orderId === order.id);
  if (tx) {
    await db.transactions.update(tx.id, { status: 'success' });
  }

  logger.audit('Order paid', { orderId: order.id, userId: req.user!.id });

  const updated = await db.orders.get(order.id);
  res.json(updated);
});

// GET /api/v1/pos/orders
router.get('/orders', authMiddleware, async (req: Request, res: Response) => {
  let orders = await db.orders.getAll();

  // Customers can only see their own orders
  if (req.user!.role === 'customer') {
    orders = orders.filter(o => o.userId === req.user!.id);
  }

  res.json(orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

// GET /api/v1/pos/orders/:id
router.get('/orders/:id', authMiddleware, async (req: Request, res: Response) => {
  const order = await db.orders.get(req.params.id);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (req.user!.role === 'customer' && order.userId !== req.user!.id) {
    throw new ForbiddenError();
  }

  res.json(order);
});

export default router;
