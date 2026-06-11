# Porto — Personal Portfolio

A high-performance, interactive developer portfolio built with React, Three.js, and Framer Motion. Features a live 3D WebGL sphere, anti-gravity particle field, magnetic cursor interactions, and a real contact form backend powered by Resend.

---

## ✨ Features

- **Interactive 3D Sphere** — WebGL-rendered sphere with bioluminescent network, gold-dust particles, sonar pulse, and fluid background layers built with Three.js & React Three Fiber
- **Anti-gravity Particle Field** — 130 floating shapes that dynamically repel the cursor, inspired by Google's anti-gravity experiments
- **Magnetic Cursor** — Custom cursor with label hints that warps toward interactive elements
- **Smooth Scroll** — Powered by [Lenis](https://github.com/darkroomengineering/lenis) for buttery-smooth inertia scrolling
- **Typing Animation** — Cycling hero phrases with a blinking caret
- **Scroll-triggered Reveals** — Framer Motion animations that play as sections enter the viewport
- **Project Case Studies** — Full-screen overlay with detailed project write-ups
- **Real Contact Form** — Server-side validated form that sends emails via [Resend](https://resend.com), deployed as a Vercel Serverless Function
- **Reduced Motion Support** — Heavy animations are disabled for users who prefer reduced motion
- **Responsive** — Fully adaptive layout from mobile to ultrawide

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev) + [Vite 5](https://vitejs.dev) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| 3D / WebGL | [Three.js](https://threejs.org) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Drei](https://github.com/pmndrs/drei) |
| Animation | [Framer Motion](https://www.framer.com/motion) + [GSAP](https://gsap.com) |
| Scroll | [Lenis](https://github.com/darkroomengineering/lenis) |
| Icons | [Lucide React](https://lucide.dev) |
| Email API | [Resend](https://resend.com) |
| Deployment | [Vercel](https://vercel.com) |
| Analytics | [Vercel Analytics](https://vercel.com/analytics) |

---

## 📁 Project Structure

```
porto/
├── api/
│   ├── contact.ts          # Vercel serverless function — email via Resend
│   └── tsconfig.json       # Separate TS config for Node/CommonJS API layer
├── public/
│   ├── resume.pdf          # Resume file served at /resume.pdf
│   └── icon.svg
├── src/
│   ├── components/
│   │   ├── antigravity/
│   │   │   ├── float.tsx           # Subtle float animation wrapper
│   │   │   ├── particles-canvas.tsx # 2D canvas anti-gravity field
│   │   │   └── provider.tsx        # Mouse position context for anti-gravity
│   │   ├── sphere/
│   │   │   ├── scene.tsx                 # R3F Canvas root
│   │   │   ├── scene-contents.tsx        # Lights + sphere assembly
│   │   │   ├── core.tsx                  # Sphere mesh + state machine
│   │   │   ├── gold-dust.tsx             # GPU particle system (gold specks)
│   │   │   ├── bioluminescent-network.tsx# Animated network lines on surface
│   │   │   ├── sonar-pulse.tsx           # Expanding ring pulse effect
│   │   │   ├── fluid-background.tsx      # Animated blurred backdrop
│   │   │   ├── first-light-core.tsx      # Hero section sphere entry point
│   │   │   ├── tennis-ball-material.tsx  # Custom ShaderMaterial
│   │   │   ├── seam-geometry.ts          # Procedural geometry helper
│   │   │   └── states.ts                 # Sphere interaction state enum
│   │   ├── background-canvas.tsx   # Full-page ambient background
│   │   ├── custom-cursor.tsx       # Magnetic cursor with label
│   │   ├── magnetic-button.tsx     # Button that warps toward cursor
│   │   ├── navbar.tsx              # Fixed navigation with active section highlight
│   │   ├── reveal.tsx              # Scroll-triggered fade-in wrapper
│   │   ├── scroll-progress.tsx     # Thin top progress bar
│   │   └── section.tsx             # Layout primitive (constrained width + padding)
│   ├── config/
│   │   └── site.ts         # ⭐ Single source of truth — edit your content here
│   ├── hooks/
│   │   ├── use-interaction.ts      # Cursor position + magnetic pull logic
│   │   ├── use-media.ts            # Responsive breakpoints + reduced motion
│   │   ├── use-section-observer.ts # IntersectionObserver → active nav item
│   │   ├── use-smooth-scroll.ts    # Lenis setup + scrollToSection helper
│   │   └── use-typing.ts           # Typewriter effect with looping phrases
│   ├── sections/
│   │   ├── hero.tsx            # Full-screen intro with 3D sphere
│   │   ├── projects.tsx        # Project grid
│   │   ├── project-card.tsx    # Individual project card
│   │   ├── case-study-overlay.tsx  # Full-screen project detail panel
│   │   ├── about.tsx           # About + capabilities grid
│   │   ├── resume.tsx          # Education / experience timeline
│   │   └── contact.tsx         # Contact form + social links
│   ├── state/
│   │   ├── app-state.tsx           # Global section tracking context
│   │   ├── interaction-context.tsx # Mouse / cursor state context
│   │   └── sphere-track.tsx        # Sphere hover state context
│   ├── lib/
│   │   ├── utils.ts            # cn() Tailwind class merger
│   │   └── sections.ts         # Section IDs enum
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Design tokens (CSS variables), global styles
├── .env.example                # Required environment variables
├── vercel.json                 # Vercel build + routing config
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/nirmal-kumar-k/Porto.git
cd Porto

# Install dependencies
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
RESEND_API_KEY=re_your_api_key_here
CONTACT_TO_EMAIL=your@email.com
```

Get your free API key at [resend.com/api-keys](https://resend.com/api-keys).

### Development

```bash
npm run dev
```

> **Note:** The contact form calls `/api/contact`. For local testing of the API, use `vercel dev` instead (requires the [Vercel CLI](https://vercel.com/docs/cli)).

### Production Build

```bash
npm run build
npm run preview
```

---

## ✏️ Customizing Your Content

**All personal content lives in one file:** [`src/config/site.ts`](./src/config/site.ts)

Edit it to update:

| Field | Description |
|---|---|
| `name`, `title` | Your name and professional title |
| `typingPhrases` | Phrases cycled in the hero typing animation |
| `heroIntro` | One-line bio shown in the hero |
| `email`, `github`, `linkedin` | Contact and social links |
| `resumeUrl` | Path to your resume (default: `/resume.pdf`) |
| `location` | Shown in the footer |
| `about` | Bio paragraphs in the About section |
| `capabilities` | Skills grid cards |
| `projects` | Project cards + case study content |
| `resume` | Education, experience, achievements, certifications |

To update your resume, replace `public/resume.pdf` with your own file.

---

## 📧 Contact Form Backend

The contact form is powered by a **Vercel Serverless Function** at `api/contact.ts`.

**How it works:**
1. Client submits `POST /api/contact` with `{ name, email, message }`
2. The function validates the payload server-side
3. Sends a formatted HTML email to your inbox via Resend
4. Returns `{ ok: true }` on success

**Required environment variables** (set in Vercel dashboard → Settings → Environment Variables):

```
RESEND_API_KEY      Your Resend API key
CONTACT_TO_EMAIL    The inbox to deliver messages to
```

---

## ☁️ Deployment (Vercel)

This project is pre-configured for Vercel via [`vercel.json`](./vercel.json).

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Vite — click **Deploy**
4. Add `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in **Settings → Environment Variables**
5. Redeploy to activate the env vars

Every push to `main` triggers an automatic redeploy.

---

## 📄 License

MIT — feel free to use this as a starting point for your own portfolio.

---

<p align="center">Built with intention by <a href="https://github.com/nirmal-kumar-k">Nirmal Kumar K</a></p>
