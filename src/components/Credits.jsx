// src/components/Credits.jsx
import { useState } from 'react'
import { add, update, remove, reorder } from '../lib/db'
import Modal from './Modal'
import { Field, Input, Select, Row, ModalActions, Badge, IconBtn } from './FormField'
import { SortableContainer, SortableItem, DragHandle } from './SortableList'

const CADENCE_OPTIONS = ['Monthly', 'Quarterly', 'Semi-annual', 'Annual', 'One-time']
const CATEGORY_OPTIONS = ['Travel', 'Hotel', 'Dining', 'Shopping', 'Streaming/Digital', 'Airline incidental', 'Rideshare', 'Other']
const CATEGORY_COLOR = {
  Travel: 'blue', Hotel: 'green', Dining: 'amber', Shopping: 'gray',
  'Streaming/Digital': 'blue', 'Airline incidental': 'amber', Rideshare: 'gray', Other: 'gray'
}

const blank = () => ({
  name: '', cardName: '', amount: '', cadence: 'Annual', category: 'Travel',
  used: false, resetDate: '', notes: ''
})

function cadenceDaysLeft(resetDate) {
  if (!resetDate) return null
  return Math.round((new Date(resetDate) - new Date()) / 86400000)
}

function CreditItem({ c, uid, readonly, onEdit, onToggleUsed, listeners, dragDisabled }) {
  const days = cadenceDaysLeft(c.resetDate)
  const urgent = days !== null && days <= 14 && days >= 0 && !c.used

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem',
      opacity: c.used ? 0.55 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          {!readonly && !dragDisabled && <DragHandle listeners={listeners} />}
          <div>
            <div style={{ fontWeight: 500, fontSize: 14, textDecoration: c.used ? 'line-through' : 'none' }}>{c.name}</div>
            {c.cardName && <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{c.cardName}</div>}
          </div>
        </div>
        <Badge color={CATEGORY_COLOR[c.category] || 'gray'}>{c.category}</Badge>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 500 }}>
          ${parseFloat(c.amount || 0).toLocaleString()}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.cadence}</span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {c.resetDate && (
          <Badge color={urgent ? 'red' : 'gray'}>
            {days < 0 ? 'Reset overdue' : days === 0 ? 'Resets today' : `Resets in ${days}d`}
          </Badge>
        )}
        {c.used && <Badge color="green">✓ Used this period</Badge>}
      </div>

      {c.notes && <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>{c.notes}</div>}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {!readonly && c._uid === uid && (
          <>
            <button onClick={() => onToggleUsed(c)} style={{
              fontSize: 12, padding: '4px 10px', borderRadius: 6,
              border: '1px solid var(--border-strong)',
              background: c.used ? 'var(--green-light)' : 'none',
              color: c.used ? 'var(--green-text)' : 'var(--text)',
              cursor: 'pointer'
            }}>{c.used ? '✓ Used' : 'Mark used'}</button>
            <IconBtn onClick={() => onEdit(c)} title="Edit">✏️</IconBtn>
            <IconBtn onClick={() => remove(uid, 'credits', c.id)} title="Delete">🗑</IconBtn>
          </>
        )}
      </div>
    </div>
  )
}

function CreditGrid({ credits, uid, readonly, onEdit, onToggleUsed, onReorder }) {
  if (credits.length === 0) return <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '1rem 0' }}>No credits</div>
  const dragDisabled = readonly || credits.some(c => c._uid !== uid)
  return (
    <SortableContainer items={credits} onReorder={onReorder} disabled={dragDisabled}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 8 }}>
        {credits.map(c => (
          <SortableItem key={c.id} id={c.id} disabled={dragDisabled}>
            {(listeners) => <CreditItem c={c} uid={uid} readonly={readonly} onEdit={onEdit} onToggleUsed={onToggleUsed} listeners={listeners} dragDisabled={dragDisabled} />}
          </SortableItem>
        ))}
      </div>
    </SortableContainer>
  )
}

