import type { CSSProperties } from 'react'
import { CRUSH_DURATION, useStore } from '../state/store'

const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'
/** Panel open/close dissolve — snappier than the burst. */
const PANEL_MS = 400
const DISSOLVE_BLUR = '12px'

const base: CSSProperties = {
  position: 'fixed',
  zIndex: 20,
  margin: 0,
  font: '400 0.8125rem/1 var(--mono)',
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  color: 'var(--dim)',
  textShadow: '0 0 10px #000',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
}

/**
 * Site name. Two copies, no travel across the void: the intro mark
 * dematerialises in place (top-left) as the star bursts, and the settled mark
 * materialises at the bottom centre. Reverse on esc. Opacity + blur carry the
 * dissolve so it reads as mattering in/out rather than sliding.
 *
 * While the detail panel is open the settled mark dematerialises in place
 * (same language); it rematerialises when the panel closes.
 */
export function NamePlate() {
  const phase = useStore((s) => s.phase)
  const panelOpen = useStore((s) => s.selectedId !== null)
  const intro = phase === 'intro'
  const settled = phase === 'galaxy' || phase === 'crushing'
  // Visible only in galaxy/crushing and only when the detail card is gone.
  const settledVisible = settled && !panelOpen

  return (
    <>
      <p
        aria-hidden={phase !== 'intro'}
        style={{
          ...base,
          left: 'max(1.5rem, env(safe-area-inset-left))',
          top: 'max(1.5rem, env(safe-area-inset-top))',
          opacity: intro ? 1 : 0,
          filter: intro ? 'blur(0)' : `blur(${DISSOLVE_BLUR})`,
          transition: [
            `opacity ${CRUSH_DURATION}s ${EASE}`,
            `filter ${CRUSH_DURATION}s ${EASE}`,
          ].join(', '),
        }}
      >
        Elizabeth&nbsp;P.&nbsp;Elaine
      </p>
      <p
        aria-hidden={!settledVisible}
        style={{
          ...base,
          left: '50%',
          bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          transform: 'translateX(-50%)',
          opacity: settledVisible ? 1 : 0,
          filter: settledVisible ? 'blur(0)' : `blur(${DISSOLVE_BLUR})`,
          // Panel toggle uses the snappier dissolve; phase still drives visibility.
          transition: [
            `opacity ${PANEL_MS}ms ${EASE}`,
            `filter ${PANEL_MS}ms ${EASE}`,
          ].join(', '),
        }}
      >
        Elizabeth&nbsp;P.&nbsp;Elaine
      </p>
    </>
  )
}
