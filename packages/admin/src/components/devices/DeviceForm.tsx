import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useCreateDevice, useUpdateDevice } from '../../hooks/useDevices';
import type { Device } from '../../api/devices';

interface DeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  device?: Device | null;
  onSuccess: () => void;
}

export function DeviceForm({ isOpen, onClose, device, onSuccess }: DeviceFormProps) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'pc' | 'ps5' | 'pool_table'>('pc');
  const [status, setStatus] = useState<'available' | 'occupied' | 'maintenance' | 'offline'>('available');
  const [specsStr, setSpecsStr] = useState('');

  const createDevice = useCreateDevice();
  const updateDevice = useUpdateDevice();
  const isEditing = !!device;

  useEffect(() => {
    if (device) {
      setId(device.id);
      setName(device.name);
      setType(device.type);
      setStatus(device.status);
      setSpecsStr(device.specs ? JSON.stringify(device.specs, null, 2) : '');
    } else {
      setId('');
      setName('');
      setType('pc');
      setStatus('available');
      setSpecsStr('');
    }
  }, [device, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let specs: Record<string, string> | undefined;
    if (specsStr.trim()) {
      try {
        specs = JSON.parse(specsStr);
      } catch {
        return; // invalid JSON
      }
    }

    if (isEditing && device) {
      updateDevice.mutate(
        { id: device.id, data: { name, status, specs } },
        { onSuccess }
      );
    } else {
      createDevice.mutate(
        { id, type, name, specs },
        { onSuccess }
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Device' : 'Add Device'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Device ID</label>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="input w-full font-mono text-sm"
              placeholder="e.g., pc-01"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input w-full"
            placeholder="e.g., Gaming PC #1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'pc' | 'ps5' | 'pool_table')}
            className="input w-full"
            disabled={isEditing}
          >
            <option value="pc">PC Station</option>
            <option value="ps5">PS5 Console</option>
            <option value="pool_table">Pool Table</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'available' | 'occupied' | 'maintenance' | 'offline')}
            className="input w-full"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Specs (JSON)</label>
          <textarea
            value={specsStr}
            onChange={(e) => setSpecsStr(e.target.value)}
            className="input w-full font-mono text-sm h-24"
            placeholder='{"CPU": "i7-12700K", "GPU": "RTX 4080"}'
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button
            type="submit"
            className="btn-primary"
            disabled={createDevice.isPending || updateDevice.isPending}
          >
            {createDevice.isPending || updateDevice.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
