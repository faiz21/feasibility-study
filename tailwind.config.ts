import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── shadcn/ui semantic tokens ──────────────────────────────────── */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        /* ── Chart palette — shared tokens (see globals.css Zone 1) ─────── */
        chart: {
          "1": "hsl(var(--chart-1))",   /* Steel blue   — primary series   */
          "2": "hsl(var(--chart-2))",   /* Slate teal   — secondary series  */
          "3": "hsl(var(--chart-3))",   /* Warm amber   — tertiary          */
          "4": "hsl(var(--chart-4))",   /* Iris violet  — quaternary        */
          "5": "hsl(var(--chart-5))",   /* Claret rose  — fifth             */
          "6": "hsl(var(--chart-6))",   /* Forest green — sixth             */
        },

        /* ── Report design system ───────────────────────────────────────── */
        report: {
          /* Zone 3 · Editorial base (fixed) */
          bg:           "hsl(var(--report-bg))",
          surface:      "hsl(var(--report-surface))",
          ink:          "hsl(var(--report-ink))",
          "ink-subtle": "hsl(var(--report-ink-subtle))",
          "ink-surface":"hsl(var(--report-ink-surface))",
          rule:         "hsl(var(--report-rule))",

          /* Zone 2 · Client brand (overrideable) */
          brand:        "hsl(var(--report-brand))",
          "brand-light":"hsl(var(--report-brand-light))",
          "brand-on":   "hsl(var(--report-brand-on))",
          "brand-dark": "hsl(var(--report-brand-dark))",

          /* Zone 1 · Chart series (overrideable) — mirrors chart.* tokens  */
          "chart-1":    "hsl(var(--chart-1))",
          "chart-2":    "hsl(var(--chart-2))",
          "chart-3":    "hsl(var(--chart-3))",
          "chart-4":    "hsl(var(--chart-4))",
          "chart-5":    "hsl(var(--chart-5))",
          "chart-6":    "hsl(var(--chart-6))",

          /* Semantic chart roles (overrideable) */
          "chart-positive": "hsl(var(--report-chart-positive))",
          "chart-negative": "hsl(var(--report-chart-negative))",
          "chart-neutral":  "hsl(var(--report-chart-neutral))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: [
          "var(--font-playfair)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        "body-serif": [
          "var(--font-source-serif)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
