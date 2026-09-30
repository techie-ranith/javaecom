import { api, unwrap, USE_MOCK, isNetworkError } from '@/services/api';
import type { ApiResponse, AuthResponse } from '@/types';

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

async function withMockFallback<T>(request: () => Promise<T>, mock: () => T): Promise<T> {
  if (USE_MOCK) {
    try {
      return await request();
    } catch (error) {
      if (isNetworkError(error)) return mock();
      throw error;
    }
  }
  return request();
}

export const authService = {
  login: (data: LoginPayload) =>
    withMockFallback(
      async () => {
        const { data: res } = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
        return unwrap(res);
      },
      () => ({
        token: 'mock-jwt-token',
        role: 'CUSTOMER',
        email: data.email,
        name: data.email.split('@')[0] || 'Guest',
      }),
    ),

  register: (data: RegisterPayload) =>
    withMockFallback(
      async () => {
        const { data: res } = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
        return unwrap(res);
      },
      () => ({
        token: 'mock-jwt-token',
        role: 'CUSTOMER',
        email: data.email,
        name: data.name,
      }),
    ),
};
