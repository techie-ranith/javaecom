import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { adminService } from '../../services/api'
import type { CategoryDto, CategoryRequest } from '../../types/admin'

export function CategoriesPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<CategoryRequest>({ name: '', description: '' })

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const res = await adminService.categories()
      return res.data.data ?? []
    },
  })

  const saveMutation = useMutation({
    mutationFn: () =>
      editId != null
        ? adminService.updateCategory(editId, form)
        : adminService.createCategory(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] })
      setModal(false)
      setEditId(null)
      setForm({ name: '', description: '' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  })

  const openEdit = (c: CategoryDto) => {
    setEditId(c.id)
    setForm({ name: c.name, description: c.description ?? '' })
    setModal(true)
  }

  if (isLoading) return <p className="staff-loading">Loading categories…</p>

  return (
    <>
      <div className="staff-panel-box">
        <div className="staff-toolbar">
          <h2 style={{ margin: 0 }}>Categories</h2>
          <button
            type="button"
            className="staff-btn primary"
            onClick={() => {
              setEditId(null)
              setForm({ name: '', description: '' })
              setModal(true)
            }}
          >
            Add category
          </button>
        </div>
        <div className="staff-table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.description}</td>
                  <td>
                    <button type="button" className="staff-btn" onClick={() => openEdit(c)}>
                      Edit
                    </button>{' '}
                    <button
                      type="button"
                      className="staff-btn danger"
                      onClick={() => {
                        if (confirm(`Delete ${c.name}?`)) deleteMutation.mutate(c.id)
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
            <h3>{editId ? 'Edit category' : 'New category'}</h3>
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
                Description
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
            </div>
            <div className="staff-modal-actions">
              <button
                type="button"
                className="staff-btn primary"
                disabled={!form.name || saveMutation.isPending}
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