export default function Credits({ uid, credits, readonly, showSections, myName, partnerName }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank())
  const [editId, setEditId] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const openAdd = () => { setForm(blank()); setEditId(null); setOpen(true) }
  const openEdit = (c) => {
    setForm({
      name: c.name, cardName: c.cardName, amount: c.amount, cadence: c.cadence,
      category: c.category, used: c.used || false, resetDate: c.resetDate || '', notes: c.notes
    })
    setEditId(c.id); setOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) return
    if (editId) await update(uid, 'credits', editId, form)
    else await add(uid, 'credits', form)
    setOpen(false)
  }

  const toggleUsed = async (c) => {
    await update(uid, 'credits', c.id, { used: !c.used })
  }

  const handleReorder = async (newOrder) => {
    await reorder(uid, 'credits', newOrder.map((item, i) => ({ id: item.id, sortOrder: i })))
  }

  const mine = credits.filter(c => c._holder === myName)
  const theirs = credits.filter(c => c._holder === partnerName)

  const totalValue = (list) => list.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
  const usedValue = (list) => list.filter(c => c.used).reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)

  const SectionHeader = ({ name, list }) => {
    const total = totalValue(list)
    const used = usedValue(list)
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, marginTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {name} · {list.length} credit{list.length !== 1 ? 's' : ''}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
          <span style={{ color: 'var(--green-text)', fontWeight: 500 }}>${used.toLocaleString()}</span> used of <strong style={{ color: 'var(--text)' }}>${total.toLocaleString()}</strong>
        </div>
      </div>
    )
  }

  const allTotal = totalValue(credits)
  const allUsed = usedValue(credits)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
            <strong style={{ color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 14 }}>${allTotal.toLocaleString()}</strong> tracked
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
            <strong style={{ color: 'var(--green-text)', fontFamily: 'var(--mono)', fontSize: 14 }}>${allUsed.toLocaleString()}</strong> used
          </span>
        </div>
        {!readonly && (
          <button onClick={openAdd} style={{ padding: '6px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', background: 'none', fontSize: 13 }}>
            + Add credit
          </button>
        )}
      </div>

      {credits.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)', fontSize: 13 }}>
          {readonly ? 'No credits tracked' : 'Track card credits like travel, hotel, dining, or shopping credits'}
        </div>
      )}

      {showSections ? (
        <>
          {mine.length > 0 && <><SectionHeader name={myName} list={mine} /><CreditGrid credits={mine} uid={uid} readonly={readonly} onEdit={openEdit} onToggleUsed={toggleUsed} onReorder={handleReorder} /></>}
          {theirs.length > 0 && <><SectionHeader name={partnerName} list={theirs} /><CreditGrid credits={theirs} uid={uid} readonly={true} onEdit={openEdit} onToggleUsed={toggleUsed} onReorder={handleReorder} /></>}
        </>
      ) : (
        <CreditGrid credits={credits} uid={uid} readonly={readonly} onEdit={openEdit} onToggleUsed={toggleUsed} onReorder={handleReorder} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit credit' : 'Add credit'}>
        <Field label="Credit name"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="$200 Annual Travel Credit" /></Field>
        <Row>
          <Field label="Card"><Input value={form.cardName} onChange={e => set('cardName', e.target.value)} placeholder="Amex Platinum" /></Field>
          <Field label="Amount ($)"><Input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="200" /></Field>
        </Row>
        <Row>
          <Field label="Cadence">
            <Select value={form.cadence} onChange={e => set('cadence', e.target.value)}>
              {CADENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </Select>
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORY_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </Select>
          </Field>
        </Row>
        <Field label="Next reset date (optional)"><Input type="date" value={form.resetDate} onChange={e => set('resetDate', e.target.value)} /></Field>
        <Field label="Notes"><Input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Use on Uber/Uber Eats, $15/mo + $35 Dec" /></Field>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 4 }}>
          <input type="checkbox" id="used-checkbox" checked={form.used} onChange={e => set('used', e.target.checked)} />
          <label htmlFor="used-checkbox" style={{ fontSize: 13, color: 'var(--text-2)' }}>Already used this period</label>
        </div>
        <ModalActions onCancel={() => setOpen(false)} onSave={save} />
      </Modal>
    </div>
  )
}
