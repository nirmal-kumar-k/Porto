import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { InteractionState } from "@/hooks/use-interaction"

const PARTICLE_COUNT = 2200
const FIELD_RADIUS = 22 // Full-viewport spread
const REPEL_RADIUS = 5.5 // Cursor repulsion radius (anti-gravity style)

// Gold and silver palette for individual particles
const GOLD_COLOR = new THREE.Color("#d7b56d")
const SILVER_COLOR = new THREE.Color("#c0c8d8")

interface GoldDustProps {
  interaction: React.MutableRefObject<InteractionState>
}

/**
 * Casino Royale-inspired 3D particle field.
 * Thousands of microscopic golden and silver particles drift through space.
 * They respond to scroll (parallax fly-through), mouse speed (magnetic vortex),
 * and settle into calm orbital drift when the user is idle.
 */
export function GoldDust({ interaction }: GoldDustProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Per-particle data: base positions, velocities, and random seeds.
  const { positions, velocities, seeds, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const seeds = new Float32Array(PARTICLE_COUNT) // random phase offsets
    const colors = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread across the full viewport depth field.
      const rawR = Math.random()
      const r = 0.8 + Math.pow(rawR, 0.55) * (FIELD_RADIUS - 0.8)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Slow random initial drift
      velocities[i * 3] = (Math.random() - 0.5) * 0.002
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002

      seeds[i] = Math.random() * Math.PI * 2

      // 70% gold-ish, 30% silver-ish with variation
      const isGold = Math.random() < 0.7
      const baseColor = isGold ? GOLD_COLOR : SILVER_COLOR
      const variation = 0.1
      colors[i * 3] = baseColor.r + (Math.random() - 0.5) * variation
      colors[i * 3 + 1] = baseColor.g + (Math.random() - 0.5) * variation
      colors[i * 3 + 2] = baseColor.b + (Math.random() - 0.5) * variation
    }

    return { positions, velocities, seeds, colors }
  }, [])

  // Uniforms for the custom shader
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0.8 },
      uSize: { value: 3.8 },
      uScrollProgress: { value: 0 },
    }),
    [],
  )

  // Temp vectors for frame-level computation (avoid allocation)
  const _dir = useMemo(() => new THREE.Vector3(), [])
  const _particlePos = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const geo = pointsRef.current.geometry
    const posAttr = geo.attributes.position as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array

    const inter = interaction.current
    const time = state.clock.elapsedTime
    const clampedDelta = Math.min(delta, 0.05) // prevent huge jumps on tab-switch

    // Update uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
      materialRef.current.uniforms.uScrollProgress.value = inter.scrollProgress
    }

    // Mouse in world space — matches the full-screen camera frustum
    const mouseWorld = new THREE.Vector3(inter.mouseX * 9, -inter.mouseY * 5.5, 0.5)

    const mouseVel = inter.mouseVelocity
    const scrollVel = inter.scrollVelocity
    const idleT = Math.min(inter.idleTime / 3, 1)
    const repelStrength = 0.035 + mouseVel * 0.08
    const scrollPush = scrollVel * 0.18

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3
      const iy = ix + 1
      const iz = ix + 2

      _particlePos.set(posArray[ix], posArray[iy], posArray[iz])

      // === 1. Ambient drift (always active) ===
      const seed = seeds[i]
      const driftX = Math.sin(time * 0.15 + seed) * 0.0008
      const driftY = Math.cos(time * 0.12 + seed * 1.3) * 0.0006
      const driftZ = Math.sin(time * 0.1 + seed * 0.7) * 0.0005

      velocities[ix] += driftX
      velocities[iy] += driftY
      velocities[iz] += driftZ

      // === 2. Scroll parallax (particles stream past on scroll) ===
      velocities[iy] += scrollPush * (0.3 + seeds[i] * 0.7) * clampedDelta

      // === 3. Anti-gravity repulsion — particles flee the cursor ===
      _dir.copy(_particlePos).sub(mouseWorld)
      const distToMouse = _dir.length()
      if (distToMouse < REPEL_RADIUS && distToMouse > 0.05) {
        _dir.normalize()
        const falloff = 1 - distToMouse / REPEL_RADIUS
        const force = repelStrength * falloff * falloff
        velocities[ix] += _dir.x * force
        velocities[iy] += _dir.y * force
        velocities[iz] += _dir.z * force * 0.4

        // Subtle tangential swirl as they scatter
        velocities[ix] += -_dir.y * force * 0.35
        velocities[iy] += _dir.x * force * 0.35
      }

      // === 4. Idle orbital drift (gentle circular motion when user stops) ===
      if (idleT > 0.1) {
        const orbitSpeed = 0.3 * idleT
        const orbitRadius = _particlePos.length()
        if (orbitRadius > 0.5) {
          // Tangential velocity for a gentle orbit
          const tangentX = -_particlePos.z / orbitRadius
          const tangentZ = _particlePos.x / orbitRadius
          velocities[ix] += tangentX * orbitSpeed * 0.001
          velocities[iz] += tangentZ * orbitSpeed * 0.001
        }
      }

      // === 5. Gentle restoring force (keeps particles from flying away) ===
      const dist = _particlePos.length()
      if (dist > FIELD_RADIUS * 0.8) {
        const restore = (dist - FIELD_RADIUS * 0.8) * 0.002
        velocities[ix] -= (_particlePos.x / dist) * restore
        velocities[iy] -= (_particlePos.y / dist) * restore
        velocities[iz] -= (_particlePos.z / dist) * restore
      }

      // === 6. Damping (friction) ===
      const damping = 0.97
      velocities[ix] *= damping
      velocities[iy] *= damping
      velocities[iz] *= damping

      // Apply velocities
      posArray[ix] += velocities[ix]
      posArray[iy] += velocities[iy]
      posArray[iz] += velocities[iz]
    }

    posAttr.needsUpdate = true
  })

  // Custom vertex/fragment shaders for sparkle + depth-based fade
  const vertexShader = `
    uniform float uTime;
    uniform float uSize;
    uniform float uScrollProgress;
    attribute float seed;
    attribute vec3 aColor;
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = aColor;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float dist = length(mvPosition.xyz);

      // Sparkle: modulate size with a sin wave unique to each particle
      float sparkle = 0.6 + 0.4 * sin(uTime * 2.5 + seed * 6.28);

      // Depth-based size attenuation
      gl_PointSize = uSize * sparkle * (280.0 / dist);
      gl_PointSize = clamp(gl_PointSize, 0.8, 12.0);

      // Depth-based alpha: farther particles are more transparent
      vAlpha = smoothstep(20.0, 2.0, dist) * (0.5 + 0.5 * sparkle);

      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    uniform float uOpacity;
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      // Soft circular particle
      float d = length(gl_PointCoord - vec2(0.5));
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.15, d) * vAlpha * uOpacity;
      gl_FragColor = vec4(vColor, alpha);
    }
  `

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-seed"
          count={PARTICLE_COUNT}
          array={seeds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
