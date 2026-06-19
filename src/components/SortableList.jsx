// src/components/SortableList.jsx
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Wraps any child in drag handles + sortable behavior
export function SortableItem({ id, children, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children(listeners)}
    </div>
  )
}

// Drag handle icon button — pass the listeners from SortableItem's render prop
export function DragHandle({ listeners, disabled }) {
  if (disabled) return <span style={{ width: 18 }} />
  return (
    <span
      {...listeners}
      style={{
        cursor: 'grab', color: 'var(--text-3)', fontSize: 14,
        padding: '2px 4px', touchAction: 'none', userSelect: 'none'
      }}
      title="Drag to reorder"
    >⠿</span>
  )
}

// Top-level DnD context wrapper. items = array of objects with `id`.
// onReorder(newItemsArray) is called after a drop.
export function SortableContainer({ items, onReorder, children, disabled }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex(i => i.id === active.id)
    const newIndex = items.findIndex(i => i.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(items, oldIndex, newIndex))
  }

  if (disabled) return children

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}
