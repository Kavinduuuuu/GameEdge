// ============================================================================
// GameEdge Shared Types
// All domain types used across the platform. Other workers depend on these.
// ============================================================================

export type DeviceType = 'pc' | 'ps5' | 'pool_table';
export type DeviceStatus = 'available' | 'occupied' | 'maintenance' | 'offline';
export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'no_show';
export type UserRole = 'customer' | 'staff' | 'admin';
export type PricingTier = 'standard' | 'peak' | 'weekend';
export type POSCategory = 'snack' | 'drink' | 'merchandise' | 'hour_package';
export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'wallet';
export type OrderStatus = 'pending' | 'paid' | 'ready' | 'delivered' | 'cancelled';
export type TransactionType = 'booking' | 'pos' | 'refund';
export type TransactionMethod = 'cash' | 'card' | 'mobile' | 'wallet';
export type TransactionStatus = 'success' | 'pending' | 'failed' | 'refunded';

export interface TimeSlot {
  id: string;
  deviceId: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  isAvailable: boolean;
  pricingTier: PricingTier;
}

export interface Booking {
  id: string;
  userId: string;
  deviceId: string;
  timeSlotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
}

export interface Game {
  id: string;
  name: string;
  platform: ('pc' | 'ps5')[];
  genre: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  userId: string;
  gameId: string;
  rating: number;     // 1-5
  comment: string;
  createdAt: string;
  isApproved: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
}

export interface Device {
  id: string;
  type: DeviceType;
  status: DeviceStatus;
  name: string;
  specs?: Record<string, string>;
  createdAt: string;
}

export interface CafeStatus {
  id: string;
  isOpen: boolean;
  currentOccupancy: number;
  maxCapacity: number;
  lastUpdated: string;
}

export interface POSItem {
  id: string;
  name: string;
  category: POSCategory;
  price: number;
  stock: number;
}

export interface POSCartItem {
  itemId: string;
  quantity: number;
  price: number;      // snapshot price at time of order
}

export interface Order {
  id: string;
  userId: string;
  items: POSCartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  orderId: string | null;
  bookingId: string | null;
  amount: number;
  type: TransactionType;
  method: TransactionMethod;
  status: TransactionStatus;
  createdAt: string;
}
