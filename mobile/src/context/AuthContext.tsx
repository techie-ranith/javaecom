import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, PROFILE_KEY } from '@/constants/storage';
import { authService, type LoginPayload, type RegisterPayload } from '@/services/authService';
import type { User } from '@/types';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateLocalProfile: (patch: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function saveSecure(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    // Fallback for environments without SecureStore (e.g. some web setups)
  }
}

async function readSecure(key: string) {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function deleteSecure(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [storedToken, storedUser, storedProfile] = await Promise.all([
          readSecure(AUTH_TOKEN_KEY),
          readSecure(AUTH_USER_KEY),
          readSecure(PROFILE_KEY),
        ]);
        if (!mounted) return;
        if (storedToken && storedUser) {
          const parsed = JSON.parse(storedUser) as User;
          const profile = storedProfile ? (JSON.parse(storedProfile) as Partial<User>) : {};
          setToken(storedToken);
          setUser({ ...parsed, ...profile });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persistSession = useCallback(async (nextToken: string, nextUser: User) => {
    setToken(nextToken);
    setUser(nextUser);
    await Promise.all([
      saveSecure(AUTH_TOKEN_KEY, nextToken),
      saveSecure(AUTH_USER_KEY, JSON.stringify(nextUser)),
    ]);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authService.login(payload);
      await persistSession(response.token, {
        name: response.name,
        email: response.email,
        role: response.role,
      });
    },
    [persistSession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authService.register(payload);
      await persistSession(response.token, {
        name: response.name,
        email: response.email,
        phone: payload.phone,
        role: response.role,
      });
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    await Promise.all([
      deleteSecure(AUTH_TOKEN_KEY),
      deleteSecure(AUTH_USER_KEY),
    ]);
  }, []);

  const updateLocalProfile = useCallback(
    async (patch: Partial<User>) => {
      setUser((prev) => {
        const next = { ...(prev ?? { name: '', email: '', role: 'CUSTOMER' }), ...patch };
        void saveSecure(PROFILE_KEY, JSON.stringify(patch));
        void saveSecure(AUTH_USER_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      updateLocalProfile,
    }),
    [user, token, isLoading, login, register, logout, updateLocalProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
