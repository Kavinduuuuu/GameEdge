// ============================================================================
// GameEdge Constants
// ============================================================================

export const DEVICE_TYPES = ['pc', 'ps5', 'pool_table'] as const;
export const DEVICE_STATUSES = ['available', 'occupied', 'maintenance', 'offline'] as const;
export const BOOKING_STATUSES = ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'no_show'] as const;
export const USER_ROLES = ['customer', 'staff', 'admin'] as const;
export const PRICING_TIERS = ['standard', 'peak', 'weekend'] as const;
export const POS_CATEGORIES = ['snack', 'drink', 'merchandise', 'hour_package'] as const;
export const PAYMENT_METHODS = ['cash', 'card', 'mobile', 'wallet'] as const;

// Pricing per hour by device type and tier
export const DEVICE_PRICING: Record<string, Record<string, number>> = {
  pc: { standard: 5, peak: 8, weekend: 7 },
  ps5: { standard: 6, peak: 10, weekend: 8 },
  pool_table: { standard: 4, peak: 6, weekend: 5 },
};

// Peak hours: 6pm - 10pm (18:00 - 22:00)
export const PEAK_START_HOUR = 18;
export const PEAK_END_HOUR = 22;

// Cafe operating hours
export const CAFE_OPEN_HOUR = 10;
export const CAFE_CLOSE_HOUR = 24;
export const SLOT_DURATION_HOURS = 1;

export const MAX_CAFE_CAPACITY = 80;
export const MAX_REVIEW_RATING = 5;
export const MIN_REVIEW_RATING = 1;
