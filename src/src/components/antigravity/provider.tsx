import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react"
import { useReducedMotion } from "@/hooks/use-media"

interface FloatBody {
  el: HTMLElement
  strength: number
  seed: number
  x: number
  y: number
  vx: number
  vy: number
}

interface AntiGravityContextValue {
  register: (id: string, ref: RefObject<HTMLElement | null>, strength: number) => void
  unregister: (id: string) => void
}

const AntiGravityContext = createContext<AntiGravityContextValue | null>(null)

export function AntiGravityProvider({ children }: { children: ReactNode }) {
  const bodies = useRef(new Map<string, FloatBody>())
  const mouse = useRef({ x: -9999, y: -9999 })
  const reduced = useReducedMotion()

  const register = useCallback(
    (id: string, ref: RefObject<HTMLElement | null>, strength: number) => {
      const el = ref.current
      if (!el) return
      bodies.current.set(id, {
        el,
        strength,
        seed: Math.random() * Math.PI * 2,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      })
    },
    [],
  )

  const unregister = useCallback((id: string) => {
    bodies.current.delete(id)
  }, [])

  useEffect(() => {
    if (reduced) return

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    const onLeave = () => {
      mouse.current.x = -9999
      mouse.current.y = -9999
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mouseleave", onLeave)

    let raf = 0
    const tick = (time: number) => {
      const t = time * 0.001
      const mx = mouse.current.x
      const my = mouse.current.y

      for (const body of bodies.current.values()) {
        const rect = body.el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2

        const dx = cx - mx
        const dy = cy - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const radius = 180 + body.strength * 60

        if (dist < radius && dist > 1) {
          const force = (1 - dist / radius) * 1.4 * body.strength
          body.vx += (dx / dist) * force
          body.vy += (dy / dist) * force
        }

        body.vx += Math.sin(t * 0.45 + body.seed) * 0.035 * body.strength
        body.vy += Math.cos(t * 0.38 + body.seed * 1.2) * 0.03 * body.strength

        body.vx += -body.x * 0.035
        body.vy += -body.y * 0.035

        body.vx *= 0.9
        body.vy *= 0.9
        body.x += body.vx
        body.y += body.vy

        const tilt = body.x * 0.04 * body.strength
        body.el.style.transform = `translate3d(${body.x.toFixed(2)}px, ${body.y.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
      for (const body of bodies.current.values()) {
        body.el.style.transform = ""
      }
    }
  }, [reduced])

  return (
    <AntiGravityContext.Provider value={{ register, unregister }}>
      {children}
    </AntiGravityContext.Provider>
  )
}

export function useAntiGravity() {
  const ctx = useContext(AntiGravityContext)
  if (!ctx) throw new Error("useAntiGravity must be used within AntiGravityProvider")
  return ctx
}
