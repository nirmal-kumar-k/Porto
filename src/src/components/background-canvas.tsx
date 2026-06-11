import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { BioluminescentNetwork } from "./sphere/bioluminescent-network"
import { FluidBackground } from "./sphere/fluid-background"
import { GoldDust } from "./sphere/gold-dust"
import { useSharedInteraction } from "@/state/interaction-context"
import { useReducedMotion } from "@/hooks/use-media"

/** Global ambient 3D field — spans the entire page behind all content. */
export function BackgroundCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const interaction = useSharedInteraction()
  const reduced = useReducedMotion()

  if (reduced) return null

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        frameloop="always"
        style={{ width: "100%", height: "100%" }}
      >
        <FluidBackground interaction={interaction} />
        <GoldDust interaction={interaction} />
        <BioluminescentNetwork interaction={interaction} />
      </Canvas>
    </div>
  )
}
