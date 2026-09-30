import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { adminService } from '../../services/api'
import type { CouponDto, CouponRequest } from '../../types/admin'

const emptyCoupon = (): CouponRequest => ({
  code: '',
  discountPercent: 10,
  minimumOrderValue: 0,
  expiryDate: '',
  active: true,
})

export function CouponsPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<CouponRequest>(emptyCoupon())

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: async () => {
      const res = await adminService.coupons()
      return res.data.data ?? []
    },
  })

  const saveMutation = useMutation({
    mutationFn: () =>
      editId != null ? adminService.updateCoupon(editId, form) : adminService.createCoupon(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      setModal(false)
      setEditId(null)
      setForm(emptyCoupon())
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteCoupon(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  })

  const openEdit = (c: CouponDto) => {
    setEditId(c.id)
    setForm({
      code: c.code,
      discountPercent: Number(c.discountPercent),
      minimumOrderValue: Number(c.minimumOrderValue),
      expiryDate: c.expiryDate?.slice(0, 10) ?? '',
      active: c.active,
    })
    setModal(true)
  }

  if (isLoading) return <p className="staff-loading">Loading coupons…</p>

  return (
    <>
      <div className="staff-panel-box">
        <div className="staff-toolbar">
          <h2 style={{ margin: 0 }}>Coupons</h2>
          <button
            type="button"
            className="staff-btn primary"
            onClick={() => {
              setEditId(null)
              setForm(emptyCoupon())
              setModal(true)
            }}
          >
            Add coupon
          </button>
        </div>
        <div className="staff-table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min order</th>
                <th>Expires</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td>{c.code}</td>
                  <td>{c.discountPercent}%</td>
                  <td>LKR {Number(c.minimumOrderValue).toLocaleString()}</td>
                  <td>{c.expiryDate}</td>
                  <td>{c.active ? 'Yes' : 'No'}</td>
                  <td>
                    <button type="button" className="staff-btn" onClick={() => openEdit(c)}>
                      Edit
                    </button>{' '}
                    <button
                      type="button"
                      className="staff-btn danger"
                      onClick={() => {
                        if (confirm(`Delete ${c.code}?`)) deleteMutation.mutate(c.id)
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="staff-modal-backdrop" onClick={() => setModal(false)}>
          <div className="staff-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editId ? 'Edit coupon' : 'New coupon'}</h3>
            <div className="staff-form-grid">
              <label>
                Code
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                />
              </label>
              <label>
                Discount %
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.discountPercent}
                  onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                />
              </label>
              <label>
                Minimum order (LKR)
                <input
                  type="number"
                  min={0}
                  value={form.minimumOrderValue ?? 0}
                  onChange={(e) => setForm({ ...form, minimumOrderValue: Number(e.target.value) })}
                />
              </label>
              <label>
                Expiry date
                <input
                  type="date"
                  value={form.expiryDate ?? ''}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />{' '}
                Active
              </label>
            </div>
            <div className="staff-modal-actions">
              <button
                type="button"
                className="staff-btn primary"
                disabled={!form.code || saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
              >
                Save
              </button>
              <button type="button" className="staff-btn" onClick={() => setModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
