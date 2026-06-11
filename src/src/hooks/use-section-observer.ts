import { useEffect } from "react"
import { useAppState } from "@/state/app-state"
import { SECTIONS, type SectionId } from "@/lib/sections"

/**
 * Observes each section and updates the active section in app state.
 * Uses IntersectionObserver — efficient and scroll-jank free.
 */
export function useSectionObserver() {
  const { setActiveSection } = useAppState()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible intersecting section.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActiveSection(visible[0].target.id as SectionId)
        }
      },
      {
        // Trigger when a section occupies the middle band of the viewport.
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [setActiveSection])
}
