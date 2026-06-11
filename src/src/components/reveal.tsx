import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
  /** Delay in seconds before the reveal begins. */
  delay?: number
  /** Direction the content travels from. */
  y?: number
  as?: "div" | "section" | "li" | "span"
}

const buildVariants = (delay: number, y: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  },
})

/**
 * Fades + slides content into view once, when it enters the viewport.
 * Framer Motion automatically respects prefers-reduced-motion globally,
 * but we also keep the travel distance small for subtlety.
 */
export function Reveal({ children, className, delay = 0, y = 24, as = "div" }: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div
  return (
    <MotionTag
      className={cn(className)}
      variants={buildVariants(delay, y)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  )
}
