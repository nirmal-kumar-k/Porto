import { createContext, useContext, useRef, type ReactNode, type RefObject } from "react"

const SphereTrackContext = createContext<RefObject<HTMLDivElement> | null>(null)

/** DOM element the hero sphere is rendered into via R3F View. */
export function SphereTrackProvider({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  return (
    <SphereTrackContext.Provider value={trackRef}>{children}</SphereTrackContext.Provider>
  )
}

export function useSphereTrack() {
  const ctx = useContext(SphereTrackContext)
  if (!ctx) throw new Error("useSphereTrack must be used within SphereTrackProvider")
  return ctx
}
