import { useEffect, useState } from 'react'
import { useStore } from '../state/store'
import { byId } from '../data/experiences'
import { categoryLabel, subLabel } from '../data/categories'

/** Same dissolve duration / ease as NamePlate mattering in/out. */
const PANEL_MS = 400
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'
/** Stronger than a soft fade — matches the NamePlate dissolve weight. */
const DISSOLVE_BLUR = '12px'

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Detail for the selected experience.
 *
 * Floating bottom-left card (not edge-docked). Lives outside the Canvas:
 * real DOM, real text, selectable and reachable by a screen reader, and never
 * touched by the halftone pass.
 *
 * Enter/leave materialises in place — opacity + blur, no travel — the same
 * dissolve language as NamePlate. The panel stays mounted after `selectedId`
 * clears until the exit finishes.
 *
 * Escape closes it, but that lives in `useBackKey`, not here: the panel is the
 * first rung of the layered back ladder, and a private listener would make one
 * press both close the panel and pop a navigation level.
 *
 * `dates` and `blurb` are omitted when empty so the panel stays presentable
 * while the data file is only partly filled in.
 */
export function DetailPanel() {
  const selectedId = useStore((s) => s.selectedId)
  const select = useStore((s) => s.select)

  // Keep last id while dematerialising so exit has content to dissolve.
  const [heldId, setHeldId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (selectedId) {
      setHeldId(selectedId)
      if (prefersReducedMotion()) {
        setOpen(true)
        return
      }
      // Next frame so the dematerialised styles paint before we open.
      const raf = requestAnimationFrame(() => setOpen(true))
      return () => cancelAnimationFrame(raf)
    }

    setOpen(false)
    if (prefersReducedMotion()) {
      setHeldId(null)
      return
    }
    const t = window.setTimeout(() => setHeldId(null), PANEL_MS)
    return () => window.clearTimeout(t)
  }, [selectedId])

  const exp = heldId ? byId(heldId) : null
  if (!exp) return null

  const reduced = prefersReducedMotion()

  return (
    <aside
      aria-label={`${exp.title} detail`}
      aria-hidden={!open}
      style={{
        position: 'fixed',
        left: 'max(1.5rem, env(safe-area-inset-left))',
        bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
        width: 'min(28rem, calc(100vw - 3rem))',
        maxHeight: '50vh',
        overflowY: 'auto',
        padding: '1.5rem clamp(1.25rem, 3vw, 2rem)',
        paddingTop: '2.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '4px',
        zIndex: 40,
        // In place — no translate. Opacity + blur = matter in/out, not a fade/slide.
        opacity: open ? 1 : 0,
        filter: open ? 'blur(0)' : `blur(${DISSOLVE_BLUR})`,
        pointerEvents: open ? 'auto' : 'none',
        transition: reduced
          ? undefined
          : [`opacity ${PANEL_MS}ms ${EASE}`, `filter ${PANEL_MS}ms ${EASE}`].join(
              ', ',
            ),
      }}
    >
      <button
        type="button"
        onClick={() => select(null)}
        aria-label="Close detail"
        style={{
          position: 'absolute',
          top: '0.85rem',
          right: '0.85rem',
          background: 'none',
          border: 'none',
          color: 'var(--dim)',
          font: '400 1.5rem/1 var(--mono)',
          cursor: 'pointer',
          padding: '0.25rem 0.5rem',
        }}
      >
        ×
      </button>

      <p
        style={{
          font: '400 0.625rem/1 var(--mono)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--dim)',
        }}
      >
        {categoryLabel(exp.category)} › {subLabel(exp.subcategory)}
      </p>

      <h1 style={{ font: '500 1.5rem/1.2 var(--sans)', letterSpacing: '-0.02em' }}>
        {exp.title}
      </h1>

      {exp.org && (
        <p style={{ font: '400 0.875rem/1.4 var(--mono)', color: 'var(--dim)' }}>
          {exp.org}
        </p>
      )}

      {exp.dates && (
        <p style={{ font: '400 0.75rem/1.4 var(--mono)', color: 'var(--dim)' }}>
          {exp.dates}
        </p>
      )}

      {exp.blurb && (
        <p style={{ font: '400 0.9375rem/1.55 var(--sans)', marginTop: '0.25rem' }}>
          {exp.blurb}
        </p>
      )}

      {exp.links?.length ? (
        <ul style={{ listStyle: 'none', marginTop: '0.25rem' }}>
          {exp.links.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--fg)', font: '400 0.8125rem/1.8 var(--mono)' }}
              >
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  )
}
