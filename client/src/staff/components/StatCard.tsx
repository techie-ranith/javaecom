export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="staff-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
