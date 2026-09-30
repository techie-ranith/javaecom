import { useNavigate } from 'react-router-dom'
import '../App.css'
import { StaffLoginForm } from './StaffLoginForm'
import './staff.css'

export function StaffLoginPage() {
  const navigate = useNavigate()
  return (
    <div className="staff-login-page">
      <div className="staff-login-card">
        <p className="eyebrow gold">STAFF ACCESS</p>
        <h1>Store team sign in</h1>
        <p style={{ fontSize: 13, color: '#b9b0a3', marginBottom: 24 }}>
          For Aurelia staff managing inventory, orders, and the collection.
        </p>
        <StaffLoginForm onSuccess={() => navigate('/staff/dashboard')} />
      </div>
    </div>
  )
}
