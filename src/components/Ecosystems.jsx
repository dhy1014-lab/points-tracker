// src/components/Ecosystems.jsx
import { useState } from 'react'
import { add, update, remove, reorder } from '../lib/db'
import Modal from './Modal'
import { Field, Input, Select, Row, ModalActions, Badge, IconBtn } from './FormField'
import { SortableContainer, SortableItem, DragHandle } from './SortableList'

const TYPE_COLOR = { 'Credit card': 'blue', Airline: 'amber', Hotel: 'green' }
const blank = () => ({ name: '', type: 'Credit card', balance: '', cpp: '', notes: '', group: 'Personal', expiration: '' })

function EcoItem({ e, uid, readonly, onEdit, listeners, dragDisabled }) {
  const val = (parseInt(e.balance) || 0) * (parseFloat(e.cpp) || 0) / 100
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {!readonly && !dragDisabled && <DragHandle listeners={listeners} />}
          <div style={{ fontWeight: 500, fontSize: 14 }}>{e.name}</div>
        </div>
        <Badge color={TYPE_COLOR[e.type] || 'blue'}>{e.type}</Badge>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 500, marginBottom: 4 }}>
        {(parseInt(e.balance) || 0).toLocaleString()}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>
        {e.cpp && `${e.cpp}¢/pt`}
        {e.cpp && val > 0 && <span style={{ marginLeft: 8 }}>≈ ${Math.round(val).toLocaleString()}</span>}
      </div>
      {e.expiration && (
        <div
          title={e.expiration}
          style={{
            fontSize: 11, color: 'var(--text-3)', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 4, cursor: 'help'
          }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 13, height: 13, borderRadius: '50%', border: '1px solid var(--text-3)',
            fontSize: 9, lineHeight: 1
          }}>i</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.expiration}</span>
        </div>
      )}
      {e.notes && <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>{e.notes}</div>}
      {!readonly && e._uid === uid && (
        <div style={{ display: 'flex', gap: 4 }}>
          <IconBtn onClick={() => onEdit(e)} title="Edit">✏️</IconBtn>
          <IconBtn onClick={() => remove(uid, 'ecosystems', e.id)} title="Delete">🗑</IconBtn>
        </div>
      )}
    </div>
  )
}

function EcoGrid({ items, uid, readonly, onEdit, onReorder }) {
  if (items.length === 0) return <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '1rem 0' }}>No programs</div>
  const dragDisabled = readonly || items.some(i => i._uid !== uid)
  return (
    <SortableContainer items={items} onReorder={onReorder} disabled={dragDisabled}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 8 }}>
        {items.map(e => (
          <SortableItem key={e.id} id={e.id} disabled={dragDisabled}>
            {(listeners) => <EcoItem e={e} uid={uid} readonly={readonly} onEdit={onEdit} listeners={listeners} dragDisabled={dragDisabled} />}
          </SortableItem>
        ))}
      </div>
    </SortableContainer>
  )
}

