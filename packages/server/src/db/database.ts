// ============================================================================
// In-Memory Database Layer (Phase 1)
// Drop-in replacement for IndexedDB/Dexie. Same API surface.
// Swappable for PostgreSQL + Knex/Prisma in Phase 2.
// ============================================================================

import {
  type User, type Device, type TimeSlot, type Booking,
  type Game, type Review, type CafeStatus,
  type POSItem, type Order, type Transaction,
} from '@gameedge/shared';
import { logger } from '../utils/logger';

// ============================================================================
// Generic in-memory table with indexing
// ============================================================================
class MemTable<T extends { id: string }> {
  private data = new Map<string, T>();
  private indexes = new Map<string, Map<string, Set<string>>>();

  constructor(private name: string) {}

  async add(item: T): Promise<string> {
    this.data.set(item.id, item);
    this.updateIndexes(item.id, item);
    return item.id;
  }

  async get(id: string): Promise<T | undefined> {
    return this.data.get(id);
  }

  async getAll(): Promise<T[]> {
    return Array.from(this.data.values());
  }

  async update(id: string, changes: Partial<T>): Promise<number> {
    const item = this.data.get(id);
    if (!item) return 0;
    const updated = { ...item, ...changes };
    this.data.set(id, updated);
    this.updateIndexes(id, updated);
    return 1;
  }

  async delete(id: string): Promise<void> {
    this.data.delete(id);
  }

  async clear(): Promise<void> {
    this.data.clear();
    this.indexes.clear();
  }

  async count(): Promise<number> {
    return this.data.size;
  }

  async where(field: string): Promise<{ equals: (val: any) => { first: () => Promise<T | undefined>; toArray: () => Promise<T[]> } }> {
    return {
      equals: (val: any) => ({
        first: async (): Promise<T | undefined> => {
          const idx = this.indexes.get(field);
          if (idx) {
            const ids = idx.get(String(val));
            if (ids && ids.size > 0) {
              const firstId = Array.from(ids)[0];
              return this.data.get(firstId);
            }
          }
          // Fallback: linear scan
          const entries = Array.from(this.data.values());
          for (const item of entries) {
            if ((item as any)[field] === val) return item;
          }
          return undefined;
        },
        toArray: async (): Promise<T[]> => {
          const results: T[] = [];
          const idx = this.indexes.get(field);
          if (idx) {
            const ids = idx.get(String(val));
            if (ids) {
              const idArr = Array.from(ids);
              for (const id of idArr) {
                const item = this.data.get(id);
                if (item) results.push(item);
              }
            }
          } else {
            // Fallback: linear scan
            const entries = Array.from(this.data.values());
            for (const item of entries) {
              if ((item as any)[field] === val) results.push(item);
            }
          }
          return results;
        },
      }),
    };
  }

  async filter(predicate: (item: T) => boolean): Promise<T[]> {
    return Array.from(this.data.values()).filter(predicate);
  }

  private updateIndexes(id: string, item: T): void {
    const entries = Object.entries(item);
    for (let i = 0; i < entries.length; i++) {
      const key = entries[i][0];
      const val = entries[i][1];
      if (key === 'id') continue;
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        if (!this.indexes.has(key)) this.indexes.set(key, new Map());
        const idx = this.indexes.get(key)!;
        const strVal = String(val);
        if (!idx.has(strVal)) idx.set(strVal, new Set());
        idx.get(strVal)!.add(id);
      }
    }
  }
}

// ============================================================================
// Database class
// ============================================================================
class GameEdgeDB {
  users = new MemTable<User>('users');
  devices = new MemTable<Device>('devices');
  timeSlots = new MemTable<TimeSlot>('timeSlots');
  bookings = new MemTable<Booking>('bookings');
  games = new MemTable<Game>('games');
  reviews = new MemTable<Review>('reviews');
  cafeStatus = new MemTable<CafeStatus>('cafeStatus');
  posItems = new MemTable<POSItem>('posItems');
  orders = new MemTable<Order>('orders');
  transactions = new MemTable<Transaction>('transactions');
}

export const db = new GameEdgeDB();

// ============================================================================
// Atomic booking — PREVENTS double-booking
// Uses in-memory lock + verification
// ============================================================================
let bookingLock = false;

export async function createBookingAtomic(data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
  while (bookingLock) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  bookingLock = true;

  try {
    const slot = await db.timeSlots.get(data.timeSlotId);
    if (!slot) {
      throw new Error('Time slot not found');
    }
    if (!slot.isAvailable) {
      throw new Error('Time slot is no longer available');
    }
    if (slot.deviceId !== data.deviceId) {
      throw new Error('Slot does not belong to specified device');
    }

    const existingBookings = await db.bookings.filter(
      b => b.deviceId === data.deviceId && b.timeSlotId === data.timeSlotId && b.status !== 'cancelled' && b.status !== 'no_show'
    );
    if (existingBookings.length > 0) {
      throw new Error('Slot is already booked');
    }

    await db.timeSlots.update(data.timeSlotId, { isAvailable: false });

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const booking: Booking = { ...data, id, createdAt };
    await db.bookings.add(booking);

    logger.audit('Booking created', { bookingId: id, deviceId: data.deviceId, timeSlotId: data.timeSlotId });
    return booking;
  } finally {
    bookingLock = false;
  }
}

// Transaction helper (simulates Dexie transaction)
export async function dbTransaction<R>(
  mode: string,
  tables: MemTable<any>[],
  fn: () => Promise<R>,
): Promise<R> {
  return fn();
}
