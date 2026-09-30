import { mockCategories } from '@/data/mock';
import { api, unwrap, USE_MOCK, isNetworkError } from '@/services/api';
import { slugify } from '@/utils/helpers';
import type { ApiResponse, Category } from '@/types';

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

export const categoryService = {
  getCategories: () =>
    withMockFallback(
      async () => {
        const { data } = await api.get<ApiResponse<Category[]>>('/categories');
        return unwrap(data).map((category) => ({
          ...category,
          slug: slugify(category.name),
        }));
      },
      () => mockCategories,
    ),
};
