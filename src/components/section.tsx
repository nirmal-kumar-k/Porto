import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { SectionId } from "@/lib/sections"
import { Reveal } from "./reveal"

interface SectionProps {
  id: SectionId
  children: ReactNode
  className?: string
  /** Use full viewport height (hero). Otherwise comfortable section padding. */
  full?: boolean
}

export function Section({ id, children, className, full }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto w-full max-w-6xl px-5 sm:px-8 snap-start",
        full ? "min-h-[100svh]" : "py-24 md:py-32",
        className,
      )}
    >
      {children}
    </section>
  )
}

interface SectionHeadingProps {
  /** Two-digit section index, e.g. "01". */
  index: string
  title: string
  subtitle?: string
  /** Optional action node (e.g. a button) shown to the right on large screens. */
  action?: ReactNode
  className?: string
}

export function SectionHeading({
  index,
  title,
  subtitle,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("mb-4", className)}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-gold">{index}</span>
            <span className="h-px w-8 bg-gold/60" />
          </div>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </Reveal>
  )
}
