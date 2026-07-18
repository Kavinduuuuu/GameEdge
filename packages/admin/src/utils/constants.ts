export const API_BASE_URL = '/api/v1';

export const DEVICE_TYPES = [
  { value: 'pc', label: 'PC Station' },
  { value: 'ps5', label: 'PS5 Console' },
  { value: 'pool_table', label: 'Pool Table' },
] as const;

export const DEVICE_STATUSES = [
  { value: 'available', label: 'Available', color: 'green' },
  { value: 'occupied', label: 'Occupied', color: 'red' },
  { value: 'maintenance', label: 'Maintenance', color: 'amber' },
  { value: 'offline', label: 'Offline', color: 'gray' },
] as const;

export const BOOKING_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'amber' },
  { value: 'confirmed', label: 'Confirmed', color: 'blue' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'completed', label: 'Completed', color: 'gray' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
] as const;

export const POS_CATEGORIES = [
  { value: 'snack', label: 'Snack', color: 'amber' },
  { value: 'drink', label: 'Drink', color: 'blue' },
  { value: 'merchandise', label: 'Merchandise', color: 'purple' },
  { value: 'hour_package', label: 'Hour Package', color: 'green' },
] as const;

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'wallet', label: 'Wallet' },
] as const;

export const USER_ROLES = [
  { value: 'customer', label: 'Customer' },
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Admin' },
] as const;

export const TAX_RATE = 0.08;
