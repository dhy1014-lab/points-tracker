// src/components/Partners.jsx
import { useState, useEffect } from 'react'
import { add, update, remove, reorder } from '../lib/db'
import { seedTransferPartners, refreshTransferPartners, PARTNERS_DATA_DATE } from '../lib/seedPartners'
import Modal from './Modal'
import { Field, Input, Select, Row, ModalActions, Badge, IconBtn } from './FormField'
import { SortableContainer, SortableItem, DragHandle } from './SortableList'

const blank = () => ({ source: '', partner: '', ratio: '1:1', category: 'Airline', notes: '' })

function PartnerRow({ p, uid, readonly, onEdit, listeners, dragDisabled }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '10px 16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1, minWidth: 0 }}>
        {!readonly && !dragDisabled && <DragHandle listeners={listeners} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{p.partner}</div>
          {p.notes && <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{p.notes}</div>}
        </div>
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
  )
}

function EcosystemGroup({ source, items, uid, readonly, onEdit, onReorderItems, onDragHandleGroup, collapsed, onToggle }) {
  const dragDisabled = readonly || items.some(i => i._uid !== uid)

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{
        padding: '10px 16px', borderBottom: collapsed ? 'none' : '1px solid var(--border)',
        fontWeight: 600, fontSize: 13, background: 'var(--bg)',
        display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
      }} onClick={onToggle}>
        {!readonly && !dragDisabled && (
          <span onClick={e => e.stopPropagation()}>
            <DragHandle listeners={onDragHandleGroup} />
          </span>
        )}
        <span style={{
          display: 'inline-block', transition: 'transform 0.15s',
          transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', fontSize: 10, color: 'var(--text-3)'
        }}>▼</span>
        <span>{source}</span>
        <span style={{ fontWeight: 400, color: 'var(--text-3)', fontSize: 11 }}>· {items.length}</span>
      </div>
      {!collapsed && (
        <SortableContainer items={items} onReorder={onReorderItems} disabled={dragDisabled}>
          <div>
            {items.map((p, i) => (
              <div key={p.id} style={{ borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <SortableItem id={p.id} disabled={dragDisabled}>
                  {(listeners) => <PartnerRow p={p} uid={uid} readonly={readonly} onEdit={onEdit} listeners={listeners} dragDisabled={dragDisabled} />}
                </SortableItem>
              </div>
            ))}
          </div>
        </SortableContainer>
      )}
    </div>
  )
}

function PartnerGroup({ partners, uid, readonly, onEdit, onReorderItems, onReorderGroups, collapsedSet, onToggle }) {
  // Build ordered list of source groups based on min sortOrder of group (or insertion order)
  const grouped = {}
  partners.forEach(p => {
    if (!grouped[p.source]) grouped[p.source] = []
    grouped[p.source].push(p)
  })
  const sourceOrder = Object.keys(grouped) // preserves insertion order from already-sorted `partners`
  const groupObjs = sourceOrder.map(source => ({ id: `__group__${source}`, source, items: grouped[source] }))

  if (groupObjs.length === 0) return <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '1rem 0' }}>No partners</div>

  const dragDisabled = readonly || partners.some(p => p._uid !== uid)

  return (
    <SortableContainer items={groupObjs} onReorder={onReorderGroups} disabled={dragDisabled}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 8 }}>
        {groupObjs.map(g => (
          <SortableItem key={g.id} id={g.id} disabled={dragDisabled}>
            {(listeners) => (
              <EcosystemGroup
                source={g.source}
                items={g.items}
                uid={uid}
                readonly={readonly}
                onEdit={onEdit}
                onReorderItems={(newItems) => onReorderItems(g.source, newItems)}
                onDragHandleGroup={listeners}
                collapsed={collapsedSet.has(g.source)}
                onToggle={() => onToggle(g.source)}
              />
            )}
          </SortableItem>
        ))}
      </div>
    </SortableContainer>
  )
}

