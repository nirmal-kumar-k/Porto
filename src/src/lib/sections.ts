export const SECTIONS = ["home", "projects", "about", "resume", "contact"] as const

export type SectionId = (typeof SECTIONS)[number]

export const SECTION_LABELS: Record<SectionId, string> = {
  home: "Home",
  projects: "Projects",
  about: "About",
  resume: "Resume",
  contact: "Contact",
}
