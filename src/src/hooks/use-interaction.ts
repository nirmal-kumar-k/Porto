import { useEffect, useRef, useCallback } from "react"

/**
 * Live interaction signals — mutated every frame outside React for performance.
 * Any R3F `useFrame` consumer can read these without causing re-renders.
 */
export interface InteractionState {
  /** Normalized scroll velocity (0 = still, 1 = very fast). */
  scrollVelocity: number
  /** Normalized mouse velocity (0 = still, 1 = fast movement). */
  mouseVelocity: number
  /** Mouse position in NDC [-1, 1]. */
  mouseX: number
  mouseY: number
  /** Seconds since the user last moved the mouse or scrolled. */
  idleTime: number
  /** True for ~0.6s after a click, then fades. */
  clickPulse: number
  /** Scroll progress 0 → 1 through the whole page. */
  scrollProgress: number
}

/**
 * Creates and returns a mutable ref containing live interaction metrics.
 * Designed to be consumed by React Three Fiber `useFrame` loops.
 */
/** @internal Prefer `useSharedInteraction` from interaction-context in components. */
export function useInteraction() {
  const state = useRef<InteractionState>({
    scrollVelocity: 0,
    mouseVelocity: 0,
    mouseX: 0,
    mouseY: 0,
    idleTime: 0,
    clickPulse: 0,
    scrollProgress: 0,
  })

  const lastMouse = useRef({ x: 0, y: 0 })
  const lastScroll = useRef(0)
  const lastTime = useRef(performance.now())
  const lastActivityTime = useRef(performance.now())

  // Smooth the raw velocities to avoid jitter.
  const smoothScroll = useRef(0)
  const smoothMouse = useRef(0)

  const tick = useCallback(() => {
    const now = performance.now()
    const dt = Math.max((now - lastTime.current) / 1000, 0.001) // seconds
    lastTime.current = now

    const s = state.current

    // --- Scroll velocity ---
    const scrollY = window.scrollY
    const rawScrollVel = Math.abs(scrollY - lastScroll.current) / dt
    lastScroll.current = scrollY
    // Normalize: ~2000px/s → 1.0
    const normScroll = Math.min(rawScrollVel / 2000, 1)
    smoothScroll.current += (normScroll - smoothScroll.current) * 0.12
    s.scrollVelocity = smoothScroll.current

    // --- Scroll progress ---
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    s.scrollProgress = docHeight > 0 ? scrollY / docHeight : 0

    // --- Mouse velocity ---
    const mx = s.mouseX
    const my = s.mouseY
    const dx = mx - lastMouse.current.x
    const dy = my - lastMouse.current.y
    lastMouse.current.x = mx
    lastMouse.current.y = my
    const rawMouseVel = Math.sqrt(dx * dx + dy * dy) / dt
    // Normalize: ~4 NDC-units/s → 1.0
    const normMouse = Math.min(rawMouseVel / 4, 1)
    smoothMouse.current += (normMouse - smoothMouse.current) * 0.15
    s.mouseVelocity = smoothMouse.current

    // --- Idle time ---
    if (normScroll > 0.01 || normMouse > 0.01) {
      lastActivityTime.current = now
    }
    s.idleTime = (now - lastActivityTime.current) / 1000

    // --- Click pulse decay ---
    if (s.clickPulse > 0.001) {
      s.clickPulse *= Math.pow(0.04, dt) // fast exponential decay
    } else {
      s.clickPulse = 0
    }
  }, [])

  useEffect(() => {
    // Mouse tracking
    const onMove = (e: MouseEvent) => {
      state.current.mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      state.current.mouseY = (e.clientY / window.innerHeight - 0.5) * 2
      
      // Inject global CSS variables for DOM spotlight effects
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`)
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`)
    }

    // Click pulse
    const onClick = () => {
      state.current.clickPulse = 1.0
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("click", onClick, { passive: true })

    // Run the tick loop via RAF
    let rafId = 0
    const loop = () => {
      tick()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("click", onClick)
    }
  }, [tick])

  return state
}
