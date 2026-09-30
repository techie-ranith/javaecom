import { Navigate, Route, Routes } from 'react-router-dom'
import { CategoriesPage } from './pages/CategoriesPage'
import { CouponsPage } from './pages/CouponsPage'
import { CustomersPage } from './pages/CustomersPage'
import { DashboardPage } from './pages/DashboardPage'
import { OrdersPage } from './pages/OrdersPage'
import { ProductsPage } from './pages/ProductsPage'
import { StaffLayout } from './StaffLayout'

export function StaffRoutes() {
  return (
    <Routes>
      <Route element={<StaffLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Route>
    </Routes>
  )
}
