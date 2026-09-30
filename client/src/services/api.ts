import axios from 'axios'
import type {
  CategoryDto,
  CategoryRequest,
  CouponDto,
  CouponRequest,
  DashboardDto,
  OrderDto,
  OrderStatus,
  ProductDto,
  ProductRequest,
  UserDto,
} from '../types/admin'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

export type AuthResponse = {
  token: string
  role: string
  email: string
  name: string
}

export type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

export const authStorage = {
  save(session: AuthResponse) {
    localStorage.setItem('aurelia_token', session.token)
    localStorage.setItem('aurelia_role', session.role)
    localStorage.setItem('aurelia_name', session.name)
    localStorage.setItem('aurelia_email', session.email)
  },
  clear() {
    localStorage.removeItem('aurelia_token')
    localStorage.removeItem('aurelia_role')
    localStorage.removeItem('aurelia_name')
    localStorage.removeItem('aurelia_email')
  },
  token() {
    return localStorage.getItem('aurelia_token')
  },
  role() {
    return localStorage.getItem('aurelia_role')
  },
  name() {
    return localStorage.getItem('aurelia_name')
  },
}

export function redirectToStaffLogin() {
  authStorage.clear()
  if (!window.location.pathname.startsWith('/staff/login') && !window.location.hash.includes('staff-login')) {
    window.location.href = '/#staff-login'
  }
}

api.interceptors.request.use((config) => {
  const token = authStorage.token()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      if (window.location.pathname.startsWith('/staff')) {
        redirectToStaffLogin()
      }
    }
    return Promise.reject(err)
  },
)

export const productService = {
  getProducts: (params?: Record<string, string | number | boolean>) => api.get('/products', { params }),
  getProductById: (id: number) => api.get(`/products/${id}`),
}

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post<ApiEnvelope<AuthResponse>>('/auth/login', data),
  register: (data: { name: string; email: string; phone: string; password: string }) =>
    api.post<ApiEnvelope<AuthResponse>>('/auth/register', data),
}

export const adminService = {
  dashboard: () => api.get<ApiEnvelope<DashboardDto>>('/admin/dashboard'),
  orders: () => api.get<ApiEnvelope<OrderDto[]>>('/admin/orders'),
  updateOrderStatus: (id: number, status: OrderStatus) =>
    api.put<ApiEnvelope<OrderDto>>(`/admin/orders/${id}/status`, null, { params: { status } }),
  products: (activeOnly = false) =>
    api.get<ApiEnvelope<ProductDto[]>>('/admin/products', { params: { activeOnly } }),
  createProduct: (body: ProductRequest) =>
    api.post<ApiEnvelope<ProductDto>>('/admin/products', body),
  updateProduct: (id: number, body: ProductRequest) =>
    api.put<ApiEnvelope<ProductDto>>(`/admin/products/${id}`, body),
  deleteProduct: (id: number) => api.delete<ApiEnvelope<null>>(`/admin/products/${id}`),
  categories: () => api.get<ApiEnvelope<CategoryDto[]>>('/admin/categories'),
  createCategory: (body: CategoryRequest) =>
    api.post<ApiEnvelope<CategoryDto>>('/admin/categories', body),
  updateCategory: (id: number, body: CategoryRequest) =>
    api.put<ApiEnvelope<CategoryDto>>(`/admin/categories/${id}`, body),
  deleteCategory: (id: number) => api.delete<ApiEnvelope<null>>(`/admin/categories/${id}`),
  coupons: () => api.get<ApiEnvelope<CouponDto[]>>('/admin/coupons'),
  createCoupon: (body: CouponRequest) => api.post<ApiEnvelope<CouponDto>>('/admin/coupons', body),
  updateCoupon: (id: number, body: CouponRequest) =>
    api.put<ApiEnvelope<CouponDto>>(`/admin/coupons/${id}`, body),
  deleteCoupon: (id: number) => api.delete<ApiEnvelope<null>>(`/admin/coupons/${id}`),
  customers: () => api.get<ApiEnvelope<UserDto[]>>('/admin/customers'),
}
