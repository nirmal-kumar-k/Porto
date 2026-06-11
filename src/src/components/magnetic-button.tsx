import { useRef, type ReactNode, type MouseEvent } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAppState } from "@/state/app-state"
import { usePointerFine, useReducedMotion } from "@/hooks/use-media"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  /** Render as an external anchor (opens in new tab). */
  external?: boolean
  variant?: "primary" | "secondary" | "ghost"
  cursorLabel?: string
  ariaLabel?: string
}

const variants = {
  primary:
    "bg-gold text-background hover:bg-gold/90 shadow-[0_0_30px_-8px_rgba(215,181,109,0.5)]",
  secondary:
    "bg-elevated text-foreground border border-border hover:border-gold/40 hover:bg-elevated/80",
  ghost: "text-muted hover:text-foreground",
}

/**
 * A button that gently pulls toward the cursor (magnetic effect) and signals
 * hover to the global app state so the sphere can react. Degrades gracefully
 * on touch devices and with reduced motion.
 */
export function MagneticButton({
  children,
  className,
  onClick,
  href,
  external,
  variant = "primary",
  cursorLabel,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { pushHover, popHover } = useAppState()
  const pointerFine = usePointerFine()
  const reduced = useReducedMotion()

  const handleMove = (e: MouseEvent) => {
    if (!pointerFine || reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`
  }

  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)"
    popHover()
  }

  const handleClick = () => {
    if (href) {
      if (external) {
        window.open(href, "_blank", "noopener,noreferrer")
      } else {
        onClick?.()
      }
    } else {
      onClick?.()
    }
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      data-cursor={cursorLabel ?? "true"}
      onMouseEnter={pushHover}
      onMouseLeave={reset}
      onMouseMove={handleMove}
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 ease-out will-change-transform",
        variants[variant],
        className,
      )}
      style={{ transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), background-color 0.3s, border-color 0.3s, color 0.3s" }}
    >
      {children}
    </motion.button>
  )
}

interface InteractiveProps {
  children: ReactNode
  className?: string
  /** Element/component to render as. Defaults to "div". */
  as?: "div" | "article" | "li" | "section"
  cursorLabel?: string
  onClick?: () => void
}

/**
 * A non-button wrapper that signals hover to the global app state (so the
 * sphere reacts) and tags itself for the custom cursor. Use for cards and
 * other hoverable surfaces that aren't buttons.
 */
export function Interactive({
  children,
  className,
  as = "div",
  cursorLabel,
  onClick,
}: InteractiveProps) {
  const { pushHover, popHover } = useAppState()
  const Tag = motion[as] as typeof motion.div

  return (
    <Tag
      data-cursor={cursorLabel ?? "true"}
      onMouseEnter={pushHover}
      onMouseLeave={popHover}
      onClick={onClick}
      className={cn(className)}
    >
      {children}
    </Tag>
  )
}
