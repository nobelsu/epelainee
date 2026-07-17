/**
 * Live crush progress, 0 (orb intact) to 1 (galaxy settled).
 *
 * This is deliberately a plain mutable ref rather than store state: it changes
 * every frame during the transition, and routing that through React would
 * re-render the tree 60+ times a second. Galaxy owns writing it; everything
 * else reads.
 */
export const crush = { progress: 0 }
