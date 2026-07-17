import { CATEGORIES, categoryById } from '../data/categories'
import type { CategoryId } from '../data/categories'
import { useStore } from '../state/store'

/**
 * The ring of category / subcategory choices around the central hub.
 *
 * Shows exactly one level: the seven categories at root, then the entered
 * category's subcategories, plus a "Show all" that returns to root.
 *
 * The central star opens and closes it (`ringOpen`). Selections deliberately do
 * not close it, so drilling category -> subcategory is one continuous motion
 * rather than a trip back to the centre for every step.
 *
 * DOM rather than 3D: it never passes through the halftone, so the labels stay
 * crisp, and it keeps the one interactive 3D object — the central star — clean.
 * The container ignores the pointer; only the buttons catch it, so hovering the
 * galaxy between buttons still works.
 */
const RING = 'clamp(7.5rem, 26vmin, 12rem)'

type Item = { id: string; label: string; active: boolean; reset?: boolean }

export function NavRing() {
  const phase = useStore((s) => s.phase)
  const ringOpen = useStore((s) => s.ringOpen)
  const path = useStore((s) => s.path)
  const enterCategory = useStore((s) => s.enterCategory)
  const enterSub = useStore((s) => s.enterSub)
  const showAll = useStore((s) => s.showAll)

  if (phase !== 'galaxy' || !ringOpen) return null

  // The level currently shown: categories at root, else the category's subs.
  let items: Item[]
  let onPick: (item: Item) => void
  if (path.length === 0) {
    items = CATEGORIES.map((c) => ({ id: c.id, label: c.label, active: false }))
    onPick = (item) => enterCategory(item.id as CategoryId)
  } else {
    const cat = categoryById(path[0] as CategoryId)
    items = (cat?.subs ?? []).map((s) => ({
      id: s.id,
      label: s.label,
      active: path[1] === s.id,
    }))
    // Below root, offer the way back out to everything.
    items.push({ id: '__all__', label: 'Show all', active: false, reset: true })
    onPick = (item) => (item.reset ? showAll() : enterSub(item.id))
  }

  return (
    <div
      id="nav-ring"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 25,
        pointerEvents: 'none',
      }}
    >
      {items.map((item, i) => {
        // Start at the top, go clockwise.
        const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onPick(item)}
            aria-pressed={item.active}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(calc(cos(${angle}rad) * ${RING}), calc(sin(${angle}rad) * ${RING}))`,
              pointerEvents: 'auto',
              background: item.active ? 'var(--fg)' : 'rgba(0,0,0,0.55)',
              color: item.active ? '#000' : item.reset ? 'var(--dim)' : 'var(--fg)',
              border: `1px solid ${
                item.active ? 'var(--fg)' : 'rgba(255,255,255,0.35)'
              }`,
              borderRadius: '999px',
              padding: '0.4rem 0.85rem',
              font: '400 0.6875rem/1 var(--mono)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              backdropFilter: 'blur(3px)',
              textShadow: item.active ? 'none' : '0 0 8px #000',
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
