import { api, unwrap, USE_MOCK, isNetworkError } from '@/services/api';
import { mockProducts } from '@/data/mock';
import type { ApiResponse, Cart, CartItem } from '@/types';

let mockCart: Cart = { items: [], total: 0 };

function recalc(items: CartItem[]): Cart {
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { items, total };
}

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

export const cartService = {
  getCart: () =>
    withMockFallback(
      async () => {
        const { data } = await api.get<ApiResponse<Cart>>('/cart');
        const cart = unwrap(data);
        return {
          ...cart,
          total: Number(cart.total),
          items: cart.items.map((item) => ({
            ...item,
            lineTotal: Number(item.lineTotal),
            product: {
              ...item.product,
              price: Number(item.product.price),
              discountPrice:
                item.product.discountPrice == null ? null : Number(item.product.discountPrice),
            },
          })),
        };
      },
      () => mockCart,
    ),

  addToCart: (productId: number, quantity = 1) =>
    withMockFallback(
      async () => {
        const { data } = await api.post<ApiResponse<Cart>>(`/cart/${productId}`, null, {
          params: { quantity },
        });
        return unwrap(data);
      },
      () => {
        const product = mockProducts.find((item) => item.id === productId);
        if (!product) throw new Error('Product not found');
        const existing = mockCart.items.find((item) => item.product.id === productId);
        const price = Number(product.discountPrice ?? product.price);
        if (existing) {
          existing.quantity += quantity;
          existing.lineTotal = existing.quantity * price;
        } else {
          mockCart.items.push({
            id: Date.now(),
            product,
            quantity,
            lineTotal: quantity * price,
          });
        }
        mockCart = recalc(mockCart.items);
        return mockCart;
      },
    ),

  updateItem: (itemId: number, quantity: number) =>
    withMockFallback(
      async () => {
        const { data } = await api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, null, {
          params: { quantity },
        });
        return unwrap(data);
      },
      () => {
        mockCart.items = mockCart.items.map((item) => {
          if (item.id !== itemId) return item;
          const price = Number(item.product.discountPrice ?? item.product.price);
          return { ...item, quantity, lineTotal: quantity * price };
        });
        mockCart = recalc(mockCart.items);
        return mockCart;
      },
    ),

  removeItem: (itemId: number) =>
    withMockFallback(
      async () => {
        await api.delete(`/cart/items/${itemId}`);
        const { data } = await api.get<ApiResponse<Cart>>('/cart');
        return unwrap(data);
      },
      () => {
        mockCart.items = mockCart.items.filter((item) => item.id !== itemId);
        mockCart = recalc(mockCart.items);
        return mockCart;
      },
    ),

  clearMockCart: () => {
    mockCart = { items: [], total: 0 };
  },
};
