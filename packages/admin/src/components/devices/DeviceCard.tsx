import React from 'react';
import { Monitor, Gamepad2, CircleDot } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import type { Device } from '../../api/devices';

interface DeviceCardProps {
  device: Device;
  onClick?: () => void;
}

const typeIcons = {
  pc: Monitor,
  ps5: Gamepad2,
  pool_table: CircleDot,
};

export function DeviceCard({ device, onClick }: DeviceCardProps) {
  const Icon = typeIcons[device.type] || Monitor;

  return (
    <div
      onClick={onClick}
      className="card p-4 cursor-pointer hover:border-accent-blue/50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-blue/10 rounded-lg">
            <Icon className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <p className="font-medium text-white">{device.name}</p>
            <p className="text-xs text-gray-500 font-mono">{device.id}</p>
          </div>
        </div>
        <StatusBadge status={device.status} colorMap={{}} />
      </div>
      {device.specs && (
        <div className="mt-3 flex flex-wrap gap-1">
          {Object.entries(device.specs).slice(0, 3).map(([k, v]) => (
            <span key={k} className="text-[10px] bg-navy-700 text-gray-400 px-1.5 py-0.5 rounded">
              {k}: {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
