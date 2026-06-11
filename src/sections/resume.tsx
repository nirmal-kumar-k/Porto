import { Download } from "lucide-react"
import { Section, SectionHeading } from "@/components/section"
import { Reveal } from "@/components/reveal"
import { MagneticButton } from "@/components/magnetic-button"
import { siteConfig, type ResumeEntry } from "@/config/site"

const groups: { label: string; entries: ResumeEntry[] }[] = [
  { label: "Experience", entries: siteConfig.resume.experience },
  { label: "Education", entries: siteConfig.resume.education },
  { label: "Achievements", entries: siteConfig.resume.achievements },
  { label: "Certifications", entries: siteConfig.resume.certifications },
]

function Timeline({ entries }: { entries: ResumeEntry[] }) {
  return (
    <ol className="relative ml-3 border-l border-line">
      {entries.map((entry, i) => (
        <Reveal as="li" key={`${entry.title}-${i}`} delay={i * 0.06} className="mb-8 pl-6 last:mb-0">
          <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-background" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h4 className="text-base font-medium text-fg">{entry.title}</h4>
            <span className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
              {entry.period}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-gold/90">{entry.subtitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{entry.detail}</p>
        </Reveal>
      ))}
    </ol>
  )
}

export function Resume() {
  return (
    <Section id="resume" className="relative">
      <SectionHeading
        index="03"
        title="Resume"
        subtitle="A record of the work, the learning, and the milestones along the way."
        action={
          <MagneticButton
            href={siteConfig.resumeUrl}
            external
            variant="secondary"
            cursorLabel="Download"
            ariaLabel="Download resume as PDF"
          >
            <Download size={16} strokeWidth={1.75} />
            Download PDF
          </MagneticButton>
        }
      />

      <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2">
        {groups.map((group) => (
          <div key={group.label}>
            <Reveal>
              <h3 className="mb-6 font-mono text-sm uppercase tracking-[0.3em] text-fg-subtle">
                {group.label}
              </h3>
            </Reveal>
            <Timeline entries={group.entries} />
          </div>
        ))}
      </div>
    </Section>
  )
}
