import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '@/global.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  React.useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ToastProvider>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: Colors.cream },
                  animation: 'fade',
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
                <Stack.Screen name="product/[id]" />
                <Stack.Screen name="category/[slug]" />
                <Stack.Screen name="search" />
                <Stack.Screen name="checkout" />
                <Stack.Screen name="orders" />
                <Stack.Screen name="profile/index" />
              </Stack>
            </ToastProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
