import { apiClient } from '../api/axios';

export interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: 'CLIENTE' | 'VENDEDOR' | 'SUPERADMIN';
}

export interface AuthResponse {
  message: string;
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
}

export const authService = {
  async login(email: string, password?: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  async register(name: string, email: string, password?: string, role: string = 'CLIENTE'): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', { name, email, password, role });
    return data;
  },

  async getProfile(): Promise<UserProfile> {
    const { data } = await apiClient.get<UserProfile>('/auth/me');
    return data;
  },

  async devToken(email?: string, role: string = 'SUPERADMIN'): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/dev-token', { email, role });
    return data;
  },

  async syncUser(name?: string, role?: string): Promise<{ message: string; user: UserProfile }> {
    const { data } = await apiClient.post('/auth/sync', { name, role });
    return data;
  }
};
