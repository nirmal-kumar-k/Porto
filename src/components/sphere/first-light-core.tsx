import { Suspense, lazy } from "react"

const SphereScene = lazy(() => import("./scene"))

/**
 * A refined CSS-only stand-in shown while the 3D scene loads.
 * Keeps the hero composition intact while the WebGL scene initializes.
 */
function SphereFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-64 w-64 md:h-80 md:w-80">
        <div className="absolute inset-0 rounded-full bg-[#0c0f15] shadow-[inset_0_0_60px_rgba(107,139,255,0.25),0_0_80px_-20px_rgba(107,139,255,0.4)]" />
        <div className="absolute inset-0 rounded-full border border-gold/40" />
        <div
          className="absolute inset-6 rounded-full border border-gold/30"
          style={{ transform: "rotate(40deg) scaleY(0.4)" }}
        />
        <div
          className="absolute inset-6 rounded-full border border-gold/30"
          style={{ transform: "rotate(-40deg) scaleY(0.4)" }}
        />
        <div className="absolute inset-0 rounded-full bg-blue/5 blur-2xl" />
      </div>
    </div>
  )
}

/**
 * Public sphere entry point. Lazily loads the WebGL scene and gracefully
 * falls back only while the scene is loading.
 */
export function FirstLightCore() {
  return (
    <Suspense fallback={<SphereFallback />}>
      <SphereScene />
    </Suspense>
  )
}
