# Floating detail panel — bottom-left materialize

2026-07-17

## Goal

Replace the right-edge docked detail panel with a floating bottom-left
card that materialises / dematerialises in place (opacity + blur dissolve,
no travel). While it is open the settled site name dematerialises in place
at bottom centre and rematerialises when the panel closes.

## Design

### Layout (`DetailPanel`)

- Fixed, floating — not flush to any viewport edge.
- Bottom-left: `left` / `bottom` = `max(1.5rem, safe-area)`.
- Width: `min(28rem, calc(100vw - 3rem))` — air on the right and top.
- Max height ~50vh; overflow-y auto inside the card.
- Look: `rgba(0,0,0,0.82)`, `backdrop-filter: blur(6px)`, 1px hairline
  border on all sides, ~4px radius. No side-dock edge.
- Close × top-right inside the card. Content fields unchanged.
- Name yields the corner by dematerialising — no layout dodge / slide.

### Enter / leave animation

Same dissolve grammar as `NamePlate`: opacity + blur **in place**.
No `translate`, no slide, no soft fade-only — the blur is the mattering.

| State | opacity | filter |
|-------|---------|--------|
| Dematerialised | 0 | blur(12px) |
| Materialised | 1 | blur(0) |

- Duration ~0.4s, `cubic-bezier(0.65, 0, 0.35, 1)`.
- Keep the panel mounted after `selectedId` clears until the exit
  transition finishes, then unmount. Switching experiences while open
  updates content in place.
- `prefers-reduced-motion: reduce`: snap open/closed, no blur travel.

### NamePlate

- Intro top-left mark: unchanged (burst dissolve via `CRUSH_DURATION`).
- Settled mark: stays bottom-centre. Never slides.
- While `selectedId !== null`: dematerialise in place (opacity 0 +
  blur(12px), ~0.4s). Rematerialise when the panel closes.
- Visible only when `phase` is galaxy/crushing **and** panel is closed.

### Non-changes

- Store `back()` ladder: panel still first rung via clearing `selectedId`.
- No URL/history integration, no new dependencies.
- Esc / × / `select(null)` all dematerialise via the exit path above.

## Files

- `src/ui/DetailPanel.tsx` — bottom-left layout + materialise state machine
- `src/ui/NamePlate.tsx` — settled mark dissolves while panel open

## Manual check

1. Select a node → name dematerialises centre; card materialises bottom-left.
2. Close via × or Esc → card dematerialises; name rematerialises centre.
3. No sliding of either element.
4. Reduced-motion: instant show/hide.