export default function Partners({ uid, partners, readonly, showSections, myName, partnerName }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank())
  const [editId, setEditId] = useState(null)
  const [collapsed, setCollapsed] = useState(new Set())
  const [refreshing, setRefreshing] = useState(false)
  const [refreshResult, setRefreshResult] = useState(null)

  useEffect(() => {
    if (!readonly && uid && partners.length === 0) {
      seedTransferPartners(uid)
    }
  }, [uid, readonly]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = async () => {
    setRefreshing(true)
    setRefreshResult(null)
    try {
      const result = await refreshTransferPartners(uid)
      setRefreshResult(result)
      setTimeout(() => setRefreshResult(null), 6000)
    } finally {
      setRefreshing(false)
    }
  }

  const toggleCollapse = (source) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(source)) next.delete(source)
      else next.add(source)
      return next
    })
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const openAdd = () => { setForm(blank()); setEditId(null); setOpen(true) }
  const openEdit = (p) => { setForm({ source: p.source, partner: p.partner, ratio: p.ratio, category: p.category, notes: p.notes }); setEditId(p.id); setOpen(true) }

  const save = async () => {
    if (!form.source.trim() || !form.partner.trim()) return
    if (editId) await update(uid, 'partners', editId, form)
    else await add(uid, 'partners', form)
    setOpen(false)
  }

  // Reorder items within a single ecosystem group
  const handleReorderItems = async (source, newItemsForGroup) => {
    // newItemsForGroup is the reordered slice for this source only.
    // We need to recompute global sortOrder values that interleave correctly.
    // Simplest: give each item in this group a sortOrder based on position,
    // offset by the group's base sortOrder (preserves group ordering).
    const baseOrders = partners.filter(p => p.source === source).map(p => p.sortOrder ?? 0)
    const base = Math.min(...baseOrders)
    const updates = newItemsForGroup.map((item, i) => ({ id: item.id, sortOrder: base + i * 0.001 }))
    await reorder(uid, 'partners', updates)
  }

  // Reorder ecosystem groups themselves
  const handleReorderGroups = async (newGroupObjs) => {
    // Assign each group a large sortOrder band (1000 apart), preserving item order within
    const updates = []
    newGroupObjs.forEach((g, groupIndex) => {
      g.items.forEach((item, itemIndex) => {
        updates.push({ id: item.id, sortOrder: groupIndex * 1000 + itemIndex })
      })
    })
    await reorder(uid, 'partners', updates)
  }

  const mine = partners.filter(p => p._holder === myName)
  const theirs = partners.filter(p => p._holder === partnerName)

  const SectionHeader = ({ name }) => (
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, marginTop: 16 }}>{name}</div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Transfer partner reference</span>
          {!readonly && (
            <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 8 }}>
              · data as of {PARTNERS_DATA_DATE}
            </span>
          )}
        </div>
        {!readonly && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleRefresh} disabled={refreshing} style={{
              padding: '6px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)',
              background: 'none', fontSize: 13, color: 'var(--text-2)',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <span style={{ display: 'inline-block', animation: refreshing ? 'spin 1s linear infinite' : 'none' }}>↻</span>
              {refreshing ? 'Refreshing…' : 'Refresh partner data'}
            </button>
            <button onClick={openAdd} style={{ padding: '6px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', background: 'none', fontSize: 13 }}>
              + Add partner
            </button>
          </div>
        )}
      </div>

      {refreshResult && (
        <div style={{
          padding: '8px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13,
          background: 'var(--green-light)', color: 'var(--green-text)'
        }}>
          ✓ Refreshed — {refreshResult.updated} updated, {refreshResult.added} new, {refreshResult.unchanged} already current
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {partners.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)', fontSize: 13 }}>No transfer partners added</div>
      )}

      {showSections ? (
        <>
          {mine.length > 0 && <><SectionHeader name={myName} /><PartnerGroup partners={mine} uid={uid} readonly={readonly} onEdit={openEdit} onReorderItems={handleReorderItems} onReorderGroups={handleReorderGroups} collapsedSet={collapsed} onToggle={toggleCollapse} /></>}
          {theirs.length > 0 && <><SectionHeader name={partnerName} /><PartnerGroup partners={theirs} uid={uid} readonly={true} onEdit={openEdit} onReorderItems={handleReorderItems} onReorderGroups={handleReorderGroups} collapsedSet={collapsed} onToggle={toggleCollapse} /></>}
        </>
      ) : (
        <PartnerGroup partners={partners} uid={uid} readonly={readonly} onEdit={openEdit} onReorderItems={handleReorderItems} onReorderGroups={handleReorderGroups} collapsedSet={collapsed} onToggle={toggleCollapse} />
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
