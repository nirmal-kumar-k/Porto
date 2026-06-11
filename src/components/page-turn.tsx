import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAppState } from "@/state/app-state"
import { SECTIONS, SECTION_LABELS } from "@/lib/sections"
import { scrollToSection } from "@/hooks/use-smooth-scroll"

const labels: Record<string, string> = SECTION_LABELS

export function PageTurn() {
  const { activeSection } = useAppState()
  const currentIndex = SECTIONS.indexOf(activeSection)
  const previousSection = currentIndex > 0 ? SECTIONS[currentIndex - 1] : null
  const nextSection = currentIndex < SECTIONS.length - 1 ? SECTIONS[currentIndex + 1] : null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-[#0b0e1280] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="text-center text-[11px] uppercase tracking-[0.35em] text-gold/80">Page</div>
      <div className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
        {currentIndex + 1} / {SECTIONS.length}
      </div>
      <div className="text-center text-xs text-muted">{labels[activeSection]}</div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          disabled={!previousSection}
          onClick={() => previousSection && scrollToSection(previousSection)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-elevated text-foreground transition hover:border-gold/40 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          disabled={!nextSection}
          onClick={() => nextSection && scrollToSection(nextSection)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-elevated text-foreground transition hover:border-gold/40 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
