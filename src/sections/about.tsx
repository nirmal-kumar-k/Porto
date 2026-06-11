import { Section, SectionHeading } from "@/components/section"
import { Reveal } from "@/components/reveal"
import { Interactive } from "@/components/magnetic-button"
import { siteConfig } from "@/config/site"

export function About() {
  return (
    <Section id="about" className="relative">
      <SectionHeading
        index="02"
        title="About"
        subtitle="The way I think, and the tools I reach for."
      />

      {/* Narrative */}
      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="text-balance text-2xl font-light leading-relaxed text-fg md:text-3xl">
            {siteConfig.about.lead}
          </p>
        </Reveal>

        <div className="space-y-6 lg:col-span-7">
          {siteConfig.about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-pretty text-base leading-relaxed text-fg-muted md:text-lg">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div className="mt-24">
        <Reveal>
          <h3 className="font-mono text-sm uppercase tracking-[0.3em] text-fg-subtle">
            Capabilities
          </h3>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.capabilities.map((cap, i) => {
            const Icon = cap.icon
            return (
              <Reveal key={cap.id} delay={i * 0.06}>
                <Interactive
                  as="div"
                  className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface/40 p-6 transition-colors duration-500 hover:border-gold/40"
                >
                  {/* glow */}
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/0 blur-3xl transition-all duration-700 group-hover:bg-gold/10" />

                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg text-gold transition-colors duration-500 group-hover:border-gold/40">
                      <Icon size={20} strokeWidth={1.5} />
                    </span>
                    <h4 className="text-lg font-medium text-fg">{cap.title}</h4>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                    {cap.summary}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {cap.technologies.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line bg-bg px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-fg-subtle"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </Interactive>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
