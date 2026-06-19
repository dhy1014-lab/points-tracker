// src/components/FormField.jsx
export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 4 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '7px 10px',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius)', fontSize: 14,
  background: 'var(--surface)', color: 'var(--text)',
  outline: 'none',
}

export function Input(props) {
  return <input style={inputStyle} {...props} />
}

export function Select({ children, ...props }) {
  return (
    <select style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236b6860' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 28 }} {...props}>
      {children}
    </select>
  )
}

export function Row({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{children}</div>
}

export function ModalActions({ onCancel, onSave, saveLabel = 'Save' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: '1.25rem' }}>
      <button onClick={onCancel} style={{
        padding: '7px 14px', border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius)', background: 'none', fontSize: 13, color: 'var(--text)'
      }}>Cancel</button>
      <button onClick={onSave} style={{
        padding: '7px 16px', border: 'none', borderRadius: 'var(--radius)',
        background: 'var(--text)', color: '#fff', fontSize: 13, fontWeight: 500
      }}>{saveLabel}</button>
    </div>
  )
}

export function Badge({ children, color = 'blue' }) {
  const map = {
    blue: { bg: 'var(--accent-light)', color: 'var(--accent-text)' },
    green: { bg: 'var(--green-light)', color: 'var(--green-text)' },
    amber: { bg: 'var(--amber-light)', color: 'var(--amber-text)' },
    red: { bg: 'var(--red-light)', color: 'var(--red-text)' },
    gray: { bg: '#f3f2ef', color: 'var(--text-2)' },
  }
  const s = map[color] || map.blue
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: '2px 7px',
      borderRadius: 20, background: s.bg, color: s.color,
      whiteSpace: 'nowrap'
    }}>{children}</span>
  )
}

export function IconBtn({ onClick, title, children }) {
  return (
    <button onClick={onClick} title={title} style={{
      border: 'none', background: 'none', color: 'var(--text-3)',
      cursor: 'pointer', padding: '2px 4px', fontSize: 14, borderRadius: 4,
      lineHeight: 1
    }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
    >{children}</button>
  )
}
