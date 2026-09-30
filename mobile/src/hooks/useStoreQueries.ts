import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/storage';
import { useAuth } from '@/context/AuthContext';
import { cartService } from '@/services/cartService';
import { wishlistService } from '@/services/wishlistService';

export function useCartQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.cart],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });
}

export function useWishlistQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.wishlist],
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
  });
}

export function useCartCount() {
  const { data } = useCartQuery();
  return data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export function useIsWishlisted(productId: number) {
  const { data } = useWishlistQuery();
  return Boolean(data?.some((item) => item.product.id === productId));
}
