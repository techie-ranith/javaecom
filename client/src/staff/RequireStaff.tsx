import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { authStorage } from '../services/api'

export function RequireStaff({ children }: { children: ReactNode }) {
  const location = useLocation()
  if (authStorage.role() !== 'ADMIN' || !authStorage.token()) {
    return <Navigate to="/staff/login" state={{ from: location.pathname }} replace />
  }
  return children
}
