// src/components/Partners.jsx
import { useState } from 'react'
import { add, update, remove } from '../lib/db'
import Modal from './Modal'
import { Field, Input, Select, Row, ModalActions, Badge, IconBtn } from './FormField'

const blank = () => ({ source: '', partner: '', ratio: '1:1', category: 'Airline', notes: '' })

function PartnerGroup({ partners, uid, readonly, onEdit }) {
  const grouped = partners.reduce((acc, p) => {
    if (!acc[p.source]) acc[p.source] = []
    acc[p.source].push(p)
    return acc
  }, {})
  if (Object.keys(grouped).length === 0) return <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '1rem 0' }}>No partners</div>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 8 }}>
      {Object.entries(grouped).map(([source, ps]) => (
        <div key={source} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 13, background: 'var(--bg)' }}>{source}</div>
          {ps.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: '10px 16px', borderBottom: i < ps.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{p.partner}</div>
                {p.notes && <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{p.notes}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 12 }}>
                <Badge color={p.category === 'Airline' ? 'blue' : p.category === 'Hotel' ? 'green' : 'gray'}>
                  {p.ratio} · {p.category}
                </Badge>
                {!readonly && p._uid === uid && (
                  <>
                    <IconBtn onClick={() => onEdit(p)} title="Edit">✏️</IconBtn>
                    <IconBtn onClick={() => remove(uid, 'partners', p.id)} title="Delete">🗑</IconBtn>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Partners({ uid, partners, readonly, showSections, myName, partnerName }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank())
  const [editId, setEditId] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const openAdd = () => { setForm(blank()); setEditId(null); setOpen(true) }
  const openEdit = (p) => { setForm({ source: p.source, partner: p.partner, ratio: p.ratio, category: p.category, notes: p.notes }); setEditId(p.id); setOpen(true) }

  const save = async () => {
    if (!form.source.trim() || !form.partner.trim()) return
    if (editId) await update(uid, 'partners', editId, form)
    else await add(uid, 'partners', form)
    setOpen(false)
  }

  const mine = partners.filter(p => p._holder === myName)
  const theirs = partners.filter(p => p._holder === partnerName)

  const SectionHeader = ({ name }) => (
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, marginTop: 16 }}>{name}</div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Transfer partner reference</span>
        {!readonly && (
          <button onClick={openAdd} style={{ padding: '6px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', background: 'none', fontSize: 13 }}>
            + Add partner
          </button>
        )}
      </div>

      {partners.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)', fontSize: 13 }}>No transfer partners added</div>
      )}

      {showSections ? (
        <>
          {mine.length > 0 && <><SectionHeader name={myName} /><PartnerGroup partners={mine} uid={uid} readonly={readonly} onEdit={openEdit} /></>}
          {theirs.length > 0 && <><SectionHeader name={partnerName} /><PartnerGroup partners={theirs} uid={uid} readonly={true} onEdit={openEdit} /></>}
        </>
      ) : (
        <PartnerGroup partners={partners} uid={uid} readonly={readonly} onEdit={openEdit} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit partner' : 'Add transfer partner'}>
        <Row>
          <Field label="Source program"><Input value={form.source} onChange={e => set('source', e.target.value)} placeholder="Chase UR" /></Field>
          <Field label="Partner program"><Input value={form.partner} onChange={e => set('partner', e.target.value)} placeholder="United MileagePlus" /></Field>
        </Row>
        <Row>
          <Field label="Transfer ratio"><Input value={form.ratio} onChange={e => set('ratio', e.target.value)} placeholder="1:1" /></Field>
          <Field label="Category">
            <Select value={form.category} onChange={e => set('category', e.target.value)}>
              <option>Airline</option><option>Hotel</option><option>Other</option>
            </Select>
          </Field>
        </Row>
        <Field label="Notes / sweet spots"><Input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Great for Saver awards to Europe" /></Field>
        <ModalActions onCancel={() => setOpen(false)} onSave={save} />
      </Modal>
    </div>
  )
}
