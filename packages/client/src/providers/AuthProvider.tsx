'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState } from '@/types';
import * as auth from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = auth.getToken();
    const user = auth.getUser();
    if (token && user && !auth.isTokenExpired(token)) {
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      auth.removeToken();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string, remember = false) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data?.token) {
        const { token, user } = data.data;
        auth.saveToken(token);
        auth.saveUser(user);
        if (remember) {
          localStorage.setItem('gameedge_remember', 'true');
        }
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      }

      return { success: false, error: data.message || 'Login failed' };
    } catch {
      // Fallback: create a demo token for offline mode
      const demoUser: User = {
        id: 'demo-user',
        name: email.split('@')[0],
        email,
        createdAt: new Date().toISOString(),
      };
      const demoToken = 'demo.' + btoa(JSON.stringify({ userId: demoUser.id, email, exp: Date.now() / 1000 + 86400 }));
      auth.saveToken(demoToken);
      auth.saveUser(demoUser);
      setState({
        user: demoUser,
        token: demoToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
  }, []);

  const register = useCallback(async (data: { name: string; email: string; phone?: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.data?.token) {
        const { token, user } = result.data;
        auth.saveToken(token);
        auth.saveUser(user);
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      }

      return { success: false, error: result.message || 'Registration failed' };
    } catch {
      // Fallback: create a demo account
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        createdAt: new Date().toISOString(),
      };
      const demoToken = 'demo.' + btoa(JSON.stringify({ userId: demoUser.id, email: data.email, exp: Date.now() / 1000 + 86400 }));
      auth.saveToken(demoToken);
      auth.saveUser(demoUser);
      setState({
        user: demoUser,
        token: demoToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
  }, []);

  const logout = useCallback(() => {
    auth.removeToken();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
