import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import type { SectionId } from "@/lib/sections"

interface AppState {
  /** The section currently in view — drives nav highlight + sphere evolution. */
  activeSection: SectionId
  setActiveSection: (s: SectionId) => void
  /** Number of interactive elements currently hovered. >0 means the sphere
   *  should illuminate its seams. */
  hoverCount: number
  pushHover: () => void
  popHover: () => void
  isHovering: boolean
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>("home")
  const [hoverCount, setHoverCount] = useState(0)

  const pushHover = useCallback(() => setHoverCount((c) => c + 1), [])
  const popHover = useCallback(() => setHoverCount((c) => Math.max(0, c - 1)), [])

  const value = useMemo<AppState>(
    () => ({
      activeSection,
      setActiveSection,
      hoverCount,
      pushHover,
      popHover,
      isHovering: hoverCount > 0,
    }),
    [activeSection, hoverCount, pushHover, popHover],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider")
  return ctx
}
