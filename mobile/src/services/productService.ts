import { mockProducts } from '@/data/mock';
import { api, unwrap, USE_MOCK, isNetworkError } from '@/services/api';
import { filterProducts, sortProducts } from '@/utils/helpers';
import type { ApiResponse, PageResponse, Product, ProductFilters, Review } from '@/types';
import { mockReviews } from '@/data/mock';

function toNumber(value: unknown): number {
  return Number(value ?? 0);
}

function normalizeProduct(raw: Product): Product {
  return {
    ...raw,
    price: toNumber(raw.price),
    discountPrice: raw.discountPrice == null ? null : toNumber(raw.discountPrice),
    stock: toNumber(raw.stock),
    rating: raw.rating ?? 4.5,
    reviews: raw.reviews ?? 0,
    size: raw.size ?? '50 ml',
    images: raw.images?.length ? raw.images : [raw.imageUrl],
  };
}

function mockPage(filters: ProductFilters = {}): PageResponse<Product> {
  const page = filters.page ?? 0;
  const size = filters.size ?? 12;
  const filtered = sortProducts(filterProducts(mockProducts, filters), filters.sort);
  const start = page * size;
  const content = filtered.slice(start, start + size).map(normalizeProduct);
  return {
    content,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size) || 1,
    size,
    number: page,
    last: start + size >= filtered.length,
    first: page === 0,
    empty: content.length === 0,
  };
}

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

export const productService = {
  getProducts: (filters: ProductFilters = {}) =>
    withMockFallback(
      async () => {
        const { data } = await api.get<ApiResponse<PageResponse<Product>>>('/products', {
          params: {
            q: filters.q ?? '',
            category: filters.category,
            gender: filters.gender,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            featured: filters.featured ?? false,
            page: filters.page ?? 0,
            size: filters.size ?? 12,
            sort: filters.sort === 'priceAsc' ? 'price,asc' : filters.sort === 'priceDesc' ? 'price,desc' : undefined,
          },
        });
        const page = unwrap(data);
        return {
          ...page,
          content: sortProducts(page.content.map(normalizeProduct), filters.sort),
        };
      },
      () => mockPage(filters),
    ),

  getProductById: (id: number) =>
    withMockFallback(
      async () => {
        const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
        return normalizeProduct(unwrap(data));
      },
      () => {
        const product = mockProducts.find((item) => item.id === id) ?? mockProducts[0];
        return normalizeProduct(product);
      },
    ),

  getReviews: (id: number) =>
    withMockFallback(
      async () => {
        const { data } = await api.get<ApiResponse<Review[]>>(`/products/${id}/reviews`);
        return unwrap(data);
      },
      () => mockReviews.filter((review) => review.productId === id),
    ),
};
