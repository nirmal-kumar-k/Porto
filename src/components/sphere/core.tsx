import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"
import { createSeamCurve } from "./seam-geometry"
import type { SphereState } from "./states"
import { useAppState } from "@/state/app-state"

const RADIUS = 1.35

interface CoreProps {
  /** Live, interpolated state (mutated outside React for perf). */
  stateRef: React.MutableRefObject<SphereState>
  pointer: React.MutableRefObject<{ x: number; y: number }>
}

/**
 * The First Light Core: a matte black sphere wrapped in two glowing gold
 * seam curves, with a soft internal blue glow and orbiting particle accents.
 */
export function Core({ stateRef, pointer }: CoreProps) {
  const group = useRef<THREE.Group>(null)
  const seamMat1 = useRef<THREE.MeshStandardMaterial>(null)
  const seamMat2 = useRef<THREE.MeshStandardMaterial>(null)
  const glowMat = useRef<THREE.MeshBasicMaterial>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const pointsMaterialRef = useRef<THREE.PointsMaterial>(null)
  const distortRef = useRef<{ distort: number }>(null)
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const spinEnergy = useRef(0)
  const { isHovering } = useAppState()

  // Build the seam tube geometry once.
  const seamGeometry = useMemo(() => {
    const curve = createSeamCurve(RADIUS * 1.005, 320)
    return new THREE.TubeGeometry(curve, 320, 0.022, 12, true)
  }, [])

  // Particle field positions (computed once).
  const { positions, count } = useMemo(() => {
    const count = 260
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Distribute on a shell just outside the sphere.
      const r = RADIUS * (1.5 + Math.random() * 1.4)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    return { positions, count }
  }, [])

  const handlePointerDown = (event: { stopPropagation: () => void; clientX: number; clientY: number }) => {
    event.stopPropagation()
    dragging.current = true
    dragStart.current = { x: event.clientX, y: event.clientY }
  }

  const handlePointerMove = (event: { stopPropagation: () => void; clientX: number; clientY: number }) => {
    if (!dragging.current || !group.current) return
    event.stopPropagation()
    const dx = event.clientX - dragStart.current.x
    const dy = event.clientY - dragStart.current.y
    group.current.rotation.y += dx * 0.008
    group.current.rotation.x += dy * 0.008
    spinEnergy.current = Math.min(1, spinEnergy.current + Math.hypot(dx, dy) * 0.0025)
    dragStart.current = { x: event.clientX, y: event.clientY }
  }

  const handlePointerUp = () => {
    dragging.current = false
  }

  useFrame((_, delta) => {
    const s = stateRef.current
    if (!group.current) return

    // Idle rotation, gently biased by pointer position.
    group.current.rotation.y += delta * s.rotationSpeed
    const targetX = pointer.current.y * 0.25
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04
    group.current.rotation.z += (pointer.current.x * 0.05 - group.current.rotation.z) * 0.03

    // Scale easing toward state target.
    const targetScale = s.scale
    group.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05,
    )

    // Seam emissive — boosted when hovering interactive elements.
    const hoverBoost = isHovering ? 0.8 : 0
    const emissive = s.seamEmissive + hoverBoost
    if (seamMat1.current) {
      seamMat1.current.emissiveIntensity +=
        (emissive - seamMat1.current.emissiveIntensity) * 0.08
    }
    if (seamMat2.current) {
      seamMat2.current.emissiveIntensity +=
        (emissive * 0.85 - seamMat2.current.emissiveIntensity) * 0.08
    }

    // Internal glow.
    if (glowMat.current) {
      const targetOpacity = 0.18 * s.glowIntensity + (isHovering ? 0.08 : 0)
      glowMat.current.opacity += (targetOpacity - glowMat.current.opacity) * 0.06
    }

    // Surface distortion easing.
    if (distortRef.current) {
      distortRef.current.distort +=
        (s.distort - distortRef.current.distort) * 0.05
    }

    // Particles drift and breathe with the state.
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * s.particleSpeed * 0.4
      particlesRef.current.rotation.x += delta * s.particleSpeed * 0.15
      const spread = s.particleSpread + spinEnergy.current * 0.7
      particlesRef.current.scale.lerp(
        new THREE.Vector3(spread, spread, spread),
        0.06,
      )
    }

    if (pointsMaterialRef.current) {
      pointsMaterialRef.current.size +=
        ((0.02 + spinEnergy.current * 0.08) - pointsMaterialRef.current.size) * 0.12
      pointsMaterialRef.current.opacity +=
        ((0.75 + spinEnergy.current * 0.15) - pointsMaterialRef.current.opacity) * 0.08
    }

    if (spinEnergy.current > 0) {
      spinEnergy.current = Math.max(0, spinEnergy.current - delta * 0.7)
    }
  })

  return (
    <group ref={group}>
      {/* Matte black body with subtle living distortion */}
      <mesh
        castShadow
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <MeshDistortMaterial
          ref={distortRef as never}
          color="#0c0f15"
          roughness={0.62}
          metalness={0.35}
          distort={0.08}
          speed={1.4}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Inner blue glow — a slightly smaller additive sphere */}
      <mesh scale={0.92}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <meshBasicMaterial
          ref={glowMat}
          color="#6b8bff"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Primary gold seam */}
      <mesh geometry={seamGeometry}>
        <meshStandardMaterial
          ref={seamMat1}
          color="#d7b56d"
          emissive="#d7b56d"
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>

      {/* Secondary seam, rotated to interlock like tennis-ball geometry */}
      <mesh geometry={seamGeometry} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <meshStandardMaterial
          ref={seamMat2}
          color="#e8cf95"
          emissive="#d7b56d"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Particle accents */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMaterialRef as never}
          size={0.02}
          color="#d7b56d"
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}
