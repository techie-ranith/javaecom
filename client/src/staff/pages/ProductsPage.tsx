import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { adminService } from '../../services/api'
import type { ProductDto, ProductRequest } from '../../types/admin'

const emptyProduct = (): ProductRequest => ({
  name: '',
  price: 0,
  stock: 0,
  brand: '',
  description: '',
  imageUrl: '',
  gender: 'Unisex',
  discountPercent: null,
  featured: false,
  categoryId: null,
})

function formatMoney(n: number) {
  return `LKR ${Number(n).toLocaleString()}`
}

export function ProductsPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<ProductRequest>(emptyProduct())

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const res = await adminService.products(false)
      return res.data.data ?? []
    },
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const res = await adminService.categories()
      return res.data.data ?? []
    },
  })

  const saveMutation = useMutation({
    mutationFn: () =>
      editId != null
        ? adminService.updateProduct(editId, form)
        : adminService.createProduct(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] })
      setModal(null)
      setEditId(null)
      setForm(emptyProduct())
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })

  const openCreate = () => {
    setForm(emptyProduct())
    setEditId(null)
    setModal('create')
  }

  const openEdit = (p: ProductDto) => {
    setEditId(p.id)
    setForm({
      name: p.name,
      price: Number(p.price),
      stock: p.stock,
      brand: p.brand ?? '',
      description: p.description ?? '',
      imageUrl: p.imageUrl ?? '',
      gender: p.gender ?? 'Unisex',
      discountPercent: p.discountPercent != null ? Number(p.discountPercent) : null,
      featured: p.featured,
      categoryId: p.categoryId,
    })
    setModal('edit')
  }

  if (isLoading) return <p className="staff-loading">Loading products…</p>

  return (
    <>
      <div className="staff-panel-box">
        <div className="staff-toolbar">
          <h2 style={{ margin: 0 }}>Products</h2>
          <button type="button" className="staff-btn primary" onClick={openCreate}>
            Add product
          </button>
        </div>
        <div className="staff-table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={p.stock < 5 ? { background: '#fff8e6' } : undefined}>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>{p.categoryName ?? '—'}</td>
                  <td>{formatMoney(Number(p.price))}</td>
                  <td>{p.stock}</td>
                  <td>{p.featured ? 'Yes' : 'No'}</td>
                  <td>{p.active ? 'Yes' : 'No'}</td>
                  <td>
                    <button type="button" className="staff-btn" onClick={() => openEdit(p)}>
                      Edit
                    </button>{' '}
                    {p.active && (
                      <button
                        type="button"
                        className="staff-btn danger"
                        onClick={() => {
                          if (confirm(`Deactivate ${p.name}?`)) deleteMutation.mutate(p.id)
                        }}
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="staff-modal-backdrop" onClick={() => setModal(null)}>
          <div className="staff-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modal === 'create' ? 'New product' : 'Edit product'}</h3>
            <div className="staff-form-grid">
              <label>
                Name
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Brand
                <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </label>
              <label>
                Price (LKR)
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price || ''}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                />
              </label>
              <label>
                Discount %
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.discountPercent ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountPercent: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Gender
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option>Women</option>
                  <option>Men</option>
                  <option>Unisex</option>
                </select>
              </label>
              <label>
                Category
                <select
                  value={form.categoryId ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categoryId: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                >
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Image URL
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />{' '}
                Featured
              </label>
            </div>
            <div className="staff-modal-actions">
              <button
                type="button"
                className="staff-btn primary"
                disabled={saveMutation.isPending || !form.name}
                onClick={() => saveMutation.mutate()}
              >
                Save
              </button>
              <button type="button" className="staff-btn" onClick={() => setModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
