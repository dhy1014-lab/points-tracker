// src/components/Cards.jsx
import { useState, useRef, useEffect } from 'react'
import { add, update, remove, reorder } from '../lib/db'
import { searchCards, getCardByName } from '../lib/cardCredits'
import Modal from './Modal'
import { Field, Input, Select, Row, ModalActions, Badge, IconBtn } from './FormField'
import { SortableContainer, SortableItem, DragHandle } from './SortableList'

const STATUS_COLOR = { Active: 'green', Canceling: 'amber', Closed: 'red', Pending: 'blue' }
const blank = () => ({ name: '', ecosystem: '', fee: '', renewal: '', status: 'Active', notes: '', group: 'Personal' })

function CardItem({ c, uid, readonly, onEdit, listeners, dragDisabled }) {
  const daysUntil = (d) => d ? Math.round((new Date(d) - new Date()) / 86400000) : null
  const days = daysUntil(c.renewal)
  const renewalColor = days === null ? null : days < 0 ? 'red' : days <= 30 ? 'amber' : 'gray'

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          {!readonly && !dragDisabled && <DragHandle listeners={listeners} />}
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{c.name}</div>
            {c.ecosystem && <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{c.ecosystem}</div>}
          </div>
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
}

function CardGrid({ cards, uid, readonly, onEdit, onReorder }) {
  if (cards.length === 0) return <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '1rem 0' }}>No cards</div>
  const dragDisabled = readonly || cards.some(c => c._uid !== uid)
  return (
    <SortableContainer items={cards} onReorder={onReorder} disabled={dragDisabled}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 8 }}>
        {cards.map(c => (
          <SortableItem key={c.id} id={c.id} disabled={dragDisabled}>
            {(listeners) => <CardItem c={c} uid={uid} readonly={readonly} onEdit={onEdit} listeners={listeners} dragDisabled={dragDisabled} />}
          </SortableItem>
        ))}
      </div>
    </SortableContainer>
  )
}

