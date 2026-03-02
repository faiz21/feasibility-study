import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";
import { AgeDistributionBars, type AgeDistributionItem } from "../chart/age-distribution-bars";

export type DemographicsBlockProps = {
  totalAudienceLabel?: string;
  totalAudienceValue: string;
  malePercent: number;
  femalePercent: number;
  ageItems: AgeDistributionItem[];
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function DemographicsBlock({
  totalAudienceLabel = "Total Audience",
  totalAudienceValue,
  malePercent,
  femalePercent,
  ageItems,
  palette,
  gridSpan = { base: 12, lg: 6 },
  className,
}: DemographicsBlockProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("demographics", colors);

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style} aria-label="Audience demographics">
      <h3 className="text-3xl font-black tracking-tight text-[var(--demographics-section-title)] md:text-5xl">Audience Demographics :</h3>
      <div className="mt-4 grid grid-cols-12 gap-3">
        <article className="col-span-12 rounded-3xl border border-[var(--demographics-table-border)] bg-[var(--demographics-card-foreground)] p-4 text-[var(--demographics-primary-foreground)] md:col-span-5">
          <p className="text-2xl font-bold">{totalAudienceLabel}</p>
          <div className="mt-3 rounded-3xl border border-[var(--demographics-table-border)] bg-[var(--demographics-secondary)] px-4 py-5 text-center text-6xl font-black leading-none">{totalAudienceValue}</div>
        </article>
        <article className="col-span-6 rounded-3xl border border-[var(--demographics-table-border)] bg-[var(--demographics-card-foreground)] p-4 text-[var(--demographics-primary-foreground)] md:col-span-3">
          <MaleIcon sx={{ fontSize: 64, display: "block", margin: "0 auto" }} aria-hidden="true" />
          <p className="mt-5 rounded-3xl bg-[var(--demographics-secondary)] px-4 py-3 text-center text-5xl font-black leading-none">{malePercent}%</p>
        </article>
        <article className="col-span-6 rounded-3xl border border-[var(--demographics-table-border)] bg-[var(--demographics-card-foreground)] p-4 text-[var(--demographics-primary-foreground)] md:col-span-4">
          <FemaleIcon sx={{ fontSize: 64, display: "block", margin: "0 auto" }} aria-hidden="true" />
          <p className="mt-5 rounded-3xl bg-[var(--demographics-secondary)] px-4 py-3 text-center text-5xl font-black leading-none">{femalePercent}%</p>
        </article>
      </div>
      <AgeDistributionBars items={ageItems} palette={palette} className="mt-5" />
    </section>
  );
}
