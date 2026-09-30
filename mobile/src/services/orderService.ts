import { api, unwrap, USE_MOCK, isNetworkError } from '@/services/api';
import { mockOrders } from '@/data/mock';
import { cartService } from '@/services/cartService';
import type { ApiResponse, Order } from '@/types';

let localOrders = [...mockOrders];

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

export const orderService = {
  getOrders: () =>
    withMockFallback(
      async () => {
        const { data } = await api.get<ApiResponse<Order[]>>('/orders');
        return unwrap(data).map((order) => ({
          ...order,
          total: Number(order.total),
        }));
      },
      () => localOrders,
    ),

  getOrderById: (id: number) =>
    withMockFallback(
      async () => {
        const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
        const order = unwrap(data);
        return { ...order, total: Number(order.total) };
      },
      () => {
        const order = localOrders.find((item) => item.id === id);
        if (!order) throw new Error('Order not found');
        return order;
      },
    ),

  createOrder: (payload: { address: string; phone: string; payment: string }) =>
    withMockFallback(
      async () => {
        const { data } = await api.post<ApiResponse<Order>>('/orders', null, {
          params: payload,
        });
        return unwrap(data);
      },
      async () => {
        const cart = await cartService.getCart();
        if (!cart.items.length) throw new Error('Cart is empty');
        const order: Order = {
          id: Date.now(),
          status: 'PENDING',
          total: cart.total,
          shippingAddress: payload.address,
          shippingPhone: payload.phone,
          paymentMethod: payload.payment,
          createdAt: new Date().toISOString(),
          items: cart.items.map((item) => ({
            id: item.id,
            product: item.product,
            quantity: item.quantity,
            unitPrice: Number(item.product.discountPrice ?? item.product.price),
          })),
        };
        localOrders = [order, ...localOrders];
        cartService.clearMockCart();
        return order;
      },
    ),
};
