import { apiFetch } from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getCurrentUser(): Promise<User> {
    return apiFetch<User>('/auth/me');
  },
};
