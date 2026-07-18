import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch } from '../../api/client';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import ConfirmDialog from '../common/ConfirmDialog';
import WalkInForm from './WalkInForm';
import { Plus, XCircle, Eye } from 'lucide-react';

interface Booking {
  id: string; userId: string; deviceId: string; timeSlotId: string;
  date: string; startTime: string; endTime: string;
  status: string; totalPrice: number; createdAt: string;
}

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'];

export default function BookingList() {
  const [filter, setFilter] = useState('all');
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const qc = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', filter],
    queryFn: () => apiGet<Booking[]>('/bookings' + (filter !== 'all' ? `?status=${filter}` : '')),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/v1/bookings/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('admin_auth')!).token}` } }).then(r => { if (!r.ok) throw new Error('Cancel failed'); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bookings'] }); setCancelId(null); },
  });

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'startTime', label: 'Time' },
    { key: 'deviceId', label: 'Device' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'totalPrice', label: 'Price', render: (v: number) => `$${v.toFixed(2)}` },
    { key: 'actions', label: 'Actions', render: (_: any, row: Booking) => (
      <div className="flex gap-2">
        <button onClick={() => setViewBooking(row)} className="text-blue-400 hover:text-blue-300"><Eye className="w-4 h-4" /></button>
        {(row.status === 'confirmed' || row.status === 'pending') && (
          <button onClick={() => setCancelId(row.id)} className="text-red-400 hover:text-red-300"><XCircle className="w-4 h-4" /></button>
        )}
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-sm rounded-lg capitalize ${filter === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >{s}</button>
          ))}
        </div>
        <button onClick={() => setShowWalkIn(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />Walk-in Booking
        </button>
      </div>
      {isLoading ? <div className="text-slate-400">Loading bookings...</div> : <DataTable columns={columns} data={bookings} />}
      {showWalkIn && <WalkInForm onClose={() => { setShowWalkIn(false); qc.invalidateQueries({ queryKey: ['bookings'] }); }} />}
      {cancelId && <ConfirmDialog title="Cancel Booking" message="Are you sure? This will free up the time slot." onConfirm={() => cancelMutation.mutate(cancelId)} onCancel={() => setCancelId(null)} />}
      {viewBooking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setViewBooking(null)}>
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Booking Detail</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-slate-400">ID:</span> <span className="text-white font-mono">{viewBooking.id.slice(0, 8)}</span></div>
              <div><span className="text-slate-400">Device:</span> <span className="text-white">{viewBooking.deviceId}</span></div>
              <div><span className="text-slate-400">Date:</span> <span className="text-white">{viewBooking.date}</span></div>
              <div><span className="text-slate-400">Time:</span> <span className="text-white">{viewBooking.startTime} - {viewBooking.endTime}</span></div>
              <div><span className="text-slate-400">Status:</span> <StatusBadge status={viewBooking.status} /></div>
              <div><span className="text-slate-400">Price:</span> <span className="text-white">${viewBooking.totalPrice.toFixed(2)}</span></div>
            </div>
            <button onClick={() => setViewBooking(null)} className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
