import { apiClient } from './client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'staff' | 'admin';
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } }),

  me: () => apiClient<AuthUser>('/auth/me'),
};
