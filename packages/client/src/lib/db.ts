import Dexie, { type Table } from 'dexie';
import type { Device, Game, Review, Booking, User } from '@/types';

export class GameEdgeDB extends Dexie {
  devices!: Table<Device, string>;
  games!: Table<Game, string>;
  reviews!: Table<Review, string>;
  bookings!: Table<Booking, string>;
  user!: Table<User, string>;

  constructor() {
    super('gameedge-client');
    this.version(1).stores({
      devices: 'id, type, status, stationNumber',
      games: 'id, name, platform, genre, rating',
      reviews: 'id, gameId, userId, rating, createdAt',
      bookings: 'id, userId, deviceId, date, status',
      user: 'id, email',
    });
  }
}

export const db = new GameEdgeDB();

// Helper functions for common operations
export async function cacheDevices(devices: Device[]) {
  await db.devices.bulkPut(devices);
}

export async function cacheGames(games: Game[]) {
  await db.games.bulkPut(games);
}

export async function cacheReviews(reviews: Review[]) {
  await db.reviews.bulkPut(reviews);
}

export async function cacheBookings(bookings: Booking[]) {
  await db.bookings.bulkPut(bookings);
}

export async function getCachedDevices(): Promise<Device[]> {
  return db.devices.toArray();
}

export async function getCachedGames(): Promise<Game[]> {
  return db.games.toArray();
}

export async function getCachedReviews(gameId: string): Promise<Review[]> {
  return db.reviews.where('gameId').equals(gameId).toArray();
}

export async function getCachedBookings(userId: string): Promise<Booking[]> {
  return db.bookings.where('userId').equals(userId).toArray();
}
