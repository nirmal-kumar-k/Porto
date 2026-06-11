import { useState, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Check, Github, Linkedin, Mail, Loader2 } from "lucide-react"
import { Section, SectionHeading } from "@/components/section"
import { Reveal } from "@/components/reveal"
import { MagneticButton } from "@/components/magnetic-button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

type Status = "idle" | "sending" | "sent"

interface FieldErrors {
  name?: string
  email?: string
  message?: string
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Contact() {
  const [status, setStatus] = useState<Status>("idle")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!form.name.trim()) next.name = "Please enter your name."
    if (!emailRe.test(form.email)) next.email = "Please enter a valid email."
    if (form.message.trim().length < 10)
      next.message = "Your message should be at least 10 characters."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (status === "sending") return
    if (!validate()) return

    setStatus("sending")
    // Simulated send — wire this up to your backend/email service later.
    await new Promise((r) => setTimeout(r, 1400))
    setStatus("sent")
    setForm({ name: "", email: "", message: "" })
    setTimeout(() => setStatus("idle"), 4000)
  }

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <Section id="contact" className="relative pb-32">
      <SectionHeading
        index="04"
        title="Get in Touch"
        subtitle="Have a project, a role, or an idea worth building? I'd love to hear about it."
      />

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: direct links */}
        <div className="space-y-8 lg:col-span-5">
          <Reveal>
            <p className="text-balance text-xl font-light leading-relaxed text-fg md:text-2xl">
              I&apos;m always open to thoughtful conversations and good problems.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-3">
              <ContactLink
                href={`mailto:${siteConfig.email}`}
                icon={<Mail size={18} strokeWidth={1.5} />}
                label={siteConfig.email}
              />
              <ContactLink
                href={siteConfig.github}
                icon={<Github size={18} strokeWidth={1.5} />}
                label="GitHub"
                external
              />
              <ContactLink
                href={siteConfig.linkedin}
                icon={<Linkedin size={18} strokeWidth={1.5} />}
                label="LinkedIn"
                external
              />
            </div>
          </Reveal>
        </div>

        {/* Right: form */}
        <Reveal delay={0.15} className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="glass rounded-3xl p-6 md:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                id="name"
                label="Name"
                value={form.name}
                onChange={update("name")}
                error={errors.name}
                placeholder="Your name"
              />
              <Field
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={update("email")}
                error={errors.email}
                placeholder="you@example.com"
              />
            </div>

            <Field
              id="message"
              label="Message"
              textarea
              value={form.message}
              onChange={update("message")}
              error={errors.message}
              placeholder="Tell me a little about what you have in mind…"
              className="mt-5"
            />

            <div className="mt-6 flex items-center justify-between gap-4">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.p
                    key="sent"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm text-gold"
                  >
                    <Check size={16} /> Message sent successfully.
                  </motion.p>
                ) : (
                  <motion.span
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-fg-subtle"
                  >
                    I usually reply within a day or two.
                  </motion.span>
                )}
              </AnimatePresence>

              <MagneticButton
                onClick={() => {
                  // form submit is handled by the form's onSubmit; trigger it here too
                  const formEl = document.getElementById("contact") as HTMLElement | null
                  formEl?.querySelector("form")?.requestSubmit()
                }}
                cursorLabel="Send"
                ariaLabel="Send message"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send Message <ArrowUpRight size={16} />
                  </>
                )}
              </MagneticButton>
            </div>
          </form>
        </Reveal>
      </div>

      <footer className="mt-28">
        <div className="hairline" />
        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-sm text-fg-subtle md:flex-row">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. Built with intention.
          </span>
          <span className="font-mono text-xs uppercase tracking-wider">
            {siteConfig.location}
          </span>
        </div>
      </footer>
    </Section>
  )
}

function ContactLink({
  href,
  icon,
  label,
  external,
}: {
  href: string
  icon: React.ReactNode
  label: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor="true"
      className="group flex items-center justify-between rounded-2xl border border-line bg-surface/40 px-5 py-4 transition-colors duration-300 hover:border-gold/40 hover:bg-surface/70"
    >
      <span className="flex items-center gap-3 text-fg">
        <span className="text-gold">{icon}</span>
        {label}
      </span>
      <ArrowUpRight
        size={16}
        className="text-fg-subtle transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
      />
    </a>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  textarea,
  className,
}: {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  placeholder?: string
  type?: string
  textarea?: boolean
  className?: string
}) {
  const base =
    "w-full rounded-xl border bg-bg/60 px-4 py-3 text-sm text-black placeholder:text-fg-subtle/70 outline-none transition-colors duration-300 focus:border-gold/60"
  const borderClass = error ? "border-blue/70" : "border-line"

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-xs uppercase tracking-wider text-fg-subtle"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className={cn(base, borderClass, "resize-none")}
          style={{ color: "#000000" }}
          aria-invalid={!!error}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(base, borderClass)}
          style={{ color: "#000000" }}
          aria-invalid={!!error}
        />
      )}
      {error && <p className="mt-1.5 text-xs text-blue">{error}</p>}
    </div>
  )
}
