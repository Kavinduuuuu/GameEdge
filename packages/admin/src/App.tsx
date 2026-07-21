import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Devices } from './pages/Devices';
import { Bookings } from './pages/Bookings';
import { POS } from './pages/POS';
import { Analytics } from './pages/Analytics';
import { Reviews } from './pages/Reviews';
import { Users } from './pages/Users';
import { Slots } from './pages/Slots';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="devices" element={<Devices />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="pos" element={<POS />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="users" element={<Users />} />
        <Route path="slots" element={<Slots />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
