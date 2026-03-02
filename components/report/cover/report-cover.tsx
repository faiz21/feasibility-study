import Image from "next/image";
import { paletteVars, type ReportPalette } from "../report-theme";

type ReportCoverProps = {
  title: string;
  subtitle?: string;
  reportLabel?: string;
  yearLabel?: string;
  companyName?: string;
  contact?: {
    website?: string;
    email?: string;
    phone?: string;
  };
  palette?: Partial<ReportPalette>;
  logoUrl?: string;
  pageNumberLabel?: string;
};

export function ReportCover({
  title,
  subtitle,
  reportLabel = "Case Study",
  yearLabel,
  companyName,
  contact,
  palette,
  logoUrl = "/brand/mv-logo.png",
  pageNumberLabel = "1",
}: ReportCoverProps) {
  const themeStyle = paletteVars("report-cover", palette);

  return (
    <article
      className="overflow-hidden border border-foreground/10 bg-[var(--report-cover-background)] text-[var(--report-cover-text)]"
      style={themeStyle}
    >
      <section className="relative min-h-[500px] p-5 md:min-h-[560px] md:p-10">
        <div
          className="absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            backgroundColor: "var(--report-cover-background)",
            backgroundImage:
              "linear-gradient(145deg, var(--report-cover-background) 0%, var(--report-cover-muted) 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-[430px] border border-white/15 bg-[var(--report-cover-primary)] text-white shadow-2xl">
          <header className="space-y-4 px-7 pb-14 pt-14 md:px-9 md:pt-16">
            <p className="text-5xl font-black uppercase tracking-tight text-[var(--report-cover-cover-title)] md:text-6xl">TITLE</p>
            <p className="text-xl font-semibold leading-tight text-[var(--report-cover-cover-title)] md:text-4xl">{title}</p>
            {subtitle ? (
              <p className="text-lg leading-snug text-[var(--report-cover-cover-subtitle)] md:text-[2rem]">{subtitle}</p>
            ) : null}
          </header>

          <div className="h-px w-full bg-white/20" />

          <section className="space-y-7 px-7 pb-8 pt-12 md:px-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">{reportLabel}</p>
                {yearLabel ? <p className="mt-2 text-2xl font-black leading-none">{yearLabel}</p> : null}
              </div>
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-white/25 bg-white/5 p-2">
                <Image
                  src={logoUrl}
                  alt={`${companyName ?? "Report"} logo`}
                  className="h-full w-full object-contain"
                  width={40}
                  height={40}
                />
              </div>
            </div>

            {companyName ? <p className="font-semibold text-white">{companyName}</p> : null}

            <div className="space-y-1 text-sm text-white/80">
              {contact?.website ? <p>{contact.website}</p> : null}
              {contact?.email ? <p>{contact.email}</p> : null}
              {contact?.phone ? <p>{contact.phone}</p> : null}
            </div>

            <p className="pt-3 text-right text-xs font-semibold text-white/70">{pageNumberLabel}</p>
          </section>
        </div>
      </section>
    </article>
  );
}
