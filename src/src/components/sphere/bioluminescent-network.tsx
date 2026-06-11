import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { InteractionState } from "@/hooks/use-interaction"

// Tuning for the Bioluminescent Network
const PARTICLE_COUNT = 400
const FIELD_RADIUS = 20
const MAX_LINES = PARTICLE_COUNT * 15
const CONNECT_DISTANCE = 2.8
const REPEL_RADIUS = 7
const REPEL_STRENGTH = 0.022

const GOLD_COLOR = new THREE.Color("#d7b56d")
const SILVER_COLOR = new THREE.Color("#c0c8d8")

interface NetworkProps {
  interaction: React.MutableRefObject<InteractionState>
}

/**
 * A Bioluminescent Network of particles.
 * Particles flock toward the cursor and draw glowing delicate lines
 * to their nearest neighbors.
 */
export function BioluminescentNetwork({ interaction }: NetworkProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Initialize particles
  const { positions, velocities, seeds, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const seeds = new Float32Array(PARTICLE_COUNT)
    const colors = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 2 + Math.random() * (FIELD_RADIUS - 2)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      velocities[i * 3] = (Math.random() - 0.5) * 0.005
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005

      seeds[i] = Math.random() * Math.PI * 2

      // Color distribution: 70% Gold, 30% Silver
      const isGold = Math.random() < 0.7
      const baseColor = isGold ? GOLD_COLOR : SILVER_COLOR
      
      const variation = 0.1
      colors[i * 3] = baseColor.r + (Math.random() - 0.5) * variation
      colors[i * 3 + 1] = baseColor.g + (Math.random() - 0.5) * variation
      colors[i * 3 + 2] = baseColor.b + (Math.random() - 0.5) * variation
    }

    return { positions, velocities, seeds, colors }
  }, [])

  // Line buffers
  const { linePositions, lineColors } = useMemo(() => {
    return {
      linePositions: new Float32Array(MAX_LINES * 2 * 3), // 2 points per line, 3 coords
      lineColors: new Float32Array(MAX_LINES * 2 * 3),
    }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 6.0 },
    }),
    [],
  )

  const _mouseWorld = useMemo(() => new THREE.Vector3(), [])
  const _dir = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    if (!pointsRef.current || !linesRef.current) return
    const time = state.clock.elapsedTime
    const inter = interaction.current
    const clampedDelta = Math.min(delta, 0.05)

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
    }

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const colAttr = pointsRef.current.geometry.attributes.aColor as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array
    const colArray = colAttr.array as Float32Array

    _mouseWorld.set(inter.mouseX * 10, -inter.mouseY * 6, 0.8)

    const mouseVel = inter.mouseVelocity
    const scrollVel = inter.scrollVelocity
    const scrollPush = scrollVel * 0.25
    const dynamicRepel = REPEL_STRENGTH + mouseVel * 0.04

    let lineIndex = 0

    // 1. Update particles and flocking
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3
      const iy = ix + 1
      const iz = ix + 2

      const px = posArray[ix]
      const py = posArray[iy]
      const pz = posArray[iz]

      // Anti-gravity: particles scatter away from the cursor
      _dir.set(px, py, pz)
      const distToMouse = _dir.distanceTo(_mouseWorld)
      if (distToMouse < REPEL_RADIUS && distToMouse > 0.05) {
        _dir.subVectors(_dir, _mouseWorld).normalize()
        const falloff = 1 - distToMouse / REPEL_RADIUS
        const push = dynamicRepel * falloff * clampedDelta
        velocities[ix] += _dir.x * push
        velocities[iy] += _dir.y * push
        velocities[iz] += _dir.z * push * 0.5
      }

      // Scroll parallax
      velocities[iy] += scrollPush * (0.5 + seeds[i] * 0.5) * clampedDelta

      // Ambient organic drift
      const seed = seeds[i]
      velocities[ix] += Math.sin(time * 0.2 + seed) * 0.0003
      velocities[iy] += Math.cos(time * 0.15 + seed * 1.2) * 0.0003
      velocities[iz] += Math.sin(time * 0.1 + seed * 0.8) * 0.0003

      // Center gravity
      const distToCenter = Math.sqrt(px * px + py * py + pz * pz)
      if (distToCenter > FIELD_RADIUS) {
        const pull = (distToCenter - FIELD_RADIUS) * 0.001
        velocities[ix] -= (px / distToCenter) * pull
        velocities[iy] -= (py / distToCenter) * pull
        velocities[iz] -= (pz / distToCenter) * pull
      }

      // Damping
      velocities[ix] *= 0.98
      velocities[iy] *= 0.98
      velocities[iz] *= 0.98

      // Apply
      posArray[ix] += velocities[ix]
      posArray[iy] += velocities[iy]
      posArray[iz] += velocities[iz]

      // 2. Check connections with other particles (O(N^2) but N is small)
      // Only check j > i to avoid duplicate lines
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        if (lineIndex >= MAX_LINES) break

        const jx = j * 3
        const jy = jx + 1
        const jz = jx + 2

        const dx = posArray[ix] - posArray[jx]
        const dy = posArray[iy] - posArray[jy]
        const dz = posArray[iz] - posArray[jz]
        const distSq = dx * dx + dy * dy + dz * dz

        if (distSq < CONNECT_DISTANCE * CONNECT_DISTANCE) {
          const lIdx = lineIndex * 6 // 2 vertices, 3 coords each

          // Vert 1
          linePositions[lIdx] = posArray[ix]
          linePositions[lIdx + 1] = posArray[iy]
          linePositions[lIdx + 2] = posArray[iz]
          // Color 1 (mix alpha based on distance squared)
          const alpha = 1.0 - distSq / (CONNECT_DISTANCE * CONNECT_DISTANCE)
          lineColors[lIdx] = colArray[ix] * alpha
          lineColors[lIdx + 1] = colArray[iy] * alpha
          lineColors[lIdx + 2] = colArray[iz] * alpha

          // Vert 2
          linePositions[lIdx + 3] = posArray[jx]
          linePositions[lIdx + 4] = posArray[jy]
          linePositions[lIdx + 5] = posArray[jz]
          // Color 2
          lineColors[lIdx + 3] = colArray[jx] * alpha
          lineColors[lIdx + 4] = colArray[jy] * alpha
          lineColors[lIdx + 5] = colArray[jz] * alpha

          lineIndex++
        }
      }
    }

    posAttr.needsUpdate = true

    const lineGeo = linesRef.current.geometry
    lineGeo.setDrawRange(0, lineIndex * 2)
    ;(lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    ;(lineGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true
  })

  // Points shader (glowing cores)
  const vertexShader = `
    uniform float uTime;
    uniform float uSize;
    attribute float seed;
    attribute vec3 aColor;
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = aColor;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float dist = length(mvPosition.xyz);

      // Organic pulsation
      float pulse = 0.6 + 0.4 * sin(uTime * 1.5 + seed);

      gl_PointSize = uSize * pulse * (150.0 / dist);
      gl_PointSize = clamp(gl_PointSize, 1.0, 12.0);

      vAlpha = smoothstep(25.0, 5.0, dist);
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      // Soft circular glow
      float d = length(gl_PointCoord - vec2(0.5));
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
      gl_FragColor = vec4(vColor, alpha * 0.8);
    }
  `

  return (
    <group>
      {/* The particles */}
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

      {/* The connecting network lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={MAX_LINES * 2}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={MAX_LINES * 2}
            array={lineColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}
