import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/api'

export function CustomersPage() {
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async () => {
      const res = await adminService.customers()
      return res.data.data ?? []
    },
  })

  if (isLoading) return <p className="staff-loading">Loading customers…</p>
  if (error) return <p className="staff-error">Could not load customers.</p>

  return (
    <div className="staff-panel-box">
      <h2>Customers</h2>
      <div className="staff-table-wrap">
        <table className="staff-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone ?? '—'}</td>
                <td>{c.address ?? '—'}</td>
                <td>{c.enabled ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
