/**
 * ============================================================================
 *  SITE CONFIG — EDIT EVERYTHING HERE
 * ============================================================================
 *  This is the single source of truth for all personal content on the site.
 *  Change your name, links, projects, resume, and copy here — no need to dig
 *  through component files. Every section reads from this object.
 *
 *  Tip: keep arrays in the order you want them displayed. To add a project,
 *  copy an existing object in `projects` and edit its fields.
 * ============================================================================
 */

import type { LucideIcon } from "lucide-react"
import {
  Code2,
  Layout,
  Lightbulb,
  Sparkles,
  Users,
  Cpu,
  Shield,
} from "lucide-react"

export interface Project {
  id: string
  title: string
  tagline: string
  description: string
  /** Longer narrative shown in the case-study overlay. Each string is a paragraph. */
  caseStudy: {
    overview: string
    challenge: string
    approach: string
    outcome: string
  }
  tech: string[]
  liveUrl?: string
  githubUrl?: string
  /** Accent used on the card: "gold" | "blue" */
  accent: "gold" | "blue"
}

export interface Capability {
  id: string
  title: string
  icon: LucideIcon
  summary: string
  technologies: string[]
}

export interface ResumeEntry {
  title: string
  subtitle: string
  period: string
  detail: string
}

export const siteConfig = {
  /* ---------------------------------------------------------------- identity */
  name: "Nirmal Kumar K",
  shortName: "Welcome",
  /** Phrases cycled through by the hero typing animation. */
  typingPhrases: [
    "Engineering solutions that matter.",
    "The things we do, do things to us.",
    "Prepared for complexity.",
    "Fall seven times. Rise eight.",
    "Crafting technology with intention.",
  ],
  heroIntro:
    "Computer Science Engineer with a strong interest in problem-solving, cybersecurity, and emerging technologies, constantly exploring new domains and embracing opportunities to grow beyond my comfort zone.", 

  /* ----------------------------------------------------------------- contact */
  email: "apk.nirmal@gmail.com",
  github: "https://github.com/ChubbyBoii",
  linkedin: "https://www.linkedin.com/in/nirmxl-kumar-k",
  /** Path to your resume file in /public. Replace public/resume.pdf with yours. */
  resumeUrl: "/resume.pdf",
  location: "Coimbatore, Tamil Nadu, India",

  /* ----------------------------------------------------------------- about */
  about: {
    lead: "Pressure is a privilege. I fail, try again, own what I said I'd do, and aim to be someone that makes the people around me want to be better too",
    paragraphs: [
      "Sports taught me discipline before anything else did. Tennis is where I found it first — but I've carried that same energy into almost every sport I've tried, and every new thing I've picked up since. When I commit to something, I actually show up for it.",
      "I push myself out of my comfort zone on purpose. Not for the story, but because that's genuinely where I've grown the most. Discomfort has a way of cutting through the noise.",
      "I like meeting people, 'really' meeting them. Everyone's carrying experiences I haven't lived, and I pay attention to that. Some of the most useful things I know came from a conversation, not a classroom.",
    ],
  },

  /* ------------------------------------------------------------- capabilities */
 capabilities: [
  {
    id: "people",
    title: "Communication & Ownership",
    icon: Users,
    technologies: ["Team Collaboration", "Deadline-driven", "Peer Communication", "Leadership"],
  },
  {
    id: "fullstack",
    title: "Full Stack Development",
    icon: Code2,
    technologies: ["C#", "ASP.NET", "React", "TypeScript", "SQL Server", "EF Core"],
  },
  {
    id: "app-dev",
    title: "App Development",
    icon: Layout,
    technologies: ["React Native", "Flutter", "C#", "Swift"],
  },
 
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    icon: Shield,
    technologies: ["OWASP & OSINT", "Penetration Testing", "Threat Modelling", "Network Security", "Reverse Engineering"],
  },
  {
    id: "design",
    title: "Design & Editing",
    icon: Sparkles,
    technologies: ["Adobe After Effects", "Premiere Pro", "UI/UX", "Motion Design"],
  },
  {
    id: "hardware",
    title: "Hardware & IoT",
    icon: Cpu,
    technologies: ["IoT Systems", "RFID", "Sensors", "Edge Computing"],
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    icon: Lightbulb,
    technologies: ["Systems Thinking", "DSA", "Debugging", "Root Cause Analysis"],
  },
  
] as Capability[],

  /* ---------------------------------------------------------------- projects */
  projects: [
    {
      id: "vulnscan",
      title: "VulnScan",
      tagline: "Lightweight web penetration testing toolkit built from applied security research.",
      description:
        "A CLI-focused toolkit for ethical hackers, security researchers, and developers to identify and exploit web vulnerabilities quickly.",
      caseStudy: {
        overview:
          "VulnScan is a lightweight web penetration testing toolkit developed over three years of applied security research. It helps security teams discover vulnerabilities and generate proof-of-concept exploits in a unified workflow.",
        challenge:
          "Many web security tools are either too heavy or lack focused exploit workflows, making it difficult to move from reconnaissance to actionable findings quickly.",
        approach:
          "I built a unified CLI toolkit covering recon, vulnerability scanning, exploitation assistance, and reporting. The toolkit is designed to surface OWASP-style findings and fast PoC generation for real-world web testing.",
        outcome:
          "Security researchers and pentesters can identify web vulnerabilities faster with a streamlined workflow that consolidates scanning, exploitation, and reporting into a single interface.",
      },
      tech: ["Python", "Web Security", "Ethical Hacking", "CLI"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/ChubbyBoii",
      accent: "gold",
    },
    {
      id: "lawcraft",
      title: "LawCraft",
      tagline: "Legal AI assistant with retrieval-augmented grounded generation.",
      description:
        "A fine-tuned LLaMA-based assistant that combines Retrieval-Augmented Generation with domain-specific legal tools for grounded responses.",
      caseStudy: {
        overview:
          "LawCraft is a legal AI assistant that combines a tuned LLaMA model with RAG and Ollama to generate legally grounded responses for document drafting and analysis.",
        challenge:
          "Legal AI systems often produce generic or ungrounded outputs. The challenge was to create a model that can provide legally relevant answers while using reliable domain tools.",
        approach:
          "I applied QLoRA for efficient 4-bit model adaptation on consumer hardware, then built an agentic RAG pipeline with domain-specific legal tool selection, intent detection, smart form extraction, and case strength scoring.",
        outcome:
          "The assistant delivers locally deployable legal generation with improved grounding and relevance, enabling more reliable responses for legal workflows.",
      },
      tech: ["LLaMA", "QLoRA", "RAG", "Ollama", "Python"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/ChubbyBoii",
      accent: "blue",
    },
  ] as Project[],

  /* ----------------------------------------------------------------- resume */
  resume: {
    education: [
      {
        title: "B.E. Computer Science & Engineering",
        subtitle: "PSG College of Technology, Coimbatore",
        period: "2024 — 2027",
        detail: "Undergraduate program in computer science with a focus on software engineering and security.",
      },
      {
        title: "Diploma in Computer Science & Engineering",
        subtitle: "PSG Polytechnic College, Coimbatore",
        period: "2021 — 2024",
        detail: "Core engineering training in programming, networking, and system design.",
      },
    ] as ResumeEntry[],
    experience: [
      {
        title: "Software Engineering Intern",
        subtitle: "Mayvel Labs · Coimbatore",
        period: "June 2026 — Present",
        detail: "Embedded within a senior developer's workflow, observing and participating in industrial automation system development.",
      },
      {
        title: "Cybersecurity Intern",
        subtitle: "Hackup Technology Pvt. Ltd. · Coimbatore",
        period: "May 2024 — June 2024",
        detail: "Completed an intensive program in ethical hacking, web penetration testing, and digital forensics. Studied OWASP vulnerabilities including XSS, CSRF, SSRF, and shell upload with live PoC exercises. Built VulnScan collaboratively as the capstone project — a full-featured web pen-testing toolkit in Python.",
      },
      {
        title: "Student Volunteer Intern",
        subtitle: "Commissioner's Office — Cyber Crime Dept. · Coimbatore",
        period: "June 2023",
        detail: "Assisted on-site officers with case intake, witness coordination, and complaint registration processes. Observed and supported the end-to-end lifecycle of cyber complaint handling in a government setting.",
      },
    ] as ResumeEntry[],
    achievements: [
      {
        title: "CDTA Tennis League",
        subtitle: "Overall Division Winners",
        period: "2024",
        detail: "Won the division title in a competitive local tennis league.",
      },
      {
        title: "State-level Tennis Player",
        subtitle: "Competitive athlete representing at state tournaments",
        period: "2023",
        detail: "Represented the region in state-level tennis competitions.",
      },
      {
        title: "CSE Association Volunteer",
        subtitle: "Active participant in departmental events and tech initiatives at PSG Tech",
        period: "2023",
        detail: "Supported and organized tech events, workshops, and student activities within the CSE department.",
      },
    ] as ResumeEntry[],
    certifications: [] as ResumeEntry[],
  },
}

export type SiteConfig = typeof siteConfig
