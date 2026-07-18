import { useState } from 'react';
import Modal from '../common/Modal';

interface Props { onClose: () => void; }

export default function WalkInForm({ onClose }: Props) {
  const [deviceId, setDeviceId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem('admin_auth')!);
      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ deviceId, date, startTime, endTime }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Booking failed'); }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <Modal title="Create Walk-in Booking" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Device ID</label>
          <input value={deviceId} onChange={e => setDeviceId(e.target.value)} required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" placeholder="gaming-rig-01" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Start Time</label>
            <input value={startTime} onChange={e => setStartTime(e.target.value)} required placeholder="14:00"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">End Time</label>
            <input value={endTime} onChange={e => setEndTime(e.target.value)} required placeholder="15:00"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg">
          {loading ? 'Creating...' : 'Create Booking'}
        </button>
      </form>
    </Modal>
  );
}
