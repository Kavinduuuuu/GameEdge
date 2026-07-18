import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useDevices, useUpdateDevice, useDeleteDevice } from '../../hooks/useDevices';
import { StatusBadge } from '../common/StatusBadge';
import { DataTable } from '../common/DataTable';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { DeviceForm } from './DeviceForm';
import { formatCurrency } from '../../utils/format';
import type { Device } from '../../api/devices';

export function DeviceList() {
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Device | null>(null);

  const { data: devices = [], isLoading } = useDevices(typeFilter || undefined, statusFilter || undefined);
  const updateDevice = useUpdateDevice();
  const deleteDevice = useDeleteDevice();

  const columns = [
    { key: 'name', header: 'Name', render: (d: Device) => (
      <div>
        <p className="font-medium text-white">{d.name}</p>
        <p className="text-xs text-gray-500 font-mono">{d.id}</p>
      </div>
    )},
    { key: 'type', header: 'Type', render: (d: Device) => (
      <span className="text-gray-300 capitalize">{d.type.replace('_', ' ')}</span>
    )},
    { key: 'status', header: 'Status', render: (d: Device) => <StatusBadge status={d.status} colorMap={{}} /> },
    { key: 'specs', header: 'Specs', render: (d: Device) => (
      <div className="text-xs text-gray-400">
        {d.specs ? Object.entries(d.specs).slice(0, 2).map(([k, v]) => (
          <span key={k} className="mr-2">{k}: {v}</span>
        )) : '—'}
      </div>
    )},
    { key: 'actions', header: '', render: (d: Device) => (
      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); setEditingDevice(d); }}
          className="text-xs text-accent-blue hover:underline"
        >
          Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setDeleteTarget(d); }}
          className="text-xs text-accent-red hover:underline"
        >
          Delete
        </button>
      </div>
    )},
  ];

  if (isLoading) return <div className="text-center py-12 text-gray-500">Loading devices...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Devices</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input text-sm py-1.5"
            >
              <option value="">All Types</option>
              <option value="pc">PC</option>
              <option value="ps5">PS5</option>
              <option value="pool_table">Pool Table</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input text-sm py-1.5"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Device
          </button>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={devices}
          keyExtractor={(d) => d.id}
          emptyMessage="No devices found"
        />
      </div>

      <DeviceForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        device={editingDevice}
        onSuccess={() => { setShowForm(false); setEditingDevice(null); }}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) deleteDevice.mutate(deleteTarget.id); setDeleteTarget(null); }}
        title="Delete Device"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also remove all associated slots and bookings.`}
        confirmText="Delete"
      />
    </div>
  );
}
