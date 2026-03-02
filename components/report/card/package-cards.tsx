import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  paletteVars,
  resolveReportPalette,
  typographyVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";

export type PackageCardItem = {
  title: string;
  description: string;
  priceLabel: string;
};

export type PackageCardsProps = {
  heading?: string;
  items: PackageCardItem[];
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function PackageCards({
  heading = "Our Packages",
  items,
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 12, lg: 12 },
  className,
}: PackageCardsProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = {
    ...paletteVars("package-cards", colors),
    ...typographyVars("package-cards", typography),
  };
  if (items.length === 0) return null;

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style}>
      <h3
        className="font-black tracking-tight text-[var(--package-cards-text)] md:text-7xl"
        style={{
          fontFamily: "var(--package-cards-font-family)",
          fontSize: "var(--package-cards-title-size, 3rem)",
        }}
      >
        {heading}
      </h3>
      <div className="mt-4 grid grid-cols-12 gap-4 md:gap-6">
        {items.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="col-span-12 rounded-[1.75rem] bg-[var(--package-cards-primary)] p-7 text-white md:col-span-4 md:p-8"
          >
            <h4 className="font-black leading-tight md:text-5xl" style={{ fontFamily: "var(--package-cards-font-family)", fontSize: "var(--package-cards-label-size, 2.25rem)" }}>{item.title}</h4>
            <p className="mt-4 leading-tight md:text-[2rem]" style={{ fontFamily: "var(--package-cards-font-family)", fontSize: "var(--package-cards-body-size, 1.7rem)" }}>{item.description}</p>
            <div className="mt-6 rounded-2xl bg-[var(--package-cards-secondary)] px-4 py-3 text-center">
              <p className="font-black leading-tight md:text-[2.3rem]" style={{ fontFamily: "var(--package-cards-font-family)", fontSize: "var(--package-cards-value-size, 2rem)" }}>{item.priceLabel}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
