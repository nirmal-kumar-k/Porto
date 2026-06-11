import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SECTIONS, SECTION_LABELS } from "@/lib/sections"
import { useAppState } from "@/state/app-state"
import { scrollToSection } from "@/hooks/use-smooth-scroll"
import { siteConfig } from "@/config/site"
import { Float } from "@/components/antigravity/float"

export function Navbar() {
  const { activeSection, pushHover, popHover } = useAppState()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (id: string) => {
    scrollToSection(id)
    setMobileOpen(false)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <Float strength={0.6} className="w-full max-w-3xl">
        <nav
          className="glass flex w-full items-center justify-between rounded-full px-4 py-2.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
          aria-label="Primary"
        >
          {/* Brand */}
          <button
            type="button"
            onClick={() => handleNav("home")}
            onMouseEnter={pushHover}
            onMouseLeave={popHover}
            data-cursor
            className="group flex items-center gap-2 pl-2"
            aria-label="Go to top"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute h-2 w-2 rounded-full bg-gold transition-transform duration-300 group-hover:scale-150" />
              <span className="absolute h-5 w-5 rounded-full border border-gold/50" />
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              {siteConfig.shortName}
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((id) => {
              const active = activeSection === id
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => handleNav(id)}
                    onMouseEnter={pushHover}
                    onMouseLeave={popHover}
                    data-cursor
                    className={cn(
                      "relative rounded-full px-4 py-1.5 text-sm transition-colors duration-300",
                      active ? "text-foreground" : "text-muted hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-elevated"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{SECTION_LABELS[id]}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Mobile toggle */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
        </Float>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-background/95 backdrop-blur-xl md:hidden"
          >
            {SECTIONS.map((id, i) => (
              <motion.button
                key={id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleNav(id)}
                className={cn(
                  "font-display text-2xl font-medium transition-colors",
                  activeSection === id ? "text-gold" : "text-muted",
                )}
              >
                {SECTION_LABELS[id]}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
