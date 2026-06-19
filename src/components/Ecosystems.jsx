// src/components/Ecosystems.jsx
import { useState } from 'react'
import { add, update, remove } from '../lib/db'
import Modal from './Modal'
import { Field, Input, Select, Row, ModalActions, Badge, IconBtn } from './FormField'

const TYPE_COLOR = { 'Credit card': 'blue', Airline: 'amber', Hotel: 'green' }
const blank = () => ({ name: '', type: 'Credit card', balance: '', cpp: '', notes: '' })

function EcoGrid({ items, uid, readonly, onEdit }) {
  if (items.length === 0) return <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '1rem 0' }}>No programs</div>
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 8 }}>
      {items.map(e => {
        const val = (parseInt(e.balance) || 0) * (parseFloat(e.cpp) || 0) / 100
        return (
          <div key={e.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{e.name}</div>
              <Badge color={TYPE_COLOR[e.type] || 'blue'}>{e.type}</Badge>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 500, marginBottom: 4 }}>
              {(parseInt(e.balance) || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>
              {e.cpp && `${e.cpp}¢/pt`}
              {e.cpp && val > 0 && <span style={{ marginLeft: 8 }}>≈ ${Math.round(val).toLocaleString()}</span>}
            </div>
            {e.notes && <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>{e.notes}</div>}
            {!readonly && e._uid === uid && (
              <div style={{ display: 'flex', gap: 4 }}>
                <IconBtn onClick={() => onEdit(e)} title="Edit">✏️</IconBtn>
                <IconBtn onClick={() => remove(uid, 'ecosystems', e.id)} title="Delete">🗑</IconBtn>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Ecosystems({ uid, ecosystems, readonly, showSections, myName, partnerName }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank())
  const [editId, setEditId] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const openAdd = () => { setForm(blank()); setEditId(null); setOpen(true) }
  const openEdit = (e) => { setForm({ name: e.name, type: e.type, balance: e.balance, cpp: e.cpp, notes: e.notes }); setEditId(e.id); setOpen(true) }

  const save = async () => {
    if (!form.name.trim()) return
    if (editId) await update(uid, 'ecosystems', editId, form)
    else await add(uid, 'ecosystems', form)
    setOpen(false)
  }

  const totalPts = ecosystems.reduce((a, e) => a + (parseInt(e.balance) || 0), 0)
  const totalVal = ecosystems.reduce((a, e) => a + ((parseInt(e.balance) || 0) * (parseFloat(e.cpp) || 0) / 100), 0)

  const mine = ecosystems.filter(e => e._holder === myName)
  const theirs = ecosystems.filter(e => e._holder === partnerName)

  const SectionHeader = ({ name, items }) => {
    const pts = items.reduce((a, e) => a + (parseInt(e.balance) || 0), 0)
    return (
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, marginTop: 16 }}>
        {name} · {pts.toLocaleString()} pts
      </div>
    )
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
          {mine.length > 0 && <><SectionHeader name={myName} items={mine} /><EcoGrid items={mine} uid={uid} readonly={readonly} onEdit={openEdit} /></>}
          {theirs.length > 0 && <><SectionHeader name={partnerName} items={theirs} /><EcoGrid items={theirs} uid={uid} readonly={true} onEdit={openEdit} /></>}
        </>
      ) : (
        <EcoGrid items={ecosystems} uid={uid} readonly={readonly} onEdit={openEdit} />
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
        <Field label="Est. value per point (cents)"><Input type="number" step="0.01" value={form.cpp} onChange={e => set('cpp', e.target.value)} placeholder="2.00" /></Field>
        <Field label="Notes / goals"><Input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Saving for business class to Japan" /></Field>
        <ModalActions onCancel={() => setOpen(false)} onSave={save} />
      </Modal>
    </div>
  )
}
