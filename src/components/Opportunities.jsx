// src/components/Opportunities.jsx
import { useState } from 'react'
import { add, update, remove } from '../lib/db'
import Modal from './Modal'
import { Field, Input, Select, Row, ModalActions, Badge, IconBtn } from './FormField'

const STATUS_COLOR = {
  Considering: 'blue', Applied: 'blue',
  'Active — meeting spend': 'amber',
  'Bonus earned': 'green', Passed: 'gray'
}

const blank = () => ({ name: '', bonus: '', spend: '', deadline: '', status: 'Considering', ecosystem: '' })

export default function Opportunities({ uid, opportunities, readonly }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank())
  const [editId, setEditId] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openAdd = () => { setForm(blank()); setEditId(null); setOpen(true) }
  const openEdit = (o) => {
    setForm({ name: o.name, bonus: o.bonus, spend: o.spend, deadline: o.deadline, status: o.status, ecosystem: o.ecosystem })
    setEditId(o.id); setOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) return
    if (editId) await update(uid, 'opportunities', editId, form)
    else await add(uid, 'opportunities', form)
    setOpen(false)
  }

  const daysUntil = (d) => d ? Math.round((new Date(d) - new Date()) / 86400000) : null

  const active = opportunities.filter(o => !['Bonus earned', 'Passed'].includes(o.status))
  const done = opportunities.filter(o => ['Bonus earned', 'Passed'].includes(o.status))

  const renderTable = (rows) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          {['Offer', 'Ecosystem', 'Bonus', 'Spend req.', 'Deadline', 'Status', ''].map(h => (
            <th key={h} style={{ textAlign: 'left', padding: '6px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(o => {
          const d = daysUntil(o.deadline)
          const deadLabel = d === null ? '—' : d < 0 ? 'Expired' : d === 0 ? 'Today' : `${d}d`
          const deadColor = d === null ? null : d < 0 ? 'red' : d <= 7 ? 'red' : d <= 30 ? 'amber' : null
          return (
            <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px 10px', fontWeight: 500 }}>{o.name}</td>
              <td style={{ padding: '10px 10px', color: 'var(--text-2)' }}>{o.ecosystem || '—'}</td>
              <td style={{ padding: '10px 10px', fontFamily: 'var(--mono)' }}>
                {o.bonus ? parseInt(o.bonus).toLocaleString() : '—'}
              </td>
              <td style={{ padding: '10px 10px', fontFamily: 'var(--mono)' }}>
                {o.spend ? '$' + parseInt(o.spend).toLocaleString() : '—'}
              </td>
              <td style={{ padding: '10px 10px' }}>
                {deadColor ? <Badge color={deadColor}>{deadLabel}</Badge> : <span style={{ color: 'var(--text-2)' }}>{deadLabel}</span>}
              </td>
              <td style={{ padding: '10px 10px' }}>
                <Badge color={STATUS_COLOR[o.status] || 'blue'}>{o.status}</Badge>
              </td>
              <td style={{ padding: '10px 10px' }}>
                {!readonly && (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <IconBtn onClick={() => openEdit(o)} title="Edit">✏️</IconBtn>
                    <IconBtn onClick={() => remove(uid, 'opportunities', o.id)} title="Delete">🗑</IconBtn>
                  </div>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{opportunities.length} tracked</span>
        {!readonly && (
          <button onClick={openAdd} style={{
            padding: '6px 12px', border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius)', background: 'none', fontSize: 13
          }}>+ Add opportunity</button>
        )}
      </div>

      {opportunities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)', fontSize: 13 }}>
          {readonly ? 'No opportunities tracked' : 'Track new card bonuses and limited-time offers'}
        </div>
      )}

      {active.length > 0 && (
        <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active</div>
          {renderTable(active)}
        </div>
      )}

      {done.length > 0 && (
        <div style={{ overflowX: 'auto', opacity: 0.7 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Done</div>
          {renderTable(done)}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit opportunity' : 'Add opportunity'}>
        <Field label="Offer name"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Amex Gold welcome bonus" /></Field>
        <Row>
          <Field label="Bonus (points)"><Input type="number" value={form.bonus} onChange={e => set('bonus', e.target.value)} placeholder="60000" /></Field>
          <Field label="Spend required ($)"><Input type="number" value={form.spend} onChange={e => set('spend', e.target.value)} placeholder="4000" /></Field>
        </Row>
        <Row>
          <Field label="Deadline"><Input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} /></Field>
          <Field label="Ecosystem"><Input value={form.ecosystem} onChange={e => set('ecosystem', e.target.value)} placeholder="Amex MR" /></Field>
        </Row>
        <Field label="Status">
          <Select value={form.status} onChange={e => set('status', e.target.value)}>
            <option>Considering</option>
            <option>Applied</option>
            <option>Active — meeting spend</option>
            <option>Bonus earned</option>
            <option>Passed</option>
          </Select>
        </Field>
        <ModalActions onCancel={() => setOpen(false)} onSave={save} />
      </Modal>
    </div>
  )
}
