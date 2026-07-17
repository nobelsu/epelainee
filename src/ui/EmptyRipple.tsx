import { useEffect, useState } from 'react'
import {
  subscribeEmptyRipples,
  type RippleSpawn,
} from './emptyRippleBus'

const RIPPLE_MS = 620

/**
 * Short white rings at empty-space click points. Visual only — never captures
 * the pointer. Spawns arrive from Canvas `onPointerMissed` via `emptyRippleBus`.
 */
export function EmptyRipple() {
  const [ripples, setRipples] = useState<RippleSpawn[]>([])

  useEffect(() => {
    return subscribeEmptyRipples((spawn) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }
      setRipples((prev) => [...prev, spawn])
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== spawn.id))
      }, RIPPLE_MS)
    })
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 15,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="empty-ripple"
          style={{
            left: r.x,
            top: r.y,
          }}
        />
      ))}
    </div>
  )
}
