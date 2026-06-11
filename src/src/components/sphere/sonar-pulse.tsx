import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { InteractionState } from "@/hooks/use-interaction"

const MAX_RINGS = 4 // Maximum concurrent pulse rings
const RING_LIFETIME = 1.8 // seconds
const CYAN_COLOR = new THREE.Color("#00e5ff")

interface SonarPulseProps {
  interaction: React.MutableRefObject<InteractionState>
}

/**
 * Expanding golden sonar pulse rings that emit from the sphere on click.
 * Each ring expands outward and fades, like a ripple in still water.
 */
export function SonarPulse({ interaction }: SonarPulseProps) {
  const groupRef = useRef<THREE.Group>(null)
  const materialsRef = useRef<THREE.MeshBasicMaterial[]>([])
  const ringsRef = useRef<THREE.Mesh[]>([])

  // Track which rings are active and their ages
  const ringState = useRef(
    Array.from({ length: MAX_RINGS }, () => ({
      active: false,
      age: 0,
      startScale: 0.3,
    })),
  )

  const lastClickPulse = useRef(0)
  const nextRingIndex = useRef(0)

  // Create ring geometry once
  const ringGeo = useMemo(() => {
    return new THREE.RingGeometry(1.3, 1.38, 96)
  }, [])

  useFrame((_, delta) => {
    const inter = interaction.current
    const clampedDelta = Math.min(delta, 0.05)

    // Detect new click pulse (rising edge)
    if (inter.clickPulse > 0.8 && lastClickPulse.current < 0.5) {
      // Activate the next ring
      const idx = nextRingIndex.current % MAX_RINGS
      ringState.current[idx].active = true
      ringState.current[idx].age = 0
      ringState.current[idx].startScale = 0.3
      nextRingIndex.current++
    }
    lastClickPulse.current = inter.clickPulse

    // Update each ring
    for (let i = 0; i < MAX_RINGS; i++) {
      const rs = ringState.current[i]
      const mesh = ringsRef.current[i]
      const mat = materialsRef.current[i]
      if (!mesh || !mat) continue

      if (!rs.active) {
        mesh.visible = false
        continue
      }

      mesh.visible = true
      rs.age += clampedDelta

      if (rs.age > RING_LIFETIME) {
        rs.active = false
        mesh.visible = false
        continue
      }

      // Progress 0 → 1
      const progress = rs.age / RING_LIFETIME
      // Eased expansion (starts fast, slows down)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      // Scale: expands from 0.3 → ~5.0
      const scale = rs.startScale + easedProgress * 4.7
      mesh.scale.set(scale, scale, scale)

      // Opacity: bright start, fades out
      const fadeIn = Math.min(rs.age / 0.1, 1) // quick fade-in
      const fadeOut = 1 - Math.pow(progress, 2)
      mat.opacity = fadeIn * fadeOut * 0.6

      // Subtle rotation for visual interest
      mesh.rotation.z += clampedDelta * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: MAX_RINGS }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) ringsRef.current[i] = el
          }}
          geometry={ringGeo}
          visible={false}
          renderOrder={10}
        >
          <meshBasicMaterial
            ref={(el) => {
              if (el) materialsRef.current[i] = el
            }}
            color={CYAN_COLOR}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
