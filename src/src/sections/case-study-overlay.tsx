import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Github } from "lucide-react"
import type { Project } from "@/config/site"
import { MagneticButton } from "@/components/magnetic-button"

interface Props {
  project: Project | null
  onClose: () => void
}

/** Accessible case-study overlay. Closes on Escape and backdrop click. */
export function CaseStudyOverlay({ project, onClose }: Props) {
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

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
        >
          <button
            type="button"
            aria-label="Close case study"
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="glass relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border-border p-6 sm:rounded-3xl sm:p-9"
          >
            <button
              type="button"
              onClick={onClose}
              data-cursor
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold/40 hover:text-foreground"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Case Study
            </span>
            <h3
              id="case-study-title"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {project.title}
            </h3>
            <p className="mt-2 text-pretty leading-relaxed text-muted">{project.tagline}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-elevated px-3 py-1 text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 space-y-6">
              {[
                ["Overview", project.caseStudy.overview],
                ["The Challenge", project.caseStudy.challenge],
                ["Approach", project.caseStudy.approach],
                ["Outcome", project.caseStudy.outcome],
              ].map(([heading, body]) => (
                <div key={heading}>
                  <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold/90">
                    {heading}
                  </h4>
                  <p className="mt-2 text-pretty leading-relaxed text-muted">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3 border-t border-border pt-6">
              {project.liveUrl && (
                <MagneticButton variant="primary" cursorLabel="VISIT" href={project.liveUrl} external>
                  Live Demo
                  <ExternalLink size={15} />
                </MagneticButton>
              )}
              {project.githubUrl && (
                <MagneticButton variant="secondary" cursorLabel="VIEW" href={project.githubUrl} external>
                  <Github size={15} />
                  Source
                </MagneticButton>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
