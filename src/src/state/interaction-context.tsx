import { createContext, useContext, type ReactNode } from "react"
import { useInteraction } from "@/hooks/use-interaction"
import type { InteractionState } from "@/hooks/use-interaction"

const InteractionContext = createContext<React.MutableRefObject<InteractionState> | null>(null)

/** Single shared interaction ref for every canvas and effect on the page. */
export function InteractionProvider({ children }: { children: ReactNode }) {
  const interaction = useInteraction()
  return (
    <InteractionContext.Provider value={interaction}>{children}</InteractionContext.Provider>
  )
}

export function useSharedInteraction() {
  const ctx = useContext(InteractionContext)
  if (!ctx) throw new Error("useSharedInteraction must be used within InteractionProvider")
  return ctx
}
