import { useEffect, useState } from "react"

interface Options {
  typeSpeed?: number
  deleteSpeed?: number
  pauseAfter?: number
  pauseBefore?: number
}

/**
 * Typewriter that cycles through phrases with natural typing + deletion.
 */
export function useTyping(phrases: string[], opts: Options = {}) {
  const {
    typeSpeed = 55,
    deleteSpeed = 30,
    pauseAfter = 1600,
    pauseBefore = 400,
  } = opts
  const [text, setText] = useState("")
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
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
  }, [text, deleting, index, phrases, typeSpeed, deleteSpeed, pauseAfter, pauseBefore])

  return { text }
}
