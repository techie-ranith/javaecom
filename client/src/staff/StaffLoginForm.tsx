import { useState } from 'react'
import type { FormEvent } from 'react'
import { LockKeyhole } from 'lucide-react'
import { authService, authStorage } from '../services/api'

type Props = {
  onSuccess: () => void
  className?: string
}

export function StaffLoginForm({ onSuccess, className = 'staff-login-form' }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await authService.login({ email, password })
      if (!data.success || !data.data) {
        setError(data.message || 'Sign in failed.')
        return
      }
      if (data.data.role !== 'ADMIN') {
        setError('Staff access is limited to store administrators.')
        return
      }
      authStorage.save(data.data)
      onSuccess()
    } catch {
      setError('Unable to sign in. Check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={className} onSubmit={onSubmit}>
      <label>
        <span>Work email</span>
        <input
          type="email"
          autoComplete="username"
          placeholder="admin@aurelia.test"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        <span>Password</span>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && (
        <p className="staff-login-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button-dark" type="submit" disabled={loading}>
        <LockKeyhole size={16} /> {loading ? 'Signing in…' : 'Staff sign in'}
      </button>
    </form>
  )
}
