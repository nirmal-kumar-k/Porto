import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        bg: "var(--background)",
        surface: "var(--surface)",
        elevated: "var(--elevated)",
        foreground: "var(--foreground)",
        fg: "var(--foreground)",
        "fg-muted": "var(--muted)",
        "fg-subtle": "var(--subtle)",
        muted: "var(--muted)",
        gold: "var(--gold)",
        blue: "var(--blue)",
        border: "var(--border)",
        line: "var(--border)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Geist", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
} satisfies Config
