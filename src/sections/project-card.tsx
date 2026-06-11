import { useRef, type MouseEvent } from "react"
import { motion, useMotionValue } from "framer-motion"
import { ExternalLink, Github, ArrowUpRight } from "lucide-react"
import type { Project } from "@/config/site"
import { cn } from "@/lib/utils"
import { useAppState } from "@/state/app-state"
import { usePointerFine, useReducedMotion } from "@/hooks/use-media"

interface Props {
  project: Project
  onOpen: (p: Project) => void
}

/** A project card with subtle 3D tilt, elevation, and sphere-linked hover. */
export function ProjectCard({ project, onOpen }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { pushHover, popHover } = useAppState()
  const pointerFine = usePointerFine()
  const reduced = useReducedMotion()

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const translateY = useMotionValue(0)

  const handleMove = (e: MouseEvent) => {
    if (!pointerFine || reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 6)
    rotateX.set(-py * 6)
    translateY.set(-4)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
    translateY.set(0)
    popHover()
  }

  const accent = project.accent === "gold" ? "var(--gold)" : "var(--blue)"

  return (
    <motion.div
      ref={ref}
      layoutId={`project-card-${project.id}`}
      onMouseEnter={pushHover}
      onMouseLeave={reset}
      onMouseMove={handleMove}
      data-cursor="OPEN"
      onClick={() => onOpen(project)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-gold/30 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] sm:p-8"
      style={{ transformStyle: "preserve-3d", perspective: 900, rotateX, rotateY, y: translateY }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 230, damping: 24 }}
    >
      {/* accent wash on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 80% at 100% 0%, ${accent}14, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium"
          style={{ borderColor: `${accent}40`, color: accent }}
        >
          {project.title.charAt(0)}
        </span>
        <ArrowUpRight
          size={18}
          className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </div>

      <h3 className="relative mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
        {project.title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted">{project.description}</p>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {project.tech.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
          >
            {t}
          </span>
        ))}
      </div>

      {/* footer links */}
      <div className="relative mt-6 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted">
        <span className="font-medium text-gold/90">View case study</span>
        <span className="ml-auto flex items-center gap-3">
          {project.liveUrl && (
            <button
              type="button"
              aria-label={`Open live demo of ${project.title}`}
              data-cursor="VISIT"
              onClick={(e) => {
                e.stopPropagation()
                window.open(project.liveUrl, "_blank", "noopener,noreferrer")
              }}
              className={cn("transition-colors hover:text-foreground")}
            >
              <ExternalLink size={15} />
            </button>
          )}
          {project.githubUrl && (
            <button
              type="button"
              aria-label={`Open GitHub repository of ${project.title}`}
              data-cursor="VIEW"
              onClick={(e) => {
                e.stopPropagation()
                window.open(project.githubUrl, "_blank", "noopener,noreferrer")
              }}
              className="transition-colors hover:text-foreground"
            >
              <Github size={15} />
            </button>
          )}
        </span>
      </div>
    </motion.div>
  )
}
