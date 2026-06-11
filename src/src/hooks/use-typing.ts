import { useEffect, useState } from "react"
import { useReducedMotion } from "./use-media"

interface Options {
  typeSpeed?: number
  deleteSpeed?: number
  pauseAfter?: number
  pauseBefore?: number
}

/**
 * Typewriter that cycles through phrases with natural typing + deletion.
 * Respects reduced motion by showing the first phrase statically.
 */
export function useTyping(phrases: string[], opts: Options = {}) {
  const {
    typeSpeed = 55,
    deleteSpeed = 30,
    pauseAfter = 1600,
    pauseBefore = 400,
  } = opts
  const reduced = useReducedMotion()
  const [text, setText] = useState(reduced ? phrases[0] : "")
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduced) {
      setText(phrases[0])
      return
    }

    const current = phrases[index % phrases.length]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pauseAfter)
    } else if (deleting && text === "") {
      timeout = setTimeout(() => {
        setDeleting(false)
        setIndex((i) => i + 1)
      }, pauseBefore)
    } else {
      timeout = setTimeout(
        () => {
          const next = deleting
            ? current.slice(0, text.length - 1)
            : current.slice(0, text.length + 1)
          setText(next)
        },
        deleting ? deleteSpeed : typeSpeed,
      )
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, index, phrases, reduced, typeSpeed, deleteSpeed, pauseAfter, pauseBefore])

  return { text, isReduced: reduced }
}
