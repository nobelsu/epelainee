import { useEffect, useState } from 'react'
import { coreClick } from '../scene/coreClick'
import { useStore } from '../state/store'
import { useContent } from '../content/useContent'
import { useViewport } from './useViewport'

/** Once mobile has shown the first-visit filter tip, never again. */
const HUB_TIP_SEEN_KEY = 'hub-filter-tip-seen'

function tipAlreadySeen(): boolean {
  try {
    return localStorage.getItem(HUB_TIP_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markTipSeen() {
  try {
    localStorage.setItem(HUB_TIP_SEEN_KEY, '1')
  } catch {
    /* private mode — tip may reappear this session only */
  }
}

/**
 * The central star's click target.
 *
 * Intro: bursts the star (`crush`). Galaxy: opens/closes the choice ring.
 * Off while crushing. DOM rather than a 3D hit-mesh so drifting nodes cannot
 * occlude it — `Core` projects world origin into `#hub-hotspot` each frame.
 *
 * Intro uses a larger hit area to match the collapsed star; galaxy stays tight
 * on the small core. Desktop hover shows a filter tooltip. Mobile shows
 * "Filter by category" once on first galaxy entry, then never again.
 */
export function HubHotspot() {
  const { siteSettings } = useContent()
  const { coarse } = useViewport()
  const phase = useStore((s) => s.phase)
  const ringOpen = useStore((s) => s.ringOpen)
  const toggleRing = useStore((s) => s.toggleRing)
  const crush = useStore((s) => s.crush)
  const tips = siteSettings.hubTips

  const intro = phase === 'intro'
  const galaxy = phase === 'galaxy'
  const active = intro || galaxy
  // Intro star fills more of the screen than the settled core.
  const rem = intro ? 9 : 4.5
  const half = intro ? -4.5 : -2.25

  const tip = ringOpen ? tips.hideFilters : tips.filterByCategory

  // Mobile: first galaxy visit only. Desktop uses CSS :hover / :focus-visible.
  const [mobileTip, setMobileTip] = useState(false)

  useEffect(() => {
    if (!coarse || !galaxy) return
    if (tipAlreadySeen()) return
    setMobileTip(true)
  }, [coarse, galaxy])

  useEffect(() => {
    if (!ringOpen || !mobileTip) return
    setMobileTip(false)
    markTipSeen()
  }, [ringOpen, mobileTip])

  const showTip = galaxy && (!coarse || mobileTip)

  return (
    <button
      id="hub-hotspot"
      type="button"
      onClick={() => {
        if (intro) {
          crush()
          return
        }
        if (mobileTip) {
          setMobileTip(false)
          markTipSeen()
        }
        // Open: pulse + flash. Close: pulse only. Re-click restarts the kick.
        coreClick.pulse = 1
        coreClick.flash = ringOpen ? 0 : 1
        toggleRing()
      }}
      aria-expanded={intro ? undefined : ringOpen}
      aria-label={
        intro
          ? tips.introAria
          : ringOpen
            ? tips.hideFilters
            : tips.filterByCategory
      }
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: `${rem}rem`,
        height: `${rem}rem`,
        marginLeft: `${half}rem`,
        marginTop: `${half}rem`,
        borderRadius: '50%',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        padding: 0,
        transform: 'translate(-999px, -999px)',
        pointerEvents: active ? 'auto' : 'none',
        cursor: 'pointer',
        zIndex: 26,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {showTip ? (
        <span
          className={`hub-tooltip${mobileTip ? ' is-on' : ''}`}
          aria-hidden="true"
        >
          {coarse ? tips.filterByCategory : tip}
        </span>
      ) : null}
    </button>
  )
}
