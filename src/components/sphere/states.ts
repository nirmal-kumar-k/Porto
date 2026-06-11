import type { SectionId } from "@/lib/sections"

/**
 * The First Light Core evolves subtly as the visitor moves through sections.
 * Each state nudges rotation speed, seam glow, particle energy, and scale.
 * Keep changes gentle — visitors should feel the shift, not be startled by it.
 */
export interface SphereState {
  rotationSpeed: number
  seamEmissive: number
  glowIntensity: number
  particleSpeed: number
  particleSpread: number
  scale: number
  /** Subtle surface distortion amount. */
  distort: number
}

export const SPHERE_STATES: Record<SectionId, SphereState> = {
  // Hero — clean, minimal, curious
  home: {
    rotationSpeed: 0.12,
    seamEmissive: 0.6,
    glowIntensity: 0.7,
    particleSpeed: 0.15,
    particleSpread: 1.0,
    scale: 1.0,
    distort: 0.08,
  },
  // Projects — more energetic, more structured
  projects: {
    rotationSpeed: 0.28,
    seamEmissive: 1.1,
    glowIntensity: 1.0,
    particleSpeed: 0.4,
    particleSpread: 1.25,
    scale: 1.04,
    distort: 0.14,
  },
  // About — balanced, stable
  about: {
    rotationSpeed: 0.16,
    seamEmissive: 0.85,
    glowIntensity: 0.9,
    particleSpeed: 0.22,
    particleSpread: 1.1,
    scale: 1.0,
    distort: 0.06,
  },
  // Resume — most refined, maximum precision
  resume: {
    rotationSpeed: 0.1,
    seamEmissive: 1.4,
    glowIntensity: 1.1,
    particleSpeed: 0.12,
    particleSpread: 0.85,
    scale: 1.02,
    distort: 0.02,
  },
  // Contact — returns to simplicity
  contact: {
    rotationSpeed: 0.1,
    seamEmissive: 0.55,
    glowIntensity: 0.65,
    particleSpeed: 0.14,
    particleSpread: 1.0,
    scale: 0.98,
    distort: 0.05,
  },
}
