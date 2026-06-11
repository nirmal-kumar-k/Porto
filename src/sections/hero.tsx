import { motion } from "framer-motion"
import { ArrowRight, Download, Mail, ChevronDown, Github, Linkedin } from "lucide-react"
import { Section } from "@/components/section"
import { MagneticButton } from "@/components/magnetic-button"
import { FirstLightCore } from "@/components/sphere/first-light-core"
import { useTyping } from "@/hooks/use-typing"
import { scrollToSection } from "@/hooks/use-smooth-scroll"
import { siteConfig } from "@/config/site"

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}
const lineVariant = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.6, delay: 0.1 } },
}
const sphereVariant = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }
  },
}

export function Hero() {
  const { text } = useTyping(siteConfig.typingPhrases)

  return (
    <Section id="home" full className="flex items-center pt-28 md:pt-0">
      <div className="grid w-full items-center gap-10 md:grid-cols-2 md:gap-6">
        {/* Left: copy */}
        <motion.div variants={container} initial="hidden" animate="visible" className="order-2 md:order-1 mx-auto w-full max-w-2xl text-center md:mx-0 md:text-left md:pl-10">
          <motion.div variants={item} className="mb-5 flex items-center justify-center gap-3 md:justify-start">
            <motion.span 
              className="h-px w-8 bg-gold/60"
              variants={lineVariant}
              initial="hidden"
              animate="visible"
            />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
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

          <motion.div variants={item} className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
            <MagneticButton variant="primary" cursorLabel="VIEW" onClick={() => scrollToSection("projects")}>
              Explore Projects
              <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton variant="secondary" cursorLabel="VISIT" href={siteConfig.resumeUrl} external>
              <Download size={16} />
              Download Resume
            </MagneticButton>
          </motion.div>

          <motion.div variants={item} className="mt-5 flex flex-wrap items-center justify-center gap-3 text-muted md:justify-start">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated/60 px-4 py-2 text-sm text-foreground transition hover:border-gold/40 hover:text-gold"
            >
              <Github size={16} />
              GitHub
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated/60 px-4 py-2 text-sm text-foreground transition hover:border-gold/40 hover:text-gold"
            >
              <Linkedin size={16} />
              LinkedIn
            </a>
            <MagneticButton variant="ghost" onClick={() => scrollToSection("contact") }>
              <Mail size={16} />
              Get In Touch
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Right: First Light Core */}
        <motion.div 
          className="order-1 h-[320px] w-full md:order-2 md:h-[520px]"
          variants={sphereVariant}
          initial="hidden"
          animate="visible"
        >
          <FirstLightCore />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollToSection("projects")}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
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
