import { useEffect, useState } from 'react'

/**
 * Viewport-derived tuning.
 *
 * `coarse` keys off the pointer rather than width: hover does not exist on a
 * touch screen, so the interaction has to change (tap to pin a label), and a
 * narrow desktop window is still a mouse.
 */
export type Viewport = {
  /** No hover available — pointer is a finger. */
  coarse: boolean
  width: number
}

const read = (): Viewport => ({
  coarse:
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none), (pointer: coarse)').matches,
  width: typeof window === 'undefined' ? 1280 : window.innerWidth,
})

export function useViewport(): Viewport {
  const [vp, setVp] = useState(read)

  useEffect(() => {
    const onResize = () => setVp(read())
    window.addEventListener('resize', onResize)
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    mq.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      mq.removeEventListener('change', onResize)
    }
  }, [])

  return vp
}

/**
 * Counts scaled to the viewport.
 *
 * Quantised to a few steps rather than computed from the exact width: the
 * buffers are rebuilt whenever these change, so a continuous value would
 * rebuild them on every pixel of a window drag.
 */
export function dustCountFor(width: number): number {
  if (width < 480) return 2600
  if (width < 900) return 4200
  return 6000
}

/**
 * The star's extra grain, which burns off during the burst.
 *
 * Scales with screen area, not with the galaxy: the star is framed to fill the
 * viewport at any size, so a bigger screen needs proportionally more points to
 * stay opaque.
 */
export function shellCountFor(width: number): number {
  if (width < 480) return 6000
  if (width < 900) return 9000
  return 14000
}
