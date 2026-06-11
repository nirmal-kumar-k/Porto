import { AppStateProvider } from "@/state/app-state"
import { InteractionProvider } from "@/state/interaction-context"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"
import { useSectionObserver } from "@/hooks/use-section-observer"
import { CustomCursor } from "@/components/custom-cursor"
import { ScrollProgress } from "@/components/scroll-progress"
import { BackgroundCanvas } from "@/components/background-canvas"
import { AntiGravityProvider } from "@/components/antigravity/provider"
import { ParticlesCanvas } from "@/components/antigravity/particles-canvas"
import { Navbar } from "@/components/navbar"
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
      <CustomCursor />
      <ScrollProgress />
      <BackgroundCanvas />
      <ParticlesCanvas />
      <Navbar />
      <main className="relative z-10">
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
      <InteractionProvider>
        <AntiGravityProvider>
          <Experience />
        </AntiGravityProvider>
      </InteractionProvider>
    </AppStateProvider>
  )
}
