import { useState } from "react"
import { Section, SectionHeading } from "@/components/section"
import { Reveal } from "@/components/reveal"
import { ProjectCard } from "@/sections/project-card"
import { Float } from "@/components/antigravity/float"
import { CaseStudyOverlay } from "@/sections/case-study-overlay"
import { siteConfig, type Project } from "@/config/site"

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <Section id="projects" className="relative">
      <SectionHeading
        index="01"
        title="Selected Work"
        subtitle="A curated set of projects where craft, performance, and intent converge."
      />

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {siteConfig.projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.08}>
            <Float strength={1.1 + (i % 3) * 0.15}>
              <ProjectCard project={project} onOpen={() => setActive(project)} />
            </Float>
          </Reveal>
        ))}
      </div>

      <CaseStudyOverlay project={active} onClose={() => setActive(null)} />
    </Section>
  )
}
