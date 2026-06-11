import { useId, useLayoutEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-media"
import { useAntiGravity } from "./provider"

interface FloatProps {
  children: ReactNode
  className?: string
  /** How strongly this block reacts to the cursor (0.5 = subtle, 2 = dramatic). */
  strength?: number
}

/** Wraps any UI block so it drifts and repels from the cursor like antigravity.google. */
export function Float({ children, className, strength = 1 }: FloatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const { register, unregister } = useAntiGravity()
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (reduced || !ref.current) return
    register(id, ref, strength)
    return () => unregister(id)
  }, [id, register, unregister, strength, reduced])

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  )
}
