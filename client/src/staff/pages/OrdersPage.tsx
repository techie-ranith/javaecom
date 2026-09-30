import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { adminService } from '../../services/api'
import type { OrderStatus } from '../../types/admin'
import { ORDER_STATUSES } from '../../types/admin'
import { OrderStatusBadge } from '../components/OrderStatusBadge'

function formatMoney(n: number) {
  return `LKR ${Number(n).toLocaleString()}`
}

export function OrdersPage() {
  const qc = useQueryClient()
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL')

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const res = await adminService.orders()
      return res.data.data ?? []
    },
  })

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
      qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })

  const filtered = useMemo(
    () => (filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  )

  if (isLoading) return <p className="staff-loading">Loading orders…</p>
  if (error) return <p className="staff-error">Could not load orders.</p>

  return (
    <div className="staff-panel-box">
      <div className="staff-toolbar">
        <h2 style={{ margin: 0 }}>Orders</h2>
        <label>
          Filter{' '}
          <select value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus | 'ALL')}>
            <option value="ALL">All</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="staff-table-wrap">
        <table className="staff-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Phone</th>
              <th>Payment</th>
              <th>Items</th>
              <th>Update status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>
                  <OrderStatusBadge status={o.status} />
                </td>
                <td>{formatMoney(o.total)}</td>
                <td>{o.shippingPhone}</td>
                <td>{o.paymentMethod}</td>
                <td>{o.items.length}</td>
                <td>
                  <select
                    value={o.status}
                    disabled={mutation.isPending}
                    onChange={(e) =>
                      mutation.mutate({ id: o.id, status: e.target.value as OrderStatus })
                    }
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
