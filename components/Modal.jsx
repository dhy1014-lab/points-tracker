// src/components/Modal.jsx
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem'
      }}
    >
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        padding: '1.5rem', width: '100%', maxWidth: 460,
        maxHeight: '90vh', overflowY: 'auto',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 20, color: 'var(--text-3)', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
