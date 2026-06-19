// src/components/Cards.jsx
import { useState } from 'react'
import { add, update, remove } from '../lib/db'
import Modal from './Modal'
import { Field, Input, Select, Row, ModalActions, Badge, IconBtn } from './FormField'

const STATUS_COLOR = { Active: 'green', Canceling: 'amber', Closed: 'red', Pending: 'blue' }
const blank = () => ({ name: '', ecosystem: '', fee: '', renewal: '', status: 'Active', notes: '' })

function CardGrid({ cards, uid, readonly, onEdit }) {
  const daysUntil = (d) => d ? Math.round((new Date(d) - new Date()) / 86400000) : null

  if (cards.length === 0) return <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '1rem 0' }}>No cards</div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 8 }}>
      {cards.map(c => {
        const days = daysUntil(c.renewal)
        const renewalColor = days === null ? null : days < 0 ? 'red' : days <= 30 ? 'amber' : 'gray'
        return (
          <div key={c.id} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{c.name}</div>
                {c.ecosystem && <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{c.ecosystem}</div>}
              </div>
              <Badge color={STATUS_COLOR[c.status] || 'blue'}>{c.status}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {c.fee && <span style={{ fontSize: 12, color: 'var(--text-2)' }}>${c.fee}/yr</span>}
              {c.renewal && renewalColor && (
                <Badge color={renewalColor}>
                  {days < 0 ? 'Expired' : days === 0 ? 'Due today' : `${days}d to renewal`}
                </Badge>
              )}
            </div>
            {c.notes && <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>{c.notes}</div>}
            {!readonly && c._uid === uid && (
              <div style={{ display: 'flex', gap: 4 }}>
                <IconBtn onClick={() => onEdit(c)} title="Edit">✏️</IconBtn>
                <IconBtn onClick={() => remove(uid, 'cards', c.id)} title="Delete">🗑</IconBtn>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Cards({ uid, cards, readonly, showSections, myName, partnerName }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank())
  const [editId, setEditId] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const openAdd = () => { setForm(blank()); setEditId(null); setOpen(true) }
  const openEdit = (c) => { setForm({ name: c.name, ecosystem: c.ecosystem, fee: c.fee, renewal: c.renewal, status: c.status, notes: c.notes }); setEditId(c.id); setOpen(true) }

  const save = async () => {
    if (!form.name.trim()) return
    if (editId) await update(uid, 'cards', editId, form)
    else await add(uid, 'cards', form)
    setOpen(false)
  }

  const myCards = cards.filter(c => c._holder === myName)
  const partnerCards = cards.filter(c => c._holder === partnerName)

  const SectionHeader = ({ name, count }) => (
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, marginTop: 16 }}>
      {name} · {count} card{count !== 1 ? 's' : ''}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{cards.length} card{cards.length !== 1 ? 's' : ''}</span>
        {!readonly && (
          <button onClick={openAdd} style={{ padding: '6px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', background: 'none', fontSize: 13 }}>
            + Add card
          </button>
        )}
      </div>

      {cards.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)', fontSize: 13 }}>
          {readonly ? 'No cards added yet' : 'Add your first card to get started'}
        </div>
      )}

      {showSections ? (
        <>
          {myCards.length > 0 && <><SectionHeader name={myName} count={myCards.length} /><CardGrid cards={myCards} uid={uid} readonly={readonly} onEdit={openEdit} /></>}
          {partnerCards.length > 0 && <><SectionHeader name={partnerName} count={partnerCards.length} /><CardGrid cards={partnerCards} uid={uid} readonly={true} onEdit={openEdit} /></>}
        </>
      ) : (
        <CardGrid cards={cards} uid={uid} readonly={readonly} onEdit={openEdit} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit card' : 'Add card'}>
        <Field label="Card name"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Chase Sapphire Preferred" /></Field>
        <Row>
          <Field label="Ecosystem"><Input value={form.ecosystem} onChange={e => set('ecosystem', e.target.value)} placeholder="Chase UR" /></Field>
          <Field label="Annual fee ($)"><Input type="number" value={form.fee} onChange={e => set('fee', e.target.value)} placeholder="95" /></Field>
        </Row>
        <Row>
          <Field label="Renewal date"><Input type="date" value={form.renewal} onChange={e => set('renewal', e.target.value)} /></Field>
          <Field label="Status">
            <Select value={form.status} onChange={e => set('status', e.target.value)}>
              <option>Active</option><option>Canceling</option><option>Closed</option><option>Pending</option>
            </Select>
          </Field>
        </Row>
        <Field label="Notes / perks"><Input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="$50 travel credit, lounge access, etc." /></Field>
        <ModalActions onCancel={() => setOpen(false)} onSave={save} />
      </Modal>
    </div>
  )
}
