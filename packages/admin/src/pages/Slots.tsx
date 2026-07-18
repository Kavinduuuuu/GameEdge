import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet } from '../api/client';
import { DEVICE_TYPES } from '../utils/constants';
import { Clock, Lock, Unlock } from 'lucide-react';

interface TimeSlot {
  id: string; deviceId: string; date: string; startTime: string; endTime: string;
  isAvailable: boolean; pricingTier: string;
}

interface Device { id: string; name: string; type: string; status: string; }

export default function SlotsPage() {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const qc = useQueryClient();

  const { data: devices = [] } = useQuery({ queryKey: ['devices'], queryFn: () => apiGet<Device[]>('/devices') });
  const { data: slots = [] } = useQuery({
    queryKey: ['slots', selectedDevice],
    queryFn: () => apiGet<TimeSlot[]>(`/devices/${selectedDevice}/slots?startDate=2026-07-01&endDate=2026-07-07`),
    enabled: !!selectedDevice,
  });

  const toggleSlot = async (slot: TimeSlot) => {
    await fetch(`/api/v1/slots/${slot.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('admin_auth') ? JSON.parse(localStorage.getItem('admin_auth')!).token : ''}` },
      body: JSON.stringify({ isAvailable: !slot.isAvailable }),
    });
    qc.invalidateQueries({ queryKey: ['slots', selectedDevice] });
  };

  // Group slots by date
  const slotsByDate = slots.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const dates = Object.keys(slotsByDate).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Time Slot Configuration</h1>
      </div>
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-300">Select Device:</label>
        <select
          value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a device...</option>
          {devices.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.type})</option>
          ))}
        </select>
      </div>

      {selectedDevice && dates.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-slate-400 font-medium">Time</th>
                {dates.map(d => (
                  <th key={d} className="px-3 py-2 text-center text-slate-400 font-medium">{new Date(d).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 14 }, (_, i) => {
                const hour = i + 10;
                const time = `${String(hour).padStart(2, '0')}:00`;
                return (
                  <tr key={time} className="border-t border-slate-800">
                    <td className="px-3 py-2 text-slate-300 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />{time}
                    </td>
                    {dates.map(date => {
                      const slot = slotsByDate[date]?.find(s => s.startTime === time);
                      if (!slot) return <td key={date} className="px-3 py-2 text-center text-slate-600">—</td>;
                      return (
                        <td key={date} className="px-3 py-2 text-center">
                          <button
                            onClick={() => toggleSlot(slot)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                              slot.isAvailable
                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            }`}
                          >
                            {slot.isAvailable ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {slot.isAvailable ? 'Open' : 'Booked'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
