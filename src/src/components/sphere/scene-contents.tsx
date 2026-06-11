import { useRef, useEffect } from "react"
import { Environment, Float } from "@react-three/drei"
import { Core } from "./core"
import { SonarPulse } from "./sonar-pulse"
import { SPHERE_STATES, type SphereState } from "./states"
import { useAppState } from "@/state/app-state"
import { useSharedInteraction } from "@/state/interaction-context"

/**
 * Lights + tennis-ball core + sonar pulses.
 * Rendered inside a View portal so it shares the global particle field.
 */
export function SceneContents() {
  const { activeSection } = useAppState()
  const stateRef = useRef<SphereState>({ ...SPHERE_STATES.home })
  const targetRef = useRef<SphereState>({ ...SPHERE_STATES.home })
  const pointer = useRef({ x: 0, y: 0 })
  const interaction = useSharedInteraction()

  useEffect(() => {
    targetRef.current = SPHERE_STATES[activeSection]
  }, [activeSection])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const s = stateRef.current
      const t = targetRef.current
      const k = 0.04
      s.rotationSpeed += (t.rotationSpeed - s.rotationSpeed) * k
      s.seamEmissive += (t.seamEmissive - s.seamEmissive) * k
      s.glowIntensity += (t.glowIntensity - s.glowIntensity) * k
      s.particleSpeed += (t.particleSpeed - s.particleSpeed) * k
      s.particleSpread += (t.particleSpread - s.particleSpread) * k
      s.scale += (t.scale - s.scale) * k
      s.distort += (t.distort - s.distort) * k
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 3]} intensity={1.6} color="#fff5e0" />
      <pointLight position={[-4, -2, -3]} intensity={2.2} color="#6b8bff" />
      <pointLight position={[2, -3, 4]} intensity={1.1} color="#d7b56d" />

      <SonarPulse interaction={interaction} />

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <Core stateRef={stateRef} pointer={pointer} interaction={interaction} />
      </Float>
      <Environment preset="city" />
    </>
  )
}
