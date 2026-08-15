import axios from 'axios';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  status: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: UserProfile;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Configure default authorization header if token exists in localStorage
const storedToken = localStorage.getItem('auth_token');
if (storedToken) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

export async function loginApiCredentials(credentials: { email: string; password: string }): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/login', credentials);
  
  if (response.data?.token) {
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
  }

  return response.data;
}

export async function logoutApi(): Promise<void> {
  try {
    await apiClient.post('/logout');
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

export function getStoredAuth(): { token: string | null; user: UserProfile | null } {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('auth_user');
  let user: UserProfile | null = null;
  
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }
  }

  return { token, user };
}