// Autocomplete input for card name
function CardNameInput({ value, onChange, onSelectCard }) {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const wrapRef = useRef(null)

  useEffect(() => {
    const results = searchCards(value)
    setSuggestions(results)
    setHighlightIdx(-1)
  }, [value])

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && highlightIdx >= 0) { e.preventDefault(); selectSuggestion(suggestions[highlightIdx]) }
    if (e.key === 'Escape') setShowSuggestions(false)
  }

  const selectSuggestion = (card) => {
    onChange(card.name)
    setShowSuggestions(false)
    onSelectCard(card)
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <Input
        value={value}
        onChange={e => { onChange(e.target.value); setShowSuggestions(true) }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder="Chase Sapphire Reserve"
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: 'var(--surface)', border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden', marginTop: 4
        }}>
          {suggestions.map((card, i) => (
            <div
              key={card.name}
              onMouseDown={() => selectSuggestion(card)}
              style={{
                padding: '8px 12px', cursor: 'pointer', fontSize: 13,
                background: i === highlightIdx ? 'var(--bg)' : 'transparent',
                borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none'
              }}
              onMouseEnter={() => setHighlightIdx(i)}
            >
              <div style={{ fontWeight: 500 }}>{card.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>
                {card.issuer} · {card.credits.length} credit{card.credits.length !== 1 ? 's' : ''} known
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Cards({ uid, cards, readonly, showSections, myName, partnerName, onAddCredits }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank())
  const [editId, setEditId] = useState(null)
  const [pendingCredits, setPendingCredits] = useState(null) // { cardName, credits[] }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const openAdd = () => { setForm(blank()); setEditId(null); setPendingCredits(null); setOpen(true) }
  const openEdit = (c) => {
    setForm({ name: c.name, ecosystem: c.ecosystem, fee: c.fee, renewal: c.renewal, status: c.status, notes: c.notes, group: c.group || 'Personal' })
    setEditId(c.id); setPendingCredits(null); setOpen(true)
  }

  const handleSelectCard = (card) => {
    if (card.credits && card.credits.length > 0) {
      setPendingCredits({ cardName: card.name, credits: card.credits })
    } else {
      setPendingCredits(null)
    }
  }

  const save = async () => {
    if (!form.name.trim()) return
    if (editId) {
      await update(uid, 'cards', editId, form)
    } else {
      await add(uid, 'cards', form)
      // If known card selected with credits, offer to add them
      const match = getCardByName(form.name)
      if (match && match.credits.length > 0 && onAddCredits) {
        setPendingCredits({ cardName: form.name, credits: match.credits })
        setOpen(false)
        return
      }
    }
    setOpen(false)
    setPendingCredits(null)
  }

  const confirmAddCredits = async () => {
    if (pendingCredits && onAddCredits) {
      await onAddCredits(pendingCredits.cardName, pendingCredits.credits)
    }
    setPendingCredits(null)
  }

  const handleReorder = async (newOrder) => {
    await reorder(uid, 'cards', newOrder.map((item, i) => ({ id: item.id, sortOrder: i })))
  }

  const myCards = cards.filter(c => c._holder === myName)
  const partnerCards = cards.filter(c => c._holder === partnerName)

  const groupBy = (list) => {
    const groups = {}
    list.forEach(c => {
      const g = c.group || 'Personal'
      if (!groups[g]) groups[g] = []
      groups[g].push(c)
    })
    return groups
  }

  const SectionHeader = ({ name, count }) => (
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, marginTop: 16 }}>
      {name} · {count} card{count !== 1 ? 's' : ''}
    </div>
  )

  const GroupBlock = ({ list, holderReadonly }) => {
    const groups = groupBy(list)
    return Object.entries(groups).map(([groupName, items]) => (
      <div key={groupName} style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', marginBottom: 8 }}>{groupName}</div>
        <CardGrid cards={items} uid={uid} readonly={holderReadonly} onEdit={openEdit} onReorder={handleReorder} />
      </div>
    ))
  }

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
          {myCards.length > 0 && <><SectionHeader name={myName} count={myCards.length} /><GroupBlock list={myCards} holderReadonly={readonly} /></>}
          {partnerCards.length > 0 && <><SectionHeader name={partnerName} count={partnerCards.length} /><GroupBlock list={partnerCards} holderReadonly={true} /></>}
        </>
      ) : (
        <GroupBlock list={cards} holderReadonly={readonly} />
      )}

      {/* Add / Edit card modal */}
      <Modal open={open} onClose={() => { setOpen(false); setPendingCredits(null) }} title={editId ? 'Edit card' : 'Add card'}>
        <Field label="Card name">
          <CardNameInput
            value={form.name}
            onChange={v => set('name', v)}
            onSelectCard={handleSelectCard}
          />
        </Field>
        {pendingCredits && !editId && (
          <div style={{
            padding: '10px 12px', borderRadius: 8, marginBottom: 4,
            background: 'var(--accent-light)', color: 'var(--accent-text)', fontSize: 12
          }}>
            ✦ {pendingCredits.credits.length} credits known for this card — they'll be added to your Credits tab after saving.
          </div>
        )}
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
        <Field label="Group">
          <Select value={form.group} onChange={e => set('group', e.target.value)}>
            <option>Personal</option><option>Business</option>
          </Select>
        </Field>
        <Field label="Notes / perks"><Input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="$50 travel credit, lounge access, etc." /></Field>
        <ModalActions onCancel={() => { setOpen(false); setPendingCredits(null) }} onSave={save} />
      </Modal>

      {/* Confirm add credits modal */}
      <Modal open={!!pendingCredits && !open} onClose={() => setPendingCredits(null)} title={`Add credits for ${pendingCredits?.cardName}?`}>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>
          We know about {pendingCredits?.credits.length} credits for this card. Add them to your Credits tab now?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12, maxHeight: 260, overflowY: 'auto' }}>
          {pendingCredits?.credits.map((c, i) => (
            <div key={i} style={{
              padding: '8px 12px', borderRadius: 8,
              background: 'var(--bg)', border: '1px solid var(--border)', fontSize: 13
            }}>
              <div style={{ fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
                {c.amount > 0 ? `$${c.amount}` : ''} · {c.cadence} · {c.category}
              </div>
            </div>
          ))}
        </div>
        <ModalActions onCancel={() => setPendingCredits(null)} onSave={confirmAddCredits} saveLabel="Add credits" />
      </Modal>
    </div>
  )
}
