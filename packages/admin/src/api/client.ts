import { API_BASE_URL } from '../utils/constants';

export const apiGet = async <T>(endpoint: string): Promise<T> => {
  const token = JSON.parse(localStorage.getItem('admin_auth') || '{}').token;
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('GET failed');
  return res.json();
};

export const apiPatch = async <T>(endpoint: string, body: any): Promise<T> => {
  const token = JSON.parse(localStorage.getItem('admin_auth') || '{}').token;
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('PATCH failed');
  return res.json();
};
