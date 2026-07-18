import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { LoginPage } from './Login';
import { DashboardPage } from './Dashboard';
import { DevicesPage } from './Devices';
import { BookingsPage } from './Bookings';
import { POSPage } from './POS';
import { AnalyticsPage } from './Analytics';
import { ReviewsPage } from './Reviews';
import { UsersPage } from './Users';
import { SlotsPage } from './Slots';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="pos" element={<POSPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="slots" element={<SlotsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
