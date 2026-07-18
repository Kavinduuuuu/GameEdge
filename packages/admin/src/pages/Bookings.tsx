import BookingList from '../components/bookings/BookingList';

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Booking Management</h1>
      </div>
      <BookingList />
    </div>
  );
}
