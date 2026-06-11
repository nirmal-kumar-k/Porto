import { Canvas } from "@react-three/fiber"
import { SceneContents } from "./scene-contents"
import { useReducedMotion } from "@/hooks/use-media"

/** Hero-local 3D canvas for the tennis-ball core. */
export default function SphereScene() {
  const reduced = useReducedMotion()

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContents />
    </Canvas>
  )
}
