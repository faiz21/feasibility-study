import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  paletteVars,
  resolveReportPalette,
  typographyVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";

export type BulletSummaryBlockProps = {
  title?: string;
  bullets: string[];
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function BulletSummaryBlock({
  title = "Summary",
  bullets,
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 6, lg: 6 },
  className,
}: BulletSummaryBlockProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = {
    ...paletteVars("bullet-summary", colors),
    ...typographyVars("bullet-summary", typography),
  };
  if (bullets.length === 0) return null;

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style}>
      <h4
        className="font-black text-[var(--bullet-summary-text)] md:text-6xl"
        style={{
          fontFamily: "var(--bullet-summary-font-family)",
          fontSize: "var(--bullet-summary-title-size, 3rem)",
        }}
      >
        {title}
      </h4>
      <ul className="mt-3 space-y-5">
        {bullets.map((bullet, index) => (
          <li
            key={`${bullet}-${index}`}
            className="list-disc leading-tight text-[var(--bullet-summary-text)] md:text-[2.1rem]"
            style={{
              fontFamily: "var(--bullet-summary-font-family)",
              fontSize: "var(--bullet-summary-body-size, 1.9rem)",
            }}
          >
            {bullet}
          </li>
        ))}
      </ul>
    </section>
  );
}
