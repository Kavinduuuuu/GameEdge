import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { devicesApi, type Device, type CreateDeviceInput, type UpdateDeviceInput } from '../api/devices';

export function useDevices(type?: string, status?: string) {
  return useQuery({
    queryKey: ['devices', type, status],
    queryFn: () => devicesApi.getAll(type, status),
  });
}

export function useCreateDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDeviceInput) => devicesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['devices'] }),
  });
}

export function useUpdateDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeviceInput }) =>
      devicesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['devices'] }),
  });
}

export function useDeleteDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => devicesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['devices'] }),
  });
}
