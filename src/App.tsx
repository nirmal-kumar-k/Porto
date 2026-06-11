import { AppStateProvider } from "@/state/app-state"
import { MotionConfig } from "framer-motion"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"
import { useSectionObserver } from "@/hooks/use-section-observer"
import { ScrollProgress } from "@/components/scroll-progress"
import { Navbar } from "@/components/navbar"
import { PageTurn } from "@/components/page-turn"
import { Hero } from "@/sections/hero"
import { Projects } from "@/sections/projects"
import { About } from "@/sections/about"
import { Resume } from "@/sections/resume"
import { Contact } from "@/sections/contact"

function Experience() {
  useSmoothScroll()
  useSectionObserver()

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <About />
        <Resume />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <MotionConfig reducedMotion="never">
        <Experience />
        <PageTurn />
      </MotionConfig>
    </AppStateProvider>
  )
}
