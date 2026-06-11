import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { createSeamCurve } from "./seam-geometry"
import { TennisBallMaterial } from "./tennis-ball-material"
import type { SphereState } from "./states"
import { useAppState } from "@/state/app-state"
import type { InteractionState } from "@/hooks/use-interaction"

const RADIUS = 1.35

interface CoreProps {
  stateRef: React.MutableRefObject<SphereState>
  pointer: React.MutableRefObject<{ x: number; y: number }>
  interaction: React.MutableRefObject<InteractionState>
}

export function Core({ stateRef, pointer, interaction }: CoreProps) {
  const group = useRef<THREE.Group>(null)
  const seamMat1 = useRef<THREE.MeshBasicMaterial>(null)
  const seamMat2 = useRef<THREE.MeshBasicMaterial>(null)
  const glowMat = useRef<THREE.MeshBasicMaterial>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const { isHovering } = useAppState()

  const { seamGeometry1, seamGeometry2 } = useMemo(() => {
    const curve1 = createSeamCurve(RADIUS * 1.04, 360, 0)
    const curve2 = createSeamCurve(RADIUS * 1.04, 360, Math.PI / 2)
    return {
      seamGeometry1: new THREE.TubeGeometry(curve1, 360, 0.045, 10, true),
      seamGeometry2: new THREE.TubeGeometry(curve2, 360, 0.045, 10, true),
    }
  }, [])

  const { positions, count } = useMemo(() => {
    const count = 260
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = RADIUS * (1.5 + Math.random() * 1.4)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    return { positions, count }
  }, [])

  useFrame((state, delta) => {
    const s = stateRef.current
    const inter = interaction.current
    if (!group.current) return

    const time = state.clock.elapsedTime
    const scrollBoost = inter.scrollVelocity
    const mouseBoost = inter.mouseVelocity
    const idleFactor = Math.min(inter.idleTime / 2.5, 1)
    const breathAmplitude = 0.03 * idleFactor
    const breathPhase = Math.sin(time * 0.8) * breathAmplitude

    const dynamicRotSpeed = s.rotationSpeed + scrollBoost * 0.8 + mouseBoost * 0.15
    group.current.rotation.y += delta * dynamicRotSpeed
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.current.y * 0.25, 0.04)

    const targetScale = s.scale + breathPhase
    group.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05,
    )

    const hoverBoost = isHovering ? 0.8 : 0
    const clickFlash = inter.clickPulse * 1.5
    const scrollGlow = scrollBoost * 0.6
    const emissive = s.seamEmissive + hoverBoost + clickFlash + scrollGlow

    if (seamMat1.current) {
      seamMat1.current.opacity += ((0.7 + emissive * 0.3) - seamMat1.current.opacity) * 0.1
    }
    if (seamMat2.current) {
      seamMat2.current.opacity += ((0.55 + emissive * 0.25) - seamMat2.current.opacity) * 0.1
    }

    if (glowMat.current) {
      const baseGlow = 0.18 * s.glowIntensity
      const hoverGlow = isHovering ? 0.08 : 0
      const scrollFlare = scrollBoost * 0.15
      const clickFlare = inter.clickPulse * 0.12
      const breathGlow = idleFactor * 0.04 * (0.5 + 0.5 * Math.sin(time * 0.8))
      const targetOpacity = baseGlow + hoverGlow + scrollFlare + clickFlare + breathGlow
      glowMat.current.opacity += (targetOpacity - glowMat.current.opacity) * 0.08
    }

    if (particlesRef.current) {
      const dynamicParticleSpeed = s.particleSpeed + scrollBoost * 0.3
      particlesRef.current.rotation.y -= delta * dynamicParticleSpeed * 0.4
      particlesRef.current.rotation.x += delta * dynamicParticleSpeed * 0.15
      const spread = s.particleSpread + breathAmplitude * 2
      particlesRef.current.scale.lerp(
        new THREE.Vector3(spread, spread, spread),
        0.04,
      )
    }
  })

  return (
    <group ref={group}>
      {/* Tennis-ball body — seams baked into shader */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[RADIUS, 128, 128]} />
        <TennisBallMaterial emissiveBoost={0.6} />
      </mesh>

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

      {/* Raised glowing seam tubes for extra depth */}
      <mesh geometry={seamGeometry1} renderOrder={10}>
        <meshBasicMaterial
          ref={seamMat1}
          color="#d7b56d"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh geometry={seamGeometry2} renderOrder={10}>
        <meshBasicMaterial
          ref={seamMat2}
          color="#6b8bff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

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
          size={0.025}
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
