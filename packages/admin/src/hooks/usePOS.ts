import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { posApi, type POSItem, type Order } from '../api/pos';

export function usePOSItems() {
  return useQuery({
    queryKey: ['pos-items'],
    queryFn: () => posApi.getItems(),
  });
}

export function usePOSOrders() {
  return useQuery({
    queryKey: ['pos-orders'],
    queryFn: () => posApi.getOrders(),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: posApi.createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pos-orders'] });
      qc.invalidateQueries({ queryKey: ['pos-items'] });
    },
  });
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => posApi.checkout(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pos-orders'] });
    },
  });
}

export function useCreatePOSItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; category: string; price: number; stock: number }) =>
      posApi.createItem(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pos-items'] }),
  });
}

export function useUpdatePOSItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<POSItem> }) =>
      posApi.updateItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pos-items'] }),
  });
}
