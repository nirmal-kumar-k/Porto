import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-media"

const COLORS = ["#d7b56d", "#6b8bff", "#c0c8d8", "#e8cf95"]
const SHAPES = ["circle", "square", "triangle"] as const
const COUNT = 130

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  shape: (typeof SHAPES)[number]
  seed: number
  depth: number
}

/**
 * Full-page 2D anti-gravity field — floating shapes that drift and flee the cursor.
 * Inspired by antigravity.google's playful physics playground.
 */
export function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    // Capture as non-nullable locals so nested closures can use them safely
    const cvs = canvas
    const cx = ctx

    let raf = 0
    let w = 0
    let h = 0

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      cvs.width = w * devicePixelRatio
      cvs.height = h * devicePixelRatio
      cvs.style.width = `${w}px`
      cvs.style.height = `${h}px`
      cx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)

      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: COUNT }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 3 + Math.random() * 7,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          seed: Math.random() * Math.PI * 2,
          depth: 0.4 + Math.random() * 0.6,
        }))
      }
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    const onLeave = () => {
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mouseleave", onLeave)

    const drawShape = (p: Particle) => {
      const s = p.size * p.depth
      cx.beginPath()
      if (p.shape === "circle") {
        cx.arc(p.x, p.y, s, 0, Math.PI * 2)
      } else if (p.shape === "square") {
        cx.rect(p.x - s, p.y - s, s * 2, s * 2)
      } else {
        cx.moveTo(p.x, p.y - s)
        cx.lineTo(p.x + s, p.y + s)
        cx.lineTo(p.x - s, p.y + s)
        cx.closePath()
      }
      cx.fill()
    }

    const tick = (time: number) => {
      cx.clearRect(0, 0, w, h)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const t = time * 0.001

      for (const p of particlesRef.current) {
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const repelRadius = 140 * p.depth

        if (dist < repelRadius && dist > 1) {
          const force = (1 - dist / repelRadius) * 2.2 * p.depth
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        p.vx += Math.sin(t * 0.6 + p.seed) * 0.012 * p.depth
        p.vy += Math.cos(t * 0.5 + p.seed * 1.3) * 0.01 * p.depth - 0.006 * p.depth

        p.vx *= 0.96
        p.vy *= 0.96
        p.x += p.vx
        p.y += p.vy

        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        cx.globalAlpha = 0.25 + p.depth * 0.45
        cx.fillStyle = p.color
        drawShape(p)
      }

      cx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[5]"
      aria-hidden="true"
    />
  )
}
