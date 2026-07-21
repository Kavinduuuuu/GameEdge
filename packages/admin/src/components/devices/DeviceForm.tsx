import React, { useState } from 'react';
import { useCreateDevice, useUpdateDevice } from '../../hooks/useDevices';
import type { Device, CreateDeviceInput, UpdateDeviceInput } from '../../api/devices';

interface DeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  onSuccess: () => void;
}

export function DeviceForm({ isOpen, onClose, device, onSuccess }: DeviceFormProps) {
  const [id, setId] = useState(device?.id ?? '');
  const [type, setType] = useState(device?.type ?? 'pc');
  const [name, setName] = useState(device?.name ?? '');
  const [specs, setSpecs] = useState(device?.specs ? JSON.stringify(device.specs, null, 2) : '');
  const [specsError, setSpecsError] = useState<string | null>(null);
  const [idError, setIdError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createDevice = useCreateDevice();
  const updateDevice = useUpdateDevice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpecsError(null);
    setIdError(null);
    setNameError(null);
    setIsLoading(true);

    // Validate ID
    if (!id.trim()) {
      setIdError('ID is required');
      setIsLoading(false);
      return;
    }
    if (!/^[a-zA-Z0-9-]+$/.test(id.trim())) {
      setIdError('ID can only contain letters, numbers, and hyphens');
      setIsLoading(false);
      return;
    }

    // Validate Name
    if (!name.trim()) {
      setNameError('Name is required');
      setIsLoading(false);
      return;
    }
    if (!/^[a-zA-Z0-9 _-]+$/.test(name.trim())) {
      setNameError('Name can only contain letters, numbers, spaces, hyphens, and underscores');
      setIsLoading(false);
      return;
    }

    let parsedSpecs: Record<string, string> | undefined;
    if (specs.trim()) {
      try {
        parsedSpecs = JSON.parse(specs);
        if (typeof parsedSpecs !== 'object' || parsedSpecs === null || Array.isArray(parsedSpecs)) {
          throw new Error('Specs must be a JSON object');
        }
        // Ensure all values are strings
        for (const key in parsedSpecs) {
          if (typeof parsedSpecs[key] !== 'string') {
            throw new Error(`Spec value for key "${key}" must be a string`);
          }
        }
      } catch (err) {
        setSpecsError('Invalid JSON for specs. Must be a valid JSON object with string values.');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (device) {
        // Update mode
        const updateData: UpdateDeviceInput = {
          name: name.trim(),
          specs: parsedSpecs,
        };
        await updateDevice.mutateAsync({ id: device.id, data: updateData });
      } else {
        // Create mode
        const createData: CreateDeviceInput = {
          id: id.trim(),
          type: type as 'pc' | 'ps5' | 'pool_table',
          name: name.trim(),
          specs: parsedSpecs,
        };
        await createDevice.mutateAsync(createData);
      }
      onSuccess();
    } catch (err) {
      console.error('Failed to save device:', err);
      alert('Failed to save device. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-navy-900 rounded-lg p-6 w-full max-w-md mx-4 relative">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-white">
            {device ? 'Edit Device' : 'Add Device'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Device ID
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className={`input w-full ${idError ? 'border-accent-red' : ''}`}
              placeholder="Enter unique device ID"
              disabled={!!device}
            />
            {idError && (
              <p className="text-xs text-accent-red mt-1">{idError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'pc' | 'ps5' | 'pool_table')}
              className="input w-full"
            >
              <option value="pc">PC</option>
              <option value="ps5">PS5</option>
              <option value="pool_table">Pool Table</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input w-full ${nameError ? 'border-accent-red' : ''}`}
              placeholder="Enter device name"
            />
            {nameError && (
              <p className="text-xs text-accent-red mt-1">{nameError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Specs (JSON object, optional)
            </label>
            <textarea
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              className="textarea w-full h-32 font-mono"
              placeholder='{"cpu": "Intel i7", "ram": "16GB"}'
            />
            {specsError && (
              <p className="text-xs text-accent-red mt-1">{specsError}</p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Saving...' : (device ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}