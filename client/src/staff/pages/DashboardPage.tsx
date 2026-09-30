import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/api'
import { StatCard } from '../components/StatCard'
import { OrderStatusBadge } from '../components/OrderStatusBadge'

function formatMoney(n: number) {
  return `LKR ${Number(n).toLocaleString()}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await adminService.dashboard()
      return res.data.data
    },
  })

  if (isLoading) return <p className="staff-loading">Loading dashboard…</p>
  if (error || !data) return <p className="staff-error">Could not load dashboard.</p>

  return (
    <>
      <div className="staff-stats">
        <StatCard label="Total sales" value={formatMoney(data.totalSales)} />
        <StatCard label="Orders" value={data.totalOrders} />
        <StatCard label="Customers" value={data.totalCustomers} />
        <StatCard label="Products" value={data.totalProducts} />
        <StatCard label="Pending orders" value={data.pendingOrders} />
        <StatCard label="Low stock" value={data.lowStockProducts} />
      </div>

      {data.lowStockProducts > 0 && (
        <div className="staff-alert">
          {data.lowStockProducts} product(s) have fewer than 5 units in stock.{' '}
          <Link to="/staff/products">Review inventory</Link>
        </div>
      )}

      <div className="staff-panel-box">
        <h2>Recent orders</h2>
        <div className="staff-table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Total</th>
                <th>Phone</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td>{formatMoney(o.total)}</td>
                  <td>{o.shippingPhone}</td>
                  <td>{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 16 }}>
          <Link to="/staff/orders">View all orders →</Link>
        </p>
      </div>
    </>
  )
}
