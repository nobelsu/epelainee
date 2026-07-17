import { create } from 'zustand'
import type { CategoryId } from '../data/categories'

export type Phase = 'intro' | 'crushing' | 'galaxy'

/** Crush duration in seconds. Shared by the store's timer and the scene's easing. */
export const CRUSH_DURATION = 1.2

/**
 * `path` is the navigation cursor into the category tree:
 *   []              → root, all experiences, ring shows the 7 categories
 *   [catId]         → a category, its experiences, ring shows its subcategories
 *   [catId, subId]  → a subcategory, its experiences narrowed further
 *
 * `ringOpen` is whether the choice buttons are showing. The central star is the
 * only thing that flips it — click to open, click to close — so it behaves the
 * same on a mouse and a finger, and never appears or vanishes on its own.
 */
type State = {
  phase: Phase
  hoveredId: string | null
  selectedId: string | null
  path: string[]
  ringOpen: boolean

  crush: () => void
  setHovered: (id: string | null) => void
  select: (id: string | null) => void
  toggleRing: () => void

  enterCategory: (id: CategoryId) => void
  enterSub: (id: string) => void
  showAll: () => void
  back: () => void
}

// Moving levels drops any open panel — the node it showed may not exist at the
// new level. It deliberately does NOT close the ring: only the star does that,
// so drilling category -> subcategory stays one continuous motion instead of
// forcing a trip back to the centre for every step.
const afterChoice = { selectedId: null as string | null }

export const useStore = create<State>((set, get) => ({
  phase: 'intro',
  hoveredId: null,
  selectedId: null,
  path: [],
  // Closed on arrival — the categories only appear once the star is clicked.
  ringOpen: false,

  /**
   * Intro -> crushing -> galaxy. Re-entry is guarded rather than queued; the
   * way back out is `back()` at root, which reverses the burst.
   */
  crush: () => {
    if (get().phase !== 'intro') return
    set({ phase: 'crushing' })
    setTimeout(() => set({ phase: 'galaxy' }), CRUSH_DURATION * 1000)
  },

  setHovered: (id) => set({ hoveredId: id }),
  select: (id) => set({ selectedId: id }),
  toggleRing: () => set((s) => ({ ringOpen: !s.ringOpen })),

  enterCategory: (id) => set({ path: [id], ...afterChoice }),

  // Toggle: re-selecting the active subcategory steps back to the whole
  // category, so the same button both drills in and backs out. `back()` below
  // is the keyboard equivalent; the two coexist.
  enterSub: (id) =>
    set((s) => {
      const cat = s.path[0]
      if (!cat) return s
      const next = s.path[1] === id ? [cat] : [cat, id]
      return { path: next, ...afterChoice }
    }),

  showAll: () => set({ path: [], ...afterChoice }),

  /**
   * The keyboard "back": one press undoes the last spatial step, layered —
   * an open panel closes first, then the path pops a level, and at root the
   * galaxy re-collapses into the intro star. Reversal is free: Galaxy's frame
   * loop eases `crush.progress` toward 0 whenever `phase` is 'intro', and the
   * camera, core and field all interpolate off that one number.
   */
  back: () =>
    set((s) => {
      if (s.selectedId !== null) return { selectedId: null }
      if (s.path.length > 0) return { path: s.path.slice(0, -1), ...afterChoice }
      // Leaving the galaxy entirely, so the ring goes too. Mid-crush presses
      // fall through to a no-op rather than fighting the animation.
      if (s.phase === 'galaxy') return { phase: 'intro' as Phase, ringOpen: false }
      return s
    }),
}))
