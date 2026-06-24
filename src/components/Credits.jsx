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
  used: false, usedAt: null, useNote: '', resetDate: '', notes: '', usageHistory: []
})

// Given a cadence and the date last used, determine if a new period has started
function isNewPeriod(cadence, usedAt) {
  if (!usedAt) return false
  const used = new Date(usedAt)
  const now = new Date()

  switch (cadence) {
    case 'Monthly':
      return now.getFullYear() > used.getFullYear() || now.getMonth() > used.getMonth()
    case 'Quarterly': {
      const usedQ = Math.floor(used.getMonth() / 3) + used.getFullYear() * 4
      const nowQ = Math.floor(now.getMonth() / 3) + now.getFullYear() * 4
      return nowQ > usedQ
    }
    case 'Semi-annual': {
      const usedH = Math.floor(used.getMonth() / 6) + used.getFullYear() * 2
      const nowH = Math.floor(now.getMonth() / 6) + now.getFullYear() * 2
      return nowH > usedH
    }
    case 'Annual':
      return now.getFullYear() > used.getFullYear()
    case 'One-time':
      return false
    default:
      return false
  }
}

// Compute next reset date string from cadence + last used date (or today)
function nextResetDate(cadence, fromDate) {
  const d = fromDate ? new Date(fromDate) : new Date()
  switch (cadence) {
    case 'Monthly':
      return new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().slice(0, 10)
    case 'Quarterly':
      return new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3 + 3, 1).toISOString().slice(0, 10)
    case 'Semi-annual':
      return new Date(d.getFullYear(), Math.floor(d.getMonth() / 6) * 6 + 6, 1).toISOString().slice(0, 10)
    case 'Annual':
      return new Date(d.getFullYear() + 1, 0, 1).toISOString().slice(0, 10)
    default:
      return ''
  }
}

function cadenceDaysLeft(resetDate) {
  if (!resetDate) return null
  return Math.round((new Date(resetDate) - new Date()) / 86400000)
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Check and auto-reset a credit if its period has rolled over
function shouldAutoReset(credit) {
  if (!credit.used || credit.cadence === 'One-time') return false
  return isNewPeriod(credit.cadence, credit.usedAt)
}

function CreditItem({ c, uid, readonly, onEdit, onMarkUsed, onUnmark, onViewHistory, listeners, dragDisabled }) {
  const days = cadenceDaysLeft(c.resetDate)
  const urgent = days !== null && days <= 14 && days >= 0 && !c.used

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem',
      opacity: c.used ? 0.6 : 1, transition: 'opacity 0.2s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flex: 1, minWidth: 0 }}>
          {!readonly && !dragDisabled && <DragHandle listeners={listeners} />}
          <div style={{ flex: 1, minWidth: 0 }}>
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

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {c.resetDate && (
          <Badge color={urgent ? 'red' : days < 0 ? 'gray' : 'gray'}>
            {days < 0 ? `Reset ${Math.abs(days)}d ago` : days === 0 ? 'Resets today' : `Resets in ${days}d`}
          </Badge>
        )}
        {c.used && <Badge color="green">✓ Used {c.usedAt ? formatDate(c.usedAt) : ''}</Badge>}
      </div>

      {/* Usage note for current period */}
      {c.used && c.useNote && (
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6, fontStyle: 'italic' }}>
          "{c.useNote}"
        </div>
      )}

      {c.notes && <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>{c.notes}</div>}

      {/* Usage history link */}
      {(c.usageHistory || []).length > 0 && (
        <button onClick={() => onViewHistory(c)} style={{
          fontSize: 11, color: 'var(--text-3)', background: 'none', border: 'none',
          cursor: 'pointer', padding: 0, marginBottom: 8, textDecoration: 'underline'
        }}>
          {c.usageHistory.length} past use{c.usageHistory.length !== 1 ? 's' : ''}
        </button>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {!readonly && c._uid === uid && (
          <>
            {!c.used ? (
              <button onClick={() => onMarkUsed(c)} style={{
                fontSize: 12, padding: '4px 10px', borderRadius: 6,
                border: '1px solid var(--border-strong)',
                background: 'none', color: 'var(--text)', cursor: 'pointer'
              }}>Mark used</button>
            ) : (
              <button onClick={() => onUnmark(c)} style={{
                fontSize: 12, padding: '4px 10px', borderRadius: 6,
                border: '1px solid var(--border-strong)',
                background: 'var(--green-light)', color: 'var(--green-text)', cursor: 'pointer'
              }}>✓ Used — undo</button>
            )}
            <IconBtn onClick={() => onEdit(c)} title="Edit">✏️</IconBtn>
            <IconBtn onClick={() => remove(uid, 'credits', c.id)} title="Delete">🗑</IconBtn>
          </>
        )}
      </div>
    </div>
  )
}

