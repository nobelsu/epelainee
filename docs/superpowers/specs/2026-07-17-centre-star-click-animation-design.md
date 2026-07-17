# Centre star click animation — pulse + flash

2026-07-17

## Goal

When the user clicks the central star in the galaxy phase (`HubHotspot`),
the small core mesh gives immediate visual feedback:

- **Open ring:** scale bounce + brief brightness flash
- **Close ring:** scale bounce only (no flash)

Intro-phase burst click is unchanged.

## Why this is cheap

`HubHotspot` already toggles `ringOpen`; `Core` already owns the settled
star mesh and runs a `useFrame` loop for reveal scale, slow spin, and
hotspot projection. Click feedback is one more impulse those frames can
decay — same pattern as `crush.progress` in `scene/crush.ts`.

## Design

### `scene/coreClick.ts`

Live module (not React state):

```ts
export const coreClick = { pulse: 0, flash: 0 }
```

Both fields are `0..1`. Writers set them; `Core` decays them each frame.
No store subscription, no re-render on click.

### `ui/HubHotspot.tsx`

On click, before `toggleRing()`:

1. Read current `ringOpen`.
2. If currently closed (about to open): `coreClick.pulse = 1`, `coreClick.flash = 1`.
3. If currently open (about to close): `coreClick.pulse = 1`, `coreClick.flash = 0`.
4. Call `toggleRing()`.

Re-click mid-animation overwrites the impulse (restart, no queue).

### `scene/Core.tsx`

Each frame after reveal scale is known:

1. Decay `pulse` and `flash` toward `0` (~280–350ms to rest; exponential or
   linear ease-out — pick one constant, keep both channels on the same clock).
2. Apply scale: `reveal * (1 + pulse * AMP)` where `AMP ≈ 0.22`.
3. Apply flash: multiply `meshBasicMaterial` color (or opacity) by
   `1 + flash * FLASH_AMP` so open reads as a brief white kick; close leaves
   material at base white.

Hotspot projection and slow `rotation.z` stay as they are.

## Constants (tunable)

| Name | Intent | Starting point |
|------|--------|----------------|
| pulse amp | peak scale overshoot | `0.22` |
| flash amp | peak brightness bump | `0.35`–`0.5` |
| decay duration | time to rest | `~300ms` |

Tune by eye against the halftone; keep values as named constants in
`coreClick.ts` or `Core.tsx`.

## Deliberate non-changes

- Intro full-screen `crush()` button and burst timeline
- `NavRing` open/close transitions beyond existing show/hide
- Sound, particles, or a second mesh for glow
- Zustand fields for the impulse

## Testing

Manual only (WebGL/halftone):

1. Burst to galaxy, click star → ring opens, star pops + flashes once.
2. Click again → ring closes, star pops, no flash.
3. Rapid double-click → latest kick wins; no stuck scale/brightness.
4. Confirm hotspot still tracks star; Esc back path unaffected.
