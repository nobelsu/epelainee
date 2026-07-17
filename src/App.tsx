import { Canvas } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { Halftone } from './scene/HalftonePass'
import { Galaxy } from './scene/Galaxy'
import { Core } from './scene/Core'
import { CameraRig, INTRO_Z } from './scene/CameraRig'
import { DetailPanel } from './ui/DetailPanel'
import { NavRing } from './ui/NavRing'
import { HubHotspot } from './ui/HubHotspot'
import { EmptyRipple } from './ui/EmptyRipple'
import { spawnEmptyRipple } from './ui/emptyRippleBus'
import { NamePlate } from './ui/NamePlate'
import { dustCountFor, shellCountFor, useViewport } from './ui/useViewport'
import { useBackKey } from './ui/useBackKey'
import { CRUSH_DURATION, useStore } from './state/store'

export default function App() {
  const phase = useStore((s) => s.phase)
  const { coarse, width } = useViewport()
  useBackKey()

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, INTRO_Z], fov: 32 }}
        gl={{ antialias: false }}
        // Cap DPR at 1.5 rather than 2: the halftone runs per output pixel, and
        // phones pay for a 3x buffer they cannot show the detail of anyway.
        dpr={[1, coarse ? 1.5 : 2]}
        onPointerMissed={(e) => {
          spawnEmptyRipple(e.clientX, e.clientY)
        }}
      >
        <color attach="background" args={['#000000']} />
        <CameraRig />
        <Galaxy
          dustCount={dustCountFor(width)}
          shellCount={shellCountFor(width)}
          touch={coarse}
        />
        <Core />
        <EffectComposer multisampling={0}>
          <Halftone cellSize={5} />
        </EffectComposer>
      </Canvas>

      <EmptyRipple />
      <HubHotspot />
      <NavRing />
      <DetailPanel />
      <NamePlate />

      {/* Intro cue. Dematerialises with the burst; only the star hotspot bursts. */}
      <p
        aria-hidden={phase !== 'intro'}
        style={{
          position: 'fixed',
          right: 'max(1.5rem, env(safe-area-inset-right))',
          bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          zIndex: 20,
          margin: 0,
          font: '400 0.625rem/1 var(--mono)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--dim)',
          textShadow: '0 0 8px #000',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          opacity: phase === 'intro' ? 1 : 0,
          filter: phase === 'intro' ? 'blur(0)' : 'blur(6px)',
          transition: [
            `opacity ${CRUSH_DURATION}s cubic-bezier(0.65, 0, 0.35, 1)`,
            `filter ${CRUSH_DURATION}s cubic-bezier(0.65, 0, 0.35, 1)`,
          ].join(', '),
        }}
      >
        {coarse ? 'Tap' : 'Click'} the star to begin
      </p>

      {/* Keyboard hint; pointless on touch-only devices, so `coarse` hides it. */}
      {phase === 'galaxy' && !coarse && (
        <p
          aria-hidden="true"
          style={{
            position: 'fixed',
            right: 'max(1.5rem, env(safe-area-inset-right))',
            bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
            zIndex: 20,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            font: '400 0.625rem/1 var(--mono)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--dim)',
            textShadow: '0 0 8px #000',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              border: '1px solid rgba(255, 255, 255, 0.28)',
              borderRadius: '3px',
              padding: '0.25rem 0.4rem',
            }}
          >
            esc
          </span>
          back
        </p>
      )}
    </>
  )
}
