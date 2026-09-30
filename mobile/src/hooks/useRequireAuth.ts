import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (action?: () => void) => {
    if (isAuthenticated) {
      action?.();
      return true;
    }
    router.push({
      pathname: '/(auth)/login',
      params: { redirect: pathname },
    });
    return false;
  };
}
