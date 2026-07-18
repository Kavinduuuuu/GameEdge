import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../hooks/useAuth';

interface AuthContextType {
  user: ReturnType<typeof useAuthStore.getState>['user'];
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const stored = localStorage.getItem('admin_auth');
    if (stored) {
      try {
        const { user: u, token: t } = JSON.parse(stored);
        if (u && t) setAuth(u, t);
      } catch { /* ignore */ }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    if (data.user.role !== 'admin' && data.user.role !== 'staff') {
      throw new Error('Access denied. Admin or Staff role required.');
    }
    setAuth(data.user, data.token);
    localStorage.setItem('admin_auth', JSON.stringify({ user: data.user, token: data.token }));
  };

  const logout = () => {
    clearAuth();
    localStorage.removeItem('admin_auth');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
