import { Brand } from '@/constants/theme';
import type { Product, ProductFilters } from '@/types';

export function formatCurrency(amount: number | string | null | undefined): string {
  const value = Number(amount ?? 0);
  return `${Brand.currency} ${value.toLocaleString('en-LK', {
    maximumFractionDigits: 0,
  })}`;
}

export function getEffectivePrice(product: Product): number {
  if (product.discountPrice != null && product.discountPrice < product.price) {
    return Number(product.discountPrice);
  }
  return Number(product.price);
}

export function getDiscountPercent(product: Product): number | null {
  const effective = getEffectivePrice(product);
  if (effective >= product.price) return null;
  return Math.round(((product.price - effective) / product.price) * 100);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function categoryFromSlug(slug: string): string {
  const map: Record<string, string> = {
    men: 'Men',
    women: 'Women',
    unisex: 'Unisex',
    'gift-sets': 'Gift sets',
    'gift sets': 'Gift sets',
  };
  return map[slug.toLowerCase()] ?? slug;
}

export function sortProducts(products: Product[], sort?: string): Product[] {
  const list = [...products];
  switch (sort) {
    case 'priceAsc':
      return list.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    case 'priceDesc':
      return list.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    case 'popular':
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'newest':
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.id - a.id);
  }
}

export function filterProducts(products: Product[], filters: ProductFilters = {}): Product[] {
  return products.filter((product) => {
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const haystack = `${product.name} ${product.brand} ${product.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.category) {
      const category = filters.category.toLowerCase();
      if (
        product.categoryName?.toLowerCase() !== category &&
        product.gender.toLowerCase() !== category
      ) {
        return false;
      }
    }
    if (filters.gender && product.gender.toLowerCase() !== filters.gender.toLowerCase()) {
      return false;
    }
    if (filters.minPrice != null && getEffectivePrice(product) < filters.minPrice) return false;
    if (filters.maxPrice != null && getEffectivePrice(product) > filters.maxPrice) return false;
    if (filters.featured && !product.featured) return false;
    return true;
  });
}

export function calcDeliveryFee(subtotal: number): number {
  return subtotal >= Brand.freeDeliveryThreshold ? 0 : Brand.deliveryFee;
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const err = error as {
      message?: string;
      response?: { data?: { message?: string }; status?: number };
      code?: string;
    };
    if (err.code === 'ERR_NETWORK') {
      return 'Unable to reach the server. Check your connection and API URL.';
    }
    if (err.response?.status === 401) return 'Please sign in to continue.';
    if (err.response?.status === 403) return 'You do not have permission to do that.';
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
  }
  return fallback;
}

export function debounce<T extends (...args: string[]) => void>(fn: T, delay = 400) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
