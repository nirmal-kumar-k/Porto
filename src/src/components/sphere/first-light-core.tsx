import { Suspense, lazy } from "react"
import { useReducedMotion } from "@/hooks/use-media"

const SphereScene = lazy(() => import("./scene"))

function SphereFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-64 w-64 md:h-80 md:w-80">
        <div className="absolute inset-0 rounded-full bg-[#0c0f15] shadow-[inset_0_0_60px_rgba(107,139,255,0.25),0_0_80px_-20px_rgba(107,139,255,0.4)]" />
        <div
          className="absolute inset-0 rounded-full border-2 border-gold/70"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(215,181,109,0.15), transparent 50%), radial-gradient(circle at 70% 70%, rgba(107,139,255,0.12), transparent 50%)",
          }}
        />
        <div
          className="absolute inset-4 rounded-full border-2 border-gold/50"
          style={{ transform: "rotate(0deg) scaleY(0.42)" }}
        />
        <div
          className="absolute inset-4 rounded-full border-2 border-blue/40"
          style={{ transform: "rotate(90deg) scaleY(0.42)" }}
        />
        <div className="absolute inset-0 rounded-full bg-blue/5 blur-2xl" />
      </div>
    </div>
  )
}

/** Dedicated hero canvas — reliable tennis-ball rendering. */
export function FirstLightCore() {
  const reduced = useReducedMotion()
  if (reduced) return <SphereFallback />

  return (
    <Suspense fallback={<SphereFallback />}>
      <SphereScene />
    </Suspense>
  )
}
