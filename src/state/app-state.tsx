import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react"
import type { SectionId } from "@/lib/sections"

interface AppStateContextValue {
  activeSection: SectionId
  setActiveSection: (id: SectionId) => void
  isHovering: boolean
  pushHover: () => void
  popHover: () => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>("home")
  const hoverCount = useRef(0)
  const [isHovering, setIsHovering] = useState(false)

  const pushHover = useCallback(() => {
    hoverCount.current += 1
    setIsHovering(true)
  }, [])

  const popHover = useCallback(() => {
    hoverCount.current = Math.max(0, hoverCount.current - 1)
    if (hoverCount.current === 0) setIsHovering(false)
  }, [])

  return (
    <AppStateContext.Provider
      value={{ activeSection, setActiveSection, isHovering, pushHover, popHover }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider")
  return ctx
}
