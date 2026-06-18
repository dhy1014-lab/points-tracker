// src/components/Dashboard.jsx
import { Badge } from './FormField'

export default function Dashboard({ cards, ecosystems, opportunities }) {
  const daysUntil = (d) => d ? Math.round((new Date(d) - new Date()) / 86400000) : null

  const totalPoints = ecosystems.reduce((a, e) => a + (parseInt(e.balance) || 0), 0)
  const totalValue = ecosystems.reduce((a, e) => a + ((parseInt(e.balance) || 0) * (parseFloat(e.cpp) || 0) / 100), 0)
  const totalFees = cards.filter(c => c.status === 'Active').reduce((a, c) => a + (parseFloat(c.fee) || 0), 0)
  const activeCards = cards.filter(c => c.status === 'Active').length

  const upcomingRenewals = cards
    .filter(c => c.renewal)
    .map(c => ({ ...c, days: daysUntil(c.renewal) }))
    .filter(c => c.days !== null && c.days >= -7 && c.days <= 90)
    .sort((a, b) => a.days - b.days)
    .slice(0, 6)

  const alerts = []
  cards.forEach(c => {
    const d = daysUntil(c.renewal)
    if (d !== null && d >= 0 && d <= 45) alerts.push({ color: d <= 14 ? 'red' : 'amber', msg: `${c.name} renews in ${d} day${d !== 1 ? 's' : ''} — $${c.fee || 0} fee` })
  })
  opportunities.forEach(o => {
    const d = daysUntil(o.deadline)
    if (d !== null && d >= 0 && d <= 14 && !['Bonus earned', 'Passed'].includes(o.status))
      alerts.push({ color: 'red', msg: `${o.name}: deadline in ${d} day${d !== 1 ? 's' : ''}` })
  })

  const openOpps = opportunities.filter(o => ['Considering', 'Applied', 'Active — meeting spend'].includes(o.status)).slice(0, 5)

  const metric = (label, value, sub) => (
    <div style={{ background: '#f3f2ef', borderRadius: 8, padding: '0.875rem 1rem' }}>
      <div style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 500 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{sub}</div>}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
        {metric('Total points', totalPoints.toLocaleString())}
        {metric('Est. value', '$' + Math.round(totalValue).toLocaleString(), 'across all programs')}
        {metric('Active cards', activeCards)}
        {metric('Annual fees', '$' + Math.round(totalFees).toLocaleString() + '/yr')}
      </div>

      {alerts.length > 0 && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: 8, fontSize: 13,
              background: a.color === 'red' ? 'var(--red-light)' : 'var(--amber-light)',
              color: a.color === 'red' ? 'var(--red-text)' : 'var(--amber-text)'
            }}>⚠ {a.msg}</div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Upcoming renewals</div>
          {upcomingRenewals.length === 0
            ? <div style={{ fontSize: 13, color: 'var(--text-3)' }}>No renewals in the next 90 days</div>
            : upcomingRenewals.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                  {c.fee && <div style={{ fontSize: 11, color: 'var(--text-2)' }}>${c.fee}/yr</div>}
                </div>
                <Badge color={c.days <= 7 ? 'red' : c.days <= 30 ? 'amber' : 'gray'}>
                  {c.days < 0 ? 'Expired' : c.days === 0 ? 'Today' : `${c.days}d`}
                </Badge>
              </div>
            ))
          }
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Open opportunities</div>
          {openOpps.length === 0
            ? <div style={{ fontSize: 13, color: 'var(--text-3)' }}>No open opportunities</div>
            : openOpps.map(o => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{o.name}</div>
                  {o.bonus && <div style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{parseInt(o.bonus).toLocaleString()} pts</div>}
                </div>
                <Badge color={{ Considering: 'blue', Applied: 'blue', 'Active — meeting spend': 'amber' }[o.status] || 'blue'}>{o.status}</Badge>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
