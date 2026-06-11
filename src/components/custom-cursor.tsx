import { useEffect, useRef, useState } from "react"
import { usePointerFine } from "@/hooks/use-media"

/**
 * Elegant custom cursor: a small ring that expands and shows a contextual
 * label when hovering elements marked with `data-cursor` attributes.
 *
 * Usage on any element:
 *   data-cursor       -> expand the cursor
 *   data-cursor="VIEW" -> expand + show the "VIEW" label
 *
 * Automatically disabled on touch / coarse-pointer devices.
 */
export function CustomCursor() {
  const pointerFine = usePointerFine()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState("")
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!pointerFine) return
    document.documentElement.classList.add("custom-cursor-active")

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: pos.x, y: pos.y }
    let raf = 0

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      setVisible(true)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }

      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor], a, button",
      )
      if (target) {
        setActive(true)
        const explicit = target.getAttribute("data-cursor")
        setLabel(explicit && explicit !== "true" ? explicit : "")
      } else {
        setActive(false)
        setLabel("")
      }
    }

    const onLeave = () => setVisible(false)

    // Smooth trailing motion for the ring.
    const animate = () => {
      ring.x += (pos.x - ring.x) * 0.18
      ring.y += (pos.y - ring.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.documentElement.classList.remove("custom-cursor-active")
    }
  }, [pointerFine])

  if (!pointerFine) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
    >
      {/* center dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-gold"
      />
      {/* trailing ring */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-gold/60 transition-[width,height,background-color] duration-300 ease-out"
        style={{
          width: active ? 56 : 30,
          height: active ? 56 : 30,
          marginLeft: active ? -28 : -15,
          marginTop: active ? -28 : -15,
          backgroundColor: active ? "rgba(215,181,109,0.08)" : "transparent",
        }}
      >
        {label && (
          <span className="text-[9px] font-medium uppercase tracking-widest text-gold">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
