export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export type ProductDto = {
  id: number
  name: string
  brand: string
  description: string
  imageUrl: string
  gender: string
  price: number
  discountPrice: number
  discountPercent: number | null
  stock: number
  featured: boolean
  active: boolean
  categoryId: number | null
  categoryName: string | null
}

export type ProductRequest = {
  name: string
  price: number
  stock: number
  brand?: string
  description?: string
  imageUrl?: string
  gender?: string
  discountPercent?: number | null
  featured: boolean
  categoryId?: number | null
}

export type CategoryDto = { id: number; name: string; description: string }
export type CategoryRequest = { name: string; description?: string }

export type CouponDto = {
  id: number
  code: string
  discountPercent: number
  minimumOrderValue: number
  expiryDate: string
  active: boolean
}

export type CouponRequest = {
  code: string
  discountPercent: number
  minimumOrderValue?: number
  expiryDate?: string
  active: boolean
}

export type OrderItemDto = {
  id: number
  product: ProductDto
  quantity: number
  unitPrice: number
}

export type OrderDto = {
  id: number
  status: OrderStatus
  total: number
  shippingAddress: string
  shippingPhone: string
  paymentMethod: string
  createdAt: string
  items: OrderItemDto[]
}

export type UserDto = {
  id: number
  name: string
  email: string
  phone: string
  address: string
  role: 'CUSTOMER' | 'ADMIN'
  enabled: boolean
}

export type DashboardDto = {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  pendingOrders: number
  lowStockProducts: number
  recentOrders: OrderDto[]
}

export const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]
