export const QUERY_KEYS = {
  products: 'products',
  product: 'product',
  categories: 'categories',
  reviews: 'reviews',
  cart: 'cart',
  wishlist: 'wishlist',
  orders: 'orders',
  order: 'order',
  profile: 'profile',
} as const;

export const AUTH_TOKEN_KEY = 'aurelia_jwt';
export const AUTH_USER_KEY = 'aurelia_user';
export const RECENT_SEARCHES_KEY = 'aurelia_recent_searches';
export const PROFILE_KEY = 'aurelia_profile';
export const CHECKOUT_DRAFT_KEY = 'aurelia_checkout_draft';

export const ORDER_TIMELINE = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
] as const;

export const GENDERS = ['Men', 'Women', 'Unisex'] as const;

export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'priceAsc' },
  { label: 'Price: High → Low', value: 'priceDesc' },
  { label: 'Popular', value: 'popular' },
] as const;
