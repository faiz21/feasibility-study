import type { CaseStudy } from "@/lib/case-study/types";
import type { CSSProperties } from "react";
import { DEFAULT_PORTAL_PALETTE } from "@/lib/portal-theme";

type OverviewPalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

const DEFAULT_OVERVIEW_PALETTE: OverviewPalette = {
  primary: DEFAULT_PORTAL_PALETTE.primary,
  secondary: DEFAULT_PORTAL_PALETTE.secondary,
  accent: DEFAULT_PORTAL_PALETTE.accent,
  background: "#ffffff",
  text: DEFAULT_PORTAL_PALETTE.text,
};

const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function safeColor(input: unknown, fallback: string) {
  if (typeof input !== "string") return fallback;
  const value = input.trim();
  return HEX_COLOR_RE.test(value) ? value : fallback;
}

function resolvePalette(input?: Partial<OverviewPalette>): OverviewPalette {
  return {
    primary: safeColor(input?.primary, DEFAULT_OVERVIEW_PALETTE.primary),
    secondary: safeColor(input?.secondary, DEFAULT_OVERVIEW_PALETTE.secondary),
    accent: safeColor(input?.accent, DEFAULT_OVERVIEW_PALETTE.accent),
    background: safeColor(input?.background, DEFAULT_OVERVIEW_PALETTE.background),
    text: safeColor(input?.text, DEFAULT_OVERVIEW_PALETTE.text),
  };
}

type CaseStudyOverviewProps = {
  caseStudy: Pick<CaseStudy, "overview">;
  palette?: Partial<OverviewPalette>;
  title?: string;
};

export function CaseStudyOverview({
  caseStudy,
  palette,
  title = "Overview",
}: CaseStudyOverviewProps) {
  const colors = resolvePalette(palette);
  const themeStyle = {
    "--overview-primary": colors.primary,
    "--overview-secondary": colors.secondary,
    "--overview-accent": colors.accent,
    "--overview-background": colors.background,
    "--overview-text": colors.text,
  } as CSSProperties;

  return (
    <article
      className="overflow-hidden rounded-[1.8rem] border border-foreground/10 bg-[var(--overview-background)] text-[var(--overview-text)] shadow-soft"
      style={themeStyle}
    >
      <section className="relative min-h-[420px] p-5 md:min-h-[520px] md:p-10">
        <div
          className="absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            backgroundColor: "var(--overview-background)",
            backgroundImage:
              "radial-gradient(circle at 10% 90%, rgba(15, 23, 42, 0.08) 0%, transparent 40%), radial-gradient(circle at 85% 20%, rgba(15, 23, 42, 0.06) 0%, transparent 30%), linear-gradient(145deg, rgba(29, 78, 216, 0.08), transparent 55%), repeating-linear-gradient(-22deg, rgba(15, 23, 42, 0.05) 0px, rgba(15, 23, 42, 0.05) 2px, transparent 2px, transparent 20px)",
          }}
        />

        <div className="relative z-10 w-full max-w-[520px] rounded-[1.5rem] border border-white/15 bg-[var(--overview-primary)] text-white shadow-2xl">
          <div className="h-px w-full bg-white/20" />
          <section className="space-y-7 px-7 pb-10 pt-12 md:px-9 md:pb-12">
            <p className="text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-white/70">Case Study</p>
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl" data-font="display">
              {title}
            </h2>
            <p className="text-lg leading-relaxed text-white/95 [text-wrap:pretty] md:text-[2rem] md:leading-[1.35]">
              {caseStudy.overview}
            </p>
          </section>
        </div>
      </section>
    </article>
  );
}
