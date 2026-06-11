import { useEffect, useRef, type WheelEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Github } from "lucide-react"
import type { Project } from "@/config/site"
import { MagneticButton } from "@/components/magnetic-button"

interface Props {
  project: Project | null
  onClose: () => void
}

/** Accessible case-study overlay. Closes on Escape and backdrop click. */
export function CaseStudyOverlay({ project, onClose }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [project, onClose])

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.stopPropagation()
    event.preventDefault()
    const container = contentRef.current
    if (!container) return
    container.scrollBy({ top: event.deltaY, behavior: "smooth" })
  }

  return (
    <AnimatePresence mode="wait">
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
        >
          <motion.button
            type="button"
            aria-label="Close case study"
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(8px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            ref={contentRef}
            layoutId={`project-card-${project.id}`}
            initial={{ y: 60, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 260, damping: 32, delay: 0.1 }}
            onWheel={handleWheel}
            className="glass relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border-border p-6 sm:rounded-3xl sm:p-9"
          >
            <motion.button
              type="button"
              onClick={onClose}
              data-cursor
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold/40 hover:text-foreground"
              aria-label="Close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={16} />
            </motion.button>

            <motion.span 
              className="text-xs font-medium uppercase tracking-[0.2em] text-gold"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Case Study
            </motion.span>
            <motion.h3
              id="case-study-title"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              {project.title}
            </motion.h3>
            <motion.p 
              className="mt-2 text-pretty leading-relaxed text-muted"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              {project.tagline}
            </motion.p>

            <motion.div 
              className="mt-6 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-elevated px-3 py-1 text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </motion.div>

            <motion.div 
              className="mt-8 space-y-6"
            >
              {[
                ["Overview", project.caseStudy.overview],
                ["The Challenge", project.caseStudy.challenge],
                ["Approach", project.caseStudy.approach],
                ["Outcome", project.caseStudy.outcome],
              ].map(([heading, body], idx) => (
                <motion.div
                  key={heading}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <motion.h4 
                    className="font-display text-sm font-semibold uppercase tracking-wider text-gold/90"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    {heading}
                  </motion.h4>
                  <motion.p 
                    className="mt-2 text-pretty leading-relaxed text-muted"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    {body}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="mt-9 flex flex-wrap gap-3 border-t border-border pt-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {project.githubUrl && (
                <MagneticButton variant="secondary" cursorLabel="VIEW" href={project.githubUrl} external>
                  <Github size={15} />
                  Source
                </MagneticButton>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
