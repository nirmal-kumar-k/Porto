import { useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, Float } from "@react-three/drei"
import { Core } from "./core"
import { SPHERE_STATES, type SphereState } from "./states"
import { useAppState } from "@/state/app-state"

/**
 * Scene contents: lights + the Core. The active section's target state is
 * smoothly eased into `stateRef` so transitions feel cinematic.
 */
function SceneContents() {
  const { activeSection } = useAppState()
  const stateRef = useRef<SphereState>({ ...SPHERE_STATES.home })
  const targetRef = useRef<SphereState>({ ...SPHERE_STATES.home })
  const pointer = useRef({ x: 0, y: 0 })

  // Update the target whenever the active section changes.
  useEffect(() => {
    targetRef.current = SPHERE_STATES[activeSection]
  }, [activeSection])

  // Pointer tracking for gentle response.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  // Ease the live state toward the target every frame via a tiny ticker.
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 3]} intensity={1.6} color="#fff5e0" />
      <pointLight position={[-4, -2, -3]} intensity={2.2} color="#6b8bff" />
      <pointLight position={[2, -3, 4]} intensity={1.1} color="#d7b56d" />
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <Core stateRef={stateRef} pointer={pointer} />
      </Float>
      <Environment preset="city" />
    </>
  )
}

/** The full-canvas 3D scene. Rendered lazily and only as a backdrop. */
export default function SphereScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop="always"
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContents />
    </Canvas>
  )
}
