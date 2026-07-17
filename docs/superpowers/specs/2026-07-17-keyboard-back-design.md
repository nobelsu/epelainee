# Keyboard "back" — layered navigation reverse

2026-07-17

## Goal

A single keyboard "back" (Esc or Backspace) that always undoes the last
spatial step, down one ladder:

```
open detail panel → closed
[cat, sub]        → [cat]
[cat]             → []
[] (galaxy)       → re-collapse into the intro star
```

The last rung reverses the burst as an animation: the field flows back down
the spikes, the camera dollies in, and the small core star regrows into the
full intro star.

## Why this is cheap

The burst machinery is already bidirectional even though the store's API is
not. `Galaxy`'s frame loop eases `crush.progress` toward a target derived
from `phase` — `0` for `intro`, `1` otherwise — in *both* directions. Core,
CameraRig and the field all interpolate off that one number. Setting `phase`
back to `'intro'` therefore reverse-animates the entire scene with no new
animation code. The README's "one-directional, no way back" is a policy in
`store.ts`, not a technical limit.

## Design

### `back()` in `state/store.ts`

One pure reducer, layered in priority order; each press acts on the first
rule that applies:

1. **Panel open** (`selectedId !== null`) → clear `selectedId`, nothing else.
2. **Below root** (`path.length > 0`) → `path.slice(0, -1)`, clear selection.
   The ring is NOT closed — popping a level just re-renders `NavRing` at the
   new path, preserving the "only the star toggles the ring" invariant.
3. **At root in the galaxy** (`phase === 'galaxy'`, path empty) → set
   `phase: 'intro'` and close the ring (we are leaving the galaxy entirely).
   The frame loop then reverses the burst; `crush()` is already guarded on
   `phase === 'intro'`, so clicking re-bursts.
4. **Otherwise** (mid-crush, or already at the intro) → no-op.

### `ui/useBackKey.ts`

A hook called once from `App`: a `window` keydown listener firing `back()`
on `Escape` or `Backspace`. It ignores events targeting editable elements
(input, textarea, contenteditable) and calls `preventDefault()` on
Backspace as a defence against legacy history navigation.

### `ui/DetailPanel.tsx`

Its private Escape listener is removed — `back()`'s rule 1 covers it.
Without this removal one Esc press would both close the panel and pop a
navigation level. The × button stays.

## Deliberate non-changes

- `enterSub`'s re-click toggle remains the pointer-driven way up one level;
  `back()` is the keyboard-driven generic pop. They coexist.
- No on-screen back affordance, no URL/history integration.

## Accepted trade-off

Reusing `phase: 'intro'` means that during the reform `App` shows the
full-screen intro button, so a click mid-reverse re-bursts from wherever
`crush.progress` currently is. This is a graceful, interruptible transition
rather than a bug; an uninterruptible reverse would need a distinct phase
and is not worth it.

## Testing

`back()` is pure state → unit-testable without WebGL. Manual verification:
drill to a subcategory, open a panel, then press Esc four times and watch
panel → subcat → cat → root → star, then click to re-burst.
