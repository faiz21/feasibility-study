import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  paletteVars,
  resolveReportPalette,
  typographyVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";

type ResultItem = {
  value: string;
  description: string;
};

export type ChallengeSolutionResultsCardsProps = {
  challengeTitle?: string;
  challengeText: string;
  solutionTitle?: string;
  solutionText: string;
  resultTitle?: string;
  results: ResultItem[];
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

const CARD_TONES = {
  gray: "bg-[var(--csr-secondary)] text-[var(--csr-secondary-foreground)]",
  charcoal: "bg-[var(--csr-card-foreground)] text-[var(--csr-primary-foreground)]",
  blue: "bg-[var(--csr-primary)] text-[var(--csr-primary-foreground)]",
};

export function ChallengeSolutionResultsCards({
  challengeTitle = "Challenges",
  challengeText,
  solutionTitle = "Solutions",
  solutionText,
  resultTitle = "Results",
  results,
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 12, lg: 12 },
  className,
}: ChallengeSolutionResultsCardsProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = {
    ...paletteVars("csr", colors),
    ...typographyVars("csr", typography),
  };

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style}>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <article className="col-span-12 rounded-[2.25rem] p-7 md:col-span-4 md:p-9">
          <div className={cn("h-full rounded-[2.25rem] p-7 md:p-9", CARD_TONES.gray)}>
            <h3 className="font-black md:text-5xl" style={{ fontFamily: "var(--csr-font-family)", fontSize: "var(--csr-title-size, 2.25rem)" }}>{challengeTitle}</h3>
            <p className="mt-5 leading-tight md:text-[2.05rem]" style={{ fontFamily: "var(--csr-font-family)", fontSize: "var(--csr-body-size, 1.75rem)" }}>{challengeText}</p>
          </div>
        </article>

        <article className="col-span-12 rounded-[2.25rem] p-7 md:col-span-4 md:p-9">
          <div className={cn("h-full rounded-[2.25rem] p-7 md:p-9", CARD_TONES.charcoal)}>
            <h3 className="font-black md:text-5xl" style={{ fontFamily: "var(--csr-font-family)", fontSize: "var(--csr-title-size, 2.25rem)" }}>{solutionTitle}</h3>
            <p className="mt-5 leading-tight md:text-[2.05rem]" style={{ fontFamily: "var(--csr-font-family)", fontSize: "var(--csr-body-size, 1.75rem)" }}>{solutionText}</p>
          </div>
        </article>

        <article className="col-span-12 rounded-[2.25rem] p-7 md:col-span-4 md:p-9">
          <div className={cn("h-full rounded-[2.25rem] p-7 md:p-9", CARD_TONES.blue)}>
            <h3 className="font-black md:text-5xl" style={{ fontFamily: "var(--csr-font-family)", fontSize: "var(--csr-title-size, 2.25rem)" }}>{resultTitle}</h3>
            <ul className="mt-5 space-y-4">
              {results.map((result, index) => (
                <li key={`${result.value}-${index}`} className="grid grid-cols-[auto_1fr] items-start gap-4">
                  <span className="rounded-xl bg-white/35 px-3 py-1 font-black leading-none md:text-4xl" style={{ fontFamily: "var(--csr-font-family)", fontSize: "var(--csr-value-size, 1.875rem)" }}>
                    {result.value}
                  </span>
                  <span className="font-medium leading-tight md:text-[2.15rem]" style={{ fontFamily: "var(--csr-font-family)", fontSize: "var(--csr-label-size, 1.875rem)" }}>{result.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
