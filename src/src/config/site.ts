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
  Server,
  Cloud,
  Lightbulb,
  Sparkles,
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
  name: "Alex Rivera",
  shortName: "Alex",
  title: "Computer Science Engineer",
  /** Phrases cycled through by the hero typing animation. */
  typingPhrases: [
    "Building meaningful software.",
    "Designing intuitive experiences.",
    "Engineering solutions that matter.",
    "Turning ideas into reality.",
    "Crafting technology with intention.",
  ],
  heroIntro:
    "I build thoughtful software at the intersection of engineering and design — systems that are precise under the hood and effortless on the surface.",

  /* ----------------------------------------------------------------- contact */
  email: "hello@alexrivera.dev",
  github: "https://github.com/alexrivera",
  linkedin: "https://linkedin.com/in/alexrivera",
  /** Path to your resume file in /public. Replace public/resume.pdf with yours. */
  resumeUrl: "/resume.pdf",
  location: "San Francisco, CA",

  /* ----------------------------------------------------------------- about */
  about: {
    lead: "I'm a Computer Science Engineer who cares as much about how something feels as how it's built.",
    paragraphs: [
      "I gravitate toward problems that sit between disciplines — where clean architecture meets human-centered design. To me, good software disappears: it does its job so well you forget it's there.",
      "I think in systems. I like understanding how the pieces connect, where the pressure points are, and how a small, well-placed decision can ripple into something elegant. When something breaks, I enjoy the puzzle of figuring out why.",
      "What motivates me is the moment an idea becomes real — when a rough concept turns into something people can actually use, trust, and enjoy.",
    ],
  },

  /* ------------------------------------------------------------- capabilities */
  capabilities: [
    {
      id: "software",
      title: "Software Engineering",
      icon: Code2,
      summary: "Designing maintainable systems with clarity and intent.",
      technologies: ["TypeScript", "Python", "Go", "Clean Architecture", "Testing"],
    },
    {
      id: "frontend",
      title: "Frontend Development",
      icon: Layout,
      summary: "Interfaces that feel fast, fluid, and considered.",
      technologies: ["React", "Next.js", "Tailwind CSS", "Motion", "Three.js"],
    },
    {
      id: "backend",
      title: "Backend Systems",
      icon: Server,
      summary: "Reliable APIs and data layers built to scale.",
      technologies: ["Node.js", "PostgreSQL", "Redis", "GraphQL", "REST"],
    },
    {
      id: "cloud",
      title: "Cloud & Deployment",
      icon: Cloud,
      summary: "Shipping confidently with modern infrastructure.",
      technologies: ["Vercel", "AWS", "Docker", "CI/CD", "Edge Functions"],
    },
    {
      id: "problem-solving",
      title: "Problem Solving",
      icon: Lightbulb,
      summary: "Breaking hard problems into elegant solutions.",
      technologies: ["Systems Thinking", "Algorithms", "Debugging", "Optimization"],
    },
    {
      id: "emerging",
      title: "Emerging Technologies",
      icon: Sparkles,
      summary: "Exploring what's next and putting it to work.",
      technologies: ["AI / LLMs", "WebGL", "Real-time", "WebAssembly"],
    },
  ] as Capability[],

  /* ---------------------------------------------------------------- projects */
  projects: [
    {
      id: "atlas",
      title: "Atlas",
      tagline: "A real-time collaboration engine for distributed teams.",
      description:
        "Conflict-free editing, presence, and sync that feels instant — even offline.",
      caseStudy: {
        overview:
          "Atlas is a collaborative document platform where multiple people can edit the same space simultaneously without conflicts, online or off.",
        challenge:
          "Real-time collaboration breaks down at the edges: lost connections, conflicting edits, and the perception of lag. The hard part wasn't sync — it was making it feel effortless.",
        approach:
          "I built the sync layer on CRDTs with an optimistic local-first model, so the UI never waits on the network. A lightweight presence protocol surfaces who's doing what in real time.",
        outcome:
          "Edits apply in under 16ms locally and reconcile seamlessly on reconnect. The result feels less like software syncing and more like a shared room.",
      },
      tech: ["TypeScript", "React", "CRDTs", "WebSockets", "PostgreSQL"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/alexrivera",
      accent: "blue",
    },
    {
      id: "prism",
      title: "Prism",
      tagline: "An analytics layer that turns raw events into clarity.",
      description:
        "A query engine and dashboard that makes complex data feel obvious.",
      caseStudy: {
        overview:
          "Prism ingests millions of product events and gives teams a clear, fast way to understand user behavior without writing SQL.",
        challenge:
          "The existing pipeline took minutes to answer simple questions. Teams stopped asking them. Speed wasn't a feature — it was the whole point.",
        approach:
          "I designed a columnar pre-aggregation layer and a typed query builder, with a UI that translates plain questions into efficient queries under the hood.",
        outcome:
          "Median query time dropped from 90 seconds to under 400ms, and non-technical teammates started exploring data on their own.",
      },
      tech: ["Go", "ClickHouse", "React", "GraphQL", "D3"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/alexrivera",
      accent: "gold",
    },
    {
      id: "signal",
      title: "Signal",
      tagline: "A focused, privacy-first habit companion.",
      description:
        "An app that helps you build routines without the noise of typical trackers.",
      caseStudy: {
        overview:
          "Signal is a minimalist habit app designed around calm, intentional interaction rather than streaks and guilt.",
        challenge:
          "Most habit apps optimize for engagement, not the user's actual goals. I wanted something that respected attention.",
        approach:
          "I designed a quiet interaction model with local-first storage, no ads, no tracking, and gentle, meaningful feedback loops.",
        outcome:
          "A small, devoted user base who describe it as the first habit app that didn't stress them out.",
      },
      tech: ["React Native", "SQLite", "Expo", "TypeScript"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/alexrivera",
      accent: "blue",
    },
  ] as Project[],

  /* ----------------------------------------------------------------- resume */
  resume: {
    education: [
      {
        title: "B.S. Computer Science",
        subtitle: "University of Example",
        period: "2018 — 2022",
        detail: "Focus on distributed systems and human-computer interaction. Graduated with honors.",
      },
    ] as ResumeEntry[],
    experience: [
      {
        title: "Senior Software Engineer",
        subtitle: "Example Labs",
        period: "2023 — Present",
        detail: "Lead engineer on real-time collaboration infrastructure serving thousands of teams.",
      },
      {
        title: "Software Engineer",
        subtitle: "Startup Co.",
        period: "2022 — 2023",
        detail: "Built core product features across frontend and backend from the ground up.",
      },
    ] as ResumeEntry[],
    achievements: [
      {
        title: "Open Source Contributor",
        subtitle: "Various Projects",
        period: "Ongoing",
        detail: "Maintainer and contributor to widely-used developer tooling.",
      },
      {
        title: "Hackathon Winner",
        subtitle: "Global Dev Challenge",
        period: "2021",
        detail: "First place for a real-time accessibility tool built in 48 hours.",
      },
    ] as ResumeEntry[],
    certifications: [
      {
        title: "AWS Certified Solutions Architect",
        subtitle: "Amazon Web Services",
        period: "2023",
        detail: "Professional-level cloud architecture certification.",
      },
    ] as ResumeEntry[],
  },
}

export type SiteConfig = typeof siteConfig
