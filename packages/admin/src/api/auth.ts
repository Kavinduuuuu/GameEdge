import { apiClient, apiGet, apiPatch } from './client';

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
    apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiGet<AuthUser>('/auth/me'),
};