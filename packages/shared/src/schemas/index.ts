// ============================================================================
// GameEdge Zod Schemas
// All input validation schemas for API endpoints.
// Uses z.infer<> to derive TypeScript types from schemas where beneficial.
// ============================================================================

import { z } from 'zod';

// --- Enums ---
export const DeviceTypeEnum = z.enum(['pc', 'ps5', 'pool_table']);
export const DeviceStatusEnum = z.enum(['available', 'occupied', 'maintenance', 'offline']);
export const BookingStatusEnum = z.enum(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'no_show']);
export const UserRoleEnum = z.enum(['customer', 'staff', 'admin']);
export const PricingTierEnum = z.enum(['standard', 'peak', 'weekend']);
export const POSCategoryEnum = z.enum(['snack', 'drink', 'merchandise', 'hour_package']);
export const PaymentMethodEnum = z.enum(['cash', 'card', 'mobile', 'wallet']);
export const OrderStatusEnum = z.enum(['pending', 'paid', 'ready', 'delivered', 'cancelled']);
export const TransactionTypeEnum = z.enum(['booking', 'pos', 'refund']);
export const TransactionMethodEnum = z.enum(['cash', 'card', 'mobile', 'wallet']);
export const TransactionStatusEnum = z.enum(['success', 'pending', 'failed', 'refunded']);

// --- Auth Schemas ---
export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  password: z.string().min(8).max(128),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// --- Device Schemas ---
export const CreateDeviceSchema = z.object({
  id: z.string().min(1).max(50),
  type: DeviceTypeEnum,
  name: z.string().min(1).max(100),
  specs: z.record(z.string()).optional(),
});

export const UpdateDeviceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  status: DeviceStatusEnum.optional(),
  specs: z.record(z.string()).optional(),
});

export const DeviceQuerySchema = z.object({
  type: DeviceTypeEnum.optional(),
  status: DeviceStatusEnum.optional(),
});

// --- TimeSlot Schemas ---
export const CreateSlotSchema = z.object({
  deviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isAvailable: z.boolean().default(true),
  pricingTier: PricingTierEnum.default('standard'),
});

export const UpdateSlotSchema = z.object({
  isAvailable: z.boolean().optional(),
  pricingTier: PricingTierEnum.optional(),
});

export const SlotQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// --- Booking Schemas ---
export const CreateBookingSchema = z.object({
  deviceId: z.string().min(1),
  timeSlotId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const UpdateBookingSchema = z.object({
  status: BookingStatusEnum.optional(),
});

export const BookingQuerySchema = z.object({
  userId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: BookingStatusEnum.optional(),
});

// --- Game Schemas ---
export const GameQuerySchema = z.object({
  search: z.string().optional(),
  platform: z.enum(['pc', 'ps5']).optional(),
  genre: z.string().optional(),
});

// --- Review Schemas ---
export const CreateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000),
});

export const ModerateReviewSchema = z.object({
  isApproved: z.boolean(),
});

// --- POS Schemas ---
export const CreatePOSSchema = z.object({
  name: z.string().min(1).max(100),
  category: POSCategoryEnum,
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative().default(0),
});

export const UpdatePOSSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  category: POSCategoryEnum.optional(),
  price: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
});

export const POSCartItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const CreateOrderSchema = z.object({
  items: z.array(POSCartItemSchema).min(1),
  paymentMethod: PaymentMethodEnum,
});

export const OrderQuerySchema = z.object({
  status: OrderStatusEnum.optional(),
  date: z.string().optional(),
});

// --- Cafe Status Schema ---
export const UpdateCafeStatusSchema = z.object({
  isOpen: z.boolean().optional(),
  maxCapacity: z.number().int().positive().optional(),
});

// --- Analytics Query Schemas ---
export const AnalyticsRevenueQuerySchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

// --- Derived types for use when schema preferred over manual interface ---
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateDeviceInput = z.infer<typeof CreateDeviceSchema>;
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
