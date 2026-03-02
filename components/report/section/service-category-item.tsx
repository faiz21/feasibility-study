import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  paletteVars,
  resolveReportPalette,
  typographyVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";

type ServiceCategoryTone = "blue" | "charcoal" | "gray";

const CIRCLE_TONE_CLASS: Record<ServiceCategoryTone, string> = {
  blue: "bg-[var(--service-category-item-primary)] text-[var(--service-category-item-primary-foreground)]",
  charcoal: "bg-[var(--service-category-item-card-foreground)] text-[var(--service-category-item-primary-foreground)]",
  gray: "bg-[var(--service-category-item-secondary)] text-[var(--service-category-item-secondary-foreground)]",
};

export type ServiceCategoryItemProps = {
  label: string;
  icon: ReactNode;
  tone?: ServiceCategoryTone;
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function ServiceCategoryItem({
  label,
  icon,
  tone = "blue",
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 6, lg: 4 },
  className,
}: ServiceCategoryItemProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = {
    ...paletteVars("service-category-item", colors),
    ...typographyVars("service-category-item", typography),
  };

  return (
    <article className={cn(spanClassName(gridSpan), "text-center", className)} style={style}>
      <span
        className={cn(
          "mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full md:h-24 md:w-24",
          CIRCLE_TONE_CLASS[tone],
        )}
        aria-hidden="true"
      >
        <span className="h-9 w-9 md:h-11 md:w-11">{icon}</span>
      </span>
      <p
        className="mx-auto mt-3 max-w-[12ch] font-black leading-tight text-[var(--service-category-item-text)] md:text-2xl"
        style={{
          fontFamily: "var(--service-category-item-font-family)",
          fontSize: "var(--service-category-item-title-size, 1.25rem)",
        }}
      >
        {label}
      </p>
    </article>
  );
}
