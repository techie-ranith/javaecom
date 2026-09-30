import { api, unwrap, USE_MOCK, isNetworkError } from '@/services/api';
import { mockProducts } from '@/data/mock';
import type { ApiResponse, WishlistItem } from '@/types';

let mockWishlist: WishlistItem[] = [];

async function withMockFallback<T>(request: () => Promise<T>, mock: () => T | Promise<T>): Promise<T> {
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

export const wishlistService = {
  getWishlist: () =>
    withMockFallback(
      async () => {
        const { data } = await api.get<ApiResponse<WishlistItem[]>>('/wishlist');
        return unwrap(data);
      },
      () => mockWishlist,
    ),

  add: (productId: number) =>
    withMockFallback(
      async () => {
        const { data } = await api.post<ApiResponse<WishlistItem[]>>(`/wishlist/${productId}`);
        return unwrap(data);
      },
      () => {
        if (!mockWishlist.some((item) => item.product.id === productId)) {
          const product = mockProducts.find((item) => item.id === productId);
          if (product) {
            mockWishlist = [...mockWishlist, { id: Date.now(), product }];
          }
        }
        return mockWishlist;
      },
    ),

  remove: (productId: number) =>
    withMockFallback(
      async () => {
        await api.delete(`/wishlist/${productId}`);
        const { data } = await api.get<ApiResponse<WishlistItem[]>>('/wishlist');
        return unwrap(data);
      },
      () => {
        mockWishlist = mockWishlist.filter((item) => item.product.id !== productId);
        return mockWishlist;
      },
    ),
};
