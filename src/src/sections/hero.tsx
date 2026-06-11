import { motion } from "framer-motion"
import { ArrowRight, Download, Mail, ChevronDown } from "lucide-react"
import { Section } from "@/components/section"
import { MagneticButton } from "@/components/magnetic-button"
import { FirstLightCore } from "@/components/sphere/first-light-core"
import { Float } from "@/components/antigravity/float"
import { useTyping } from "@/hooks/use-typing"
import { scrollToSection } from "@/hooks/use-smooth-scroll"
import { siteConfig } from "@/config/site"

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export function Hero() {
  const { text } = useTyping(siteConfig.typingPhrases)

  return (
    <Section id="home" full className="flex items-center pt-28 md:pt-0">
      <div className="grid w-full items-center gap-10 md:grid-cols-2 md:gap-6">
        {/* Left: copy */}
        <Float strength={1.2} className="order-2 md:order-1">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.div variants={item} className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-gold/60" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              {siteConfig.title}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-spotlight sm:text-5xl lg:text-6xl"
          >
            {siteConfig.name}
          </motion.h1>

          {/* Typing line */}
          <motion.p
            variants={item}
            className="mt-5 flex min-h-[2rem] items-center font-display text-lg text-muted sm:text-xl"
            aria-live="polite"
          >
            <span className="text-foreground">{text}</span>
            <span className="ml-0.5 inline-block h-5 w-[2px] animate-pulse bg-gold" aria-hidden="true" />
          </motion.p>

          <motion.p variants={item} className="mt-6 max-w-md text-pretty leading-relaxed text-muted">
            {siteConfig.heroIntro}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <MagneticButton variant="primary" cursorLabel="VIEW" onClick={() => scrollToSection("projects")}>
              Explore Projects
              <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton variant="secondary" cursorLabel="VISIT" href={siteConfig.resumeUrl} external>
              <Download size={16} />
              Download Resume
            </MagneticButton>
            <MagneticButton variant="ghost" onClick={() => scrollToSection("contact")}>
              <Mail size={16} />
              Get In Touch
            </MagneticButton>
          </motion.div>
        </motion.div>
        </Float>

        <Float strength={1.5} className="order-1 h-[320px] w-full md:order-2 md:h-[520px]">
          <FirstLightCore />
        </Float>
      </div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollToSection("projects")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-foreground md:flex"
        aria-label="Scroll to projects"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ChevronDown size={16} />
        </motion.span>
      </motion.button>
    </Section>
  )
}
