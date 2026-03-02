import type { CaseStudy } from "@/lib/case-study/types";
import Image from "next/image";
import { paletteVars, type ReportPalette } from "../report-theme";

export type ReportCoverPageProps = {
  caseStudy: Pick<
    CaseStudy,
    | "title"
    | "subtitle"
    | "yearLabel"
    | "reportLabel"
    | "preparedBy"
    | "preparedByLabel"
    | "company"
    | "contact"
  >;
  palette?: Partial<ReportPalette>;
  heroImageUrl?: string;
  logoUrl?: string;
  headerLabel?: string;
  pageNumberLabel?: string;
  heroOverlayOpacity?: number;
};

export function ReportCoverPage({
  caseStudy,
  palette,
  heroImageUrl = "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1800&q=80",
  logoUrl = "/brand/mv-logo.png",
  headerLabel = "HEADER LIST",
  pageNumberLabel = "1",
  heroOverlayOpacity = 0.42,
}: ReportCoverPageProps) {
  const themeStyle = paletteVars("cover", palette);

  return (
    <article
      className="overflow-hidden border border-foreground/10 bg-[var(--cover-background)] text-[var(--cover-text)]"
      style={themeStyle}
    >
      <header className="grid grid-cols-1 gap-6 bg-[var(--cover-muted)] px-8 py-8 md:grid-cols-[1fr_170px] md:items-center">
        <h1 className="text-4xl font-black tracking-tight text-[var(--cover-text)] md:text-7xl">
          {headerLabel}
        </h1>
        <div className="h-[170px] w-[170px] overflow-hidden rounded-md bg-[var(--cover-primary)] p-4">
          <Image
            src={logoUrl}
            alt={`${caseStudy.company.name} logo`}
            className="h-full w-full object-contain"
            width={140}
            height={140}
          />
        </div>
      </header>

      <section className="relative min-h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
          role="img"
          aria-label={`${caseStudy.company.name} case study cover image`}
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundColor: "var(--cover-overlay)",
            opacity: Math.max(0, Math.min(1, heroOverlayOpacity)),
          }}
        />
        <div className="absolute inset-x-0 top-[12%] bg-[var(--cover-primary)]/70 px-8 py-10 text-[var(--cover-title)] backdrop-blur-[1px]">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_0.5fr]">
            <div>
              <p className="text-4xl font-black uppercase tracking-tight md:text-7xl text-[var(--cover-title)]">
                {caseStudy.title}
              </p>
              {caseStudy.subtitle ? (
                <p className="mt-4 text-xl font-semibold text-[var(--cover-subtitle)] md:text-5xl">
                  {caseStudy.subtitle}
                </p>
              ) : null}
            </div>
            <div className="border-l-2 border-[var(--cover-subtitle)]/75 pl-5">
              <p className="text-3xl font-extrabold">
                {caseStudy.company.backgroundLabel ?? "Background"}
              </p>
              <p className="mt-3 text-base leading-relaxed">
                {caseStudy.company.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 bg-[var(--cover-muted)] md:grid-cols-[1fr_0.85fr]">
        <div className="flex items-end bg-[var(--cover-primary)] px-8 py-6 text-3xl font-bold italic leading-tight text-white md:min-h-[190px] md:text-5xl">
          <p>Empowering Change, One Step at a Time</p>
        </div>
        <div className="bg-[var(--cover-secondary)] px-8 py-8 text-white">
          <div className="flex items-start gap-5">
            {caseStudy.yearLabel ? (
              <p className="text-8xl font-black leading-[0.9]">
                {caseStudy.yearLabel.slice(0, 2)}
                <br />
                {caseStudy.yearLabel.slice(2) || caseStudy.yearLabel}
              </p>
            ) : null}
            <div className="space-y-4">
              <p className="text-5xl font-extrabold leading-tight">
                {caseStudy.reportLabel ?? "Impact Report"}
              </p>
              {caseStudy.preparedBy ? (
                <p className="text-3xl leading-tight">
                  <span className="font-semibold">
                    {caseStudy.preparedByLabel ?? "Prepared by:"}
                  </span>{" "}
                  {caseStudy.preparedBy}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <footer className="space-y-5 bg-[var(--cover-muted)] px-8 py-8">
        <div className="flex flex-wrap items-center gap-5 text-xl md:text-3xl">
          <p className="font-black uppercase">{caseStudy.company.name}</p>
          <span className="inline-flex items-center rounded-full bg-[var(--cover-tag-background)] px-4 py-1 text-base font-semibold text-[var(--cover-tag-foreground)]">
            Company Case Study
          </span>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-2 text-base md:text-xl">
          {caseStudy.contact?.phone ? (
            <p className="font-medium">{caseStudy.contact.phone}</p>
          ) : null}
          {caseStudy.contact?.website ? (
            <p className="font-medium">{caseStudy.contact.website}</p>
          ) : null}
          {caseStudy.contact?.email ? (
            <p className="font-medium">{caseStudy.contact.email}</p>
          ) : null}
        </div>
        <p className="text-right text-lg font-semibold">{pageNumberLabel}</p>
      </footer>
    </article>
  );
}
