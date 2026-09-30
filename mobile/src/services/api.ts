import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { AUTH_TOKEN_KEY } from '@/constants/storage';
import type { ApiResponse } from '@/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api';
export const USE_MOCK = (process.env.EXPO_PUBLIC_USE_MOCK ?? 'true') === 'true';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 12000,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // SecureStore may fail on web; ignore and continue without token.
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    return Promise.reject(error);
  },
);

export function unwrap<T>(payload: ApiResponse<T> | T): T {
  if (payload && typeof payload === 'object' && 'data' in payload && 'success' in payload) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
}

export function isNetworkError(error: unknown): boolean {
  return axios.isAxiosError(error) && (!error.response || error.code === 'ERR_NETWORK');
}

export { API_URL };
