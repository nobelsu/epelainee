/**
 * Bridge from Canvas `onPointerMissed` (R3F) to the DOM ripple layer.
 * Same live-module pattern as `coreClick` — no React re-render on the canvas path.
 */

export type RippleSpawn = { id: number; x: number; y: number }

type Listener = (spawn: RippleSpawn) => void

let nextId = 1
const listeners = new Set<Listener>()

export function spawnEmptyRipple(x: number, y: number) {
  const spawn: RippleSpawn = { id: nextId++, x, y }
  for (const listener of listeners) listener(spawn)
}

export function subscribeEmptyRipples(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
