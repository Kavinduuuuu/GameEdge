import { apiClient, apiGet, apiPatch } from './client';

export interface POSItem {
  id: string;
  name: string;
  category: 'snack' | 'drink' | 'merchandise' | 'hour_package';
  price: number;
  stock: number;
}

export interface Order {
  id: string;
  userId: string;
  items: { itemId: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'wallet';
  status: 'pending' | 'paid' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface CreateOrderInput {
  items: { itemId: string; quantity: number }[];
  paymentMethod: string;
}

export const posApi = {
  getItems: () => apiGet<POSItem[]>('/pos/items'),

  createItem: (data: { name: string; category: string; price: number; stock: number }) =>
    apiClient<POSItem>('/pos/items', { method: 'POST', body: JSON.stringify(data) }),

  updateItem: (id: string, data: Partial<{ name: string; category: string; price: number; stock: number }>) =>
    apiClient<POSItem>(`/pos/items/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getOrders: () => apiGet<Order[]>('/pos/orders'),

  createOrder: (data: CreateOrderInput) =>
    apiClient<Order>('/pos/orders', { method: 'POST', body: JSON.stringify(data) }),

  checkout: (orderId: string) =>
    apiClient<Order>('/pos/checkout', { method: 'POST', body: JSON.stringify({ orderId}) }),
};
