import type { OrderStatus } from '../../types/admin'

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cls = status.toLowerCase()
  return <span className={`staff-badge ${cls}`}>{status.replace('_', ' ')}</span>
}