function CreditGrid({ credits, uid, readonly, onEdit, onMarkUsed, onUnmark, onViewHistory, onReorder }) {
  if (credits.length === 0) return <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '1rem 0' }}>No credits</div>
  const dragDisabled = readonly || credits.some(c => c._uid !== uid)
  return (
    <SortableContainer items={credits} onReorder={onReorder} disabled={dragDisabled}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 8 }}>
        {credits.map(c => (
          <SortableItem key={c.id} id={c.id} disabled={dragDisabled}>
            {(listeners) => (
              <CreditItem
                c={c} uid={uid} readonly={readonly}
                onEdit={onEdit} onMarkUsed={onMarkUsed} onUnmark={onUnmark}
                onViewHistory={onViewHistory} listeners={listeners} dragDisabled={dragDisabled}
              />
            )}
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
  const [useNoteModal, setUseNoteModal] = useState(null) // credit being marked used
  const [useNoteText, setUseNoteText] = useState('')
  const [historyModal, setHistoryModal] = useState(null) // credit whose history to view

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const openAdd = () => { setForm(blank()); setEditId(null); setOpen(true) }
  const openEdit = (c) => {
    setForm({
      name: c.name, cardName: c.cardName || '', amount: c.amount,
      cadence: c.cadence, category: c.category, used: c.used || false,
      usedAt: c.usedAt || null, useNote: c.useNote || '',
      resetDate: c.resetDate || '', notes: c.notes || '',
      usageHistory: c.usageHistory || []
    })
    setEditId(c.id); setOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) return
    // Auto-compute reset date from cadence if not set
    const resetDate = form.resetDate || (form.cadence !== 'One-time' ? nextResetDate(form.cadence) : '')
    if (editId) await update(uid, 'credits', editId, { ...form, resetDate })
    else await add(uid, 'credits', { ...form, resetDate })
    setOpen(false)
  }

  // Check all credits for auto-reset on render
  const creditsWithAutoReset = credits.map(c => {
    if (shouldAutoReset(c)) {
      // Fire-and-forget update — reset the credit
      update(uid, 'credits', c.id, {
        used: false,
        usedAt: null,
        useNote: '',
        resetDate: nextResetDate(c.cadence, c.usedAt || new Date().toISOString())
      })
      return { ...c, used: false, useNote: '' } // optimistic UI
    }
    return c
  })

  const openMarkUsed = (c) => {
    setUseNoteText('')
    setUseNoteModal(c)
  }

  const confirmMarkUsed = async () => {
    if (!useNoteModal) return
    const c = useNoteModal
    const now = new Date().toISOString()
    const historyEntry = {
      date: now,
      note: useNoteText.trim(),
      amount: c.amount
    }
    const history = [...(c.usageHistory || []), historyEntry]
    await update(uid, 'credits', c.id, {
      used: true,
      usedAt: now,
      useNote: useNoteText.trim(),
      usageHistory: history,
      resetDate: c.resetDate || nextResetDate(c.cadence)
    })
    setUseNoteModal(null)
    setUseNoteText('')
  }

  const unmarkUsed = async (c) => {
    await update(uid, 'credits', c.id, { used: false, usedAt: null, useNote: '' })
  }

  const handleReorder = async (newOrder) => {
    await reorder(uid, 'credits', newOrder.map((item, i) => ({ id: item.id, sortOrder: i })))
  }

  const mine = creditsWithAutoReset.filter(c => c._holder === myName)
  const theirs = creditsWithAutoReset.filter(c => c._holder === partnerName)

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

  const allTotal = totalValue(creditsWithAutoReset)
  const allUsed = usedValue(creditsWithAutoReset)

  const gridProps = { uid, readonly, onEdit: openEdit, onMarkUsed: openMarkUsed, onUnmark: unmarkUsed, onViewHistory: setHistoryModal, onReorder: handleReorder }

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
          {readonly ? 'No credits tracked' : 'Add a card in the Cards tab to auto-populate credits, or add them manually here'}
        </div>
      )}

      {showSections ? (
        <>
          {mine.length > 0 && <><SectionHeader name={myName} list={mine} /><CreditGrid credits={mine} {...gridProps} /></>}
          {theirs.length > 0 && <><SectionHeader name={partnerName} list={theirs} /><CreditGrid credits={theirs} {...{ ...gridProps, readonly: true }} /></>}
        </>
      ) : (
        <CreditGrid credits={creditsWithAutoReset} {...gridProps} />
      )}

      {/* Add / Edit modal */}
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
        <Field label="Next reset date"><Input type="date" value={form.resetDate} onChange={e => set('resetDate', e.target.value)} /></Field>
        <Field label="Notes / how to use"><Input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Use on Uber/Uber Eats, $15/mo + $35 Dec" /></Field>
        <ModalActions onCancel={() => setOpen(false)} onSave={save} />
      </Modal>

      {/* Mark used + note modal */}
      <Modal open={!!useNoteModal} onClose={() => setUseNoteModal(null)} title="Mark as used">
        {useNoteModal && (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>
              {useNoteModal.name} · <strong>${parseFloat(useNoteModal.amount || 0).toLocaleString()}</strong>
            </p>
            <Field label="How did you use it? (optional)">
              <Input
                value={useNoteText}
                onChange={e => setUseNoteText(e.target.value)}
                placeholder="Booked Hyatt Tokyo, Jan 15-17"
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') confirmMarkUsed() }}
              />
            </Field>
            <ModalActions onCancel={() => setUseNoteModal(null)} onSave={confirmMarkUsed} saveLabel="Mark used" />
          </>
        )}
      </Modal>

      {/* Usage history modal */}
      <Modal open={!!historyModal} onClose={() => setHistoryModal(null)} title={`Usage history — ${historyModal?.name}`}>
        {historyModal && (
          <div>
            {(historyModal.usageHistory || []).length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No history yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...(historyModal.usageHistory || [])].reverse().map((entry, i) => (
                  <div key={i} style={{
                    padding: '10px 12px', borderRadius: 8,
                    background: 'var(--bg)', border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{formatDate(entry.date)}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-2)' }}>${parseFloat(entry.amount || 0).toLocaleString()}</span>
                    </div>
                    {entry.note ? (
                      <div style={{ fontSize: 13, color: 'var(--text-2)', fontStyle: 'italic' }}>"{entry.note}"</div>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>No note</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button onClick={() => setHistoryModal(null)} style={{
                padding: '7px 16px', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius)', background: 'none', fontSize: 13, cursor: 'pointer'
              }}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
