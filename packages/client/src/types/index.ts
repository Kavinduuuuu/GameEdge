// GameEdge Client Types
export interface Device {
  id: string;
  name: string;
  type: 'pc' | 'ps5' | 'pool_table';
  stationNumber: number;
  status: 'available' | 'occupied' | 'maintenance';
  specs?: PCSpecs | PS5Specs;
  hourlyRate: number;
}

export interface PCSpecs {
  cpu: string;
  gpu: string;
  ram: string;
  monitor: string;
  peripherals: string[];
}

export interface PS5Specs {
  controllers: number;
  tvSize: string;
  games: string[];
}

export interface Game {
  id: string;
  name: string;
  platform: 'pc' | 'ps5';
  genre: GameGenre;
  coverImage: string;
  description: string;
  rating: number;
  reviewCount: number;
  releaseYear: number;
  developer: string;
}

export type GameGenre =
  | 'fps'
  | 'rpg'
  | 'sports'
  | 'racing'
  | 'fighting'
  | 'strategy'
  | 'moba'
  | 'battle_royale'
  | 'simulation'
  | 'horror';

export interface Review {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'pc' | 'ps5' | 'pool_table';
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  pricingTier: 'standard' | 'peak' | 'weekend';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface CafeStatus {
  isOpen: boolean;
  currentOccupancy: number;
  totalStations: number;
  openingTime: string;
  closingTime: string;
  lastUpdated: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  pricingTier: 'standard' | 'peak' | 'weekend';
  price: number;
}

export interface WebSocketEvent {
  type: 'cafe:status' | 'device:status' | 'booking:update';
  payload: unknown;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
