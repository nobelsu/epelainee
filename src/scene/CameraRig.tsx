import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, PerspectiveCamera } from 'three'
import { crush } from './crush'
import { STAR_HALF_WIDTH_FRAC, STAR_RADIUS } from './galaxyLayout'

/**
 * Dollies the camera out as the star bursts.
 *
 * The intro distance is measured, not fixed: the star is tall, and a number
 * tuned on a desktop crops it badly on a portrait phone. The settled distance
 * does not need measuring — the field fits itself to whatever frame the camera
 * gives it (see `fieldFrame`), so this only chooses how big the nodes read.
 *
 * The camera object is mutated directly rather than driven by the Canvas
 * `camera` prop, which R3F only reads once at creation.
 */

/** Starting guess only; the rig computes the real distance on the first frame. */
export const INTRO_Z = 7.4

/** Leave a little air rather than letting the star touch the edges. */
const INTRO_MARGIN = 1.02

/**
 * Settled distance. Any value frames the field — it stretches to fit — so this
 * is purely how large the nodes and dust read once everything lands.
 */
const GALAXY_Z = 20

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/** Distance at which a half-width/half-height pair fits the frame. */
function fit(
  camera: PerspectiveCamera,
  aspect: number,
  halfWidth: number,
  halfHeight: number,
) {
  const t = Math.tan(MathUtils.degToRad(camera.fov) / 2)
  return Math.max(halfHeight / t, halfWidth / (t * aspect))
}

export function CameraRig() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)

  useFrame(() => {
    const aspect = size.width / size.height

    const introZ =
      fit(camera, aspect, STAR_RADIUS * STAR_HALF_WIDTH_FRAC, STAR_RADIUS) *
      INTRO_MARGIN

    const e = easeInOutCubic(crush.progress)
    camera.position.z = introZ + (GALAXY_Z - introZ) * e
    // Stays on the axis: the hub has to land on the exact centre of the screen,
    // and the field is measured from this camera, so any lift would shift both.
    camera.position.y = 0
  })

  return null
}
