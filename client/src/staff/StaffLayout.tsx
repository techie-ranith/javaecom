import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { authStorage } from '../services/api'
import './staff.css'

const links = [
  { to: '/staff/dashboard', label: 'Dashboard' },
  { to: '/staff/orders', label: 'Orders' },
  { to: '/staff/products', label: 'Products' },
  { to: '/staff/categories', label: 'Categories' },
  { to: '/staff/coupons', label: 'Coupons' },
  { to: '/staff/customers', label: 'Customers' },
]

export function StaffLayout() {
  const navigate = useNavigate()
  const name = authStorage.name()

  return (
    <div className="staff-app">
      <aside className="staff-sidebar">
        <NavLink to="/" className="logo">
          AURELIA<span>STAFF</span>
        </NavLink>
        <nav className="staff-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="staff-main">
        <header className="staff-header">
          <h1>Staff portal</h1>
          <div className="staff-header-actions">
            <span>{name ?? 'Admin'}</span>
            <button
              type="button"
              className="staff-btn"
              onClick={() => {
                authStorage.clear()
                navigate('/staff/login')
              }}
            >
              Sign out
            </button>
          </div>
        </header>
        <div className="staff-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