export default function Ecosystems({ uid, ecosystems, readonly, showSections, myName, partnerName }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank())
  const [editId, setEditId] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const openAdd = () => { setForm(blank()); setEditId(null); setOpen(true) }
  const openEdit = (e) => { setForm({ name: e.name, type: e.type, balance: e.balance, cpp: e.cpp, notes: e.notes, group: e.group || 'Personal', expiration: e.expiration || '' }); setEditId(e.id); setOpen(true) }

  const save = async () => {
    if (!form.name.trim()) return
    if (editId) await update(uid, 'ecosystems', editId, form)
    else await add(uid, 'ecosystems', form)
    setOpen(false)
  }

  const handleReorder = async (newOrder) => {
    await reorder(uid, 'ecosystems', newOrder.map((item, i) => ({ id: item.id, sortOrder: i })))
  }

  const totalPts = ecosystems.reduce((a, e) => a + (parseInt(e.balance) || 0), 0)
  const totalVal = ecosystems.reduce((a, e) => a + ((parseInt(e.balance) || 0) * (parseFloat(e.cpp) || 0) / 100), 0)

  const mine = ecosystems.filter(e => e._holder === myName)
  const theirs = ecosystems.filter(e => e._holder === partnerName)

  const groupBy = (list) => {
    const groups = {}
    list.forEach(e => {
      const g = e.group || 'Personal'
      if (!groups[g]) groups[g] = []
      groups[g].push(e)
    })
    return groups
  }

  const SectionHeader = ({ name, items }) => {
    const pts = items.reduce((a, e) => a + (parseInt(e.balance) || 0), 0)
    return (
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, marginTop: 16 }}>
        {name} · {pts.toLocaleString()} pts
      </div>
    )
  }

  const GroupBlock = ({ list, holderReadonly }) => {
    const groups = groupBy(list)
    return Object.entries(groups).map(([groupName, items]) => (
      <div key={groupName} style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', marginBottom: 8 }}>{groupName}</div>
        <EcoGrid items={items} uid={uid} readonly={holderReadonly} onEdit={openEdit} onReorder={handleReorder} />
      </div>
    ))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
            <strong style={{ color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 14 }}>{totalPts.toLocaleString()}</strong> pts total
          </span>
          {totalVal > 0 && (
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
              ≈ <strong style={{ color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 14 }}>${Math.round(totalVal).toLocaleString()}</strong>
            </span>
          )}
        </div>
        {!readonly && (
          <button onClick={openAdd} style={{ padding: '6px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', background: 'none', fontSize: 13 }}>
            + Add program
          </button>
        )}
      </div>

      {ecosystems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)', fontSize: 13 }}>No programs added yet</div>
      )}

      {showSections ? (
        <>
          {mine.length > 0 && <><SectionHeader name={myName} items={mine} /><GroupBlock list={mine} holderReadonly={readonly} /></>}
          {theirs.length > 0 && <><SectionHeader name={partnerName} items={theirs} /><GroupBlock list={theirs} holderReadonly={true} /></>}
        </>
      ) : (
        <GroupBlock list={ecosystems} holderReadonly={readonly} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit program' : 'Add program'}>
        <Field label="Program name"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Chase Ultimate Rewards" /></Field>
        <Row>
          <Field label="Type">
            <Select value={form.type} onChange={e => set('type', e.target.value)}>
              <option>Credit card</option><option>Airline</option><option>Hotel</option>
            </Select>
          </Field>
          <Field label="Current balance"><Input type="number" value={form.balance} onChange={e => set('balance', e.target.value)} placeholder="50000" /></Field>
        </Row>
        <Row>
          <Field label="Est. value per point (cents)"><Input type="number" step="0.01" value={form.cpp} onChange={e => set('cpp', e.target.value)} placeholder="2.00" /></Field>
          <Field label="Group">
            <Select value={form.group} onChange={e => set('group', e.target.value)}>
              <option>Personal</option><option>Business</option>
            </Select>
          </Field>
        </Row>
        <Field label="Expiration policy">
          <Select value={form.expiration} onChange={e => set('expiration', e.target.value)}>
            <option value="">— Not set —</option>
            <option value="Never expires">Never expires</option>
            <option value="Expires 12 months after last activity">Expires 12 months after last activity</option>
            <option value="Expires 18 months after last activity">Expires 18 months after last activity</option>
            <option value="Expires 24 months after last activity">Expires 24 months after last activity</option>
            <option value="Expires 5 years after earning">Expires 5 years after earning</option>
            <option value="Expires at year-end if account inactive">Expires at year-end if account inactive</option>
            <option value="Custom">Custom — specify in notes</option>
          </Select>
        </Field>
        <Field label="Notes / goals"><Input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Saving for business class to Japan" /></Field>
        <ModalActions onCancel={() => setOpen(false)} onSave={save} />
      </Modal>
    </div>
  )
}
