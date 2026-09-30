export type UserRole = 'CUSTOMER' | 'ADMIN';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole | string;
  enabled?: boolean;
}

export interface AuthResponse {
  token: string;
  role: string;
  email: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
  images?: string[];
  gender: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  featured: boolean;
  categoryId?: number | null;
  categoryName?: string | null;
  rating?: number;
  reviews?: number;
  size?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  customerName: string;
  productId: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface WishlistItem {
  id: number;
  product: Product;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  shippingAddress: string;
  shippingPhone: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export interface Coupon {
  id: number;
  code: string;
  discountPercent: number;
  minimumOrderValue?: number;
  expiryDate?: string;
  active: boolean;
}

export interface Address {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface ProductFilters {
  q?: string;
  category?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CheckoutDraft {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  paymentMethod: 'Cash on Delivery' | 'Card Payment';
}
