import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  resolveReportPalette,
  paletteVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";
import { ServiceCategoryItem } from "./service-category-item";

type ServiceCategoryLayout = "left" | "right";
type ServiceCategoryTone = "blue" | "charcoal" | "gray";

export type ServiceCategoryGridItem = {
  label: string;
  icon: ReactNode;
  tone?: ServiceCategoryTone;
};

export type ServiceCategoryGridProps = {
  items: ServiceCategoryGridItem[];
  layout?: ServiceCategoryLayout;
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function ServiceCategoryGrid({
  items,
  layout = "left",
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 6, lg: 6 },
  className,
}: ServiceCategoryGridProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = paletteVars("service-category-grid", colors);

  if (items.length === 0) return null;

  return (
    <section
      className={cn(
        spanClassName(gridSpan),
        "border border-foreground/10 bg-[var(--service-category-grid-background)] p-5 md:p-7",
        className,
      )}
      style={style}
    >
      <div
        className={cn(
          "grid grid-cols-12 gap-y-6",
          layout === "left" ? "gap-x-3" : "gap-x-3 md:pl-8",
        )}
      >
        {items.map((item, index) => (
          <ServiceCategoryItem
            key={`${item.label}-${index}`}
            label={item.label}
            icon={item.icon}
            tone={item.tone}
            palette={palette}
            colorPicker={colorPicker}
            typography={typography}
            gridSpan={{ base: 12, md: 4 }}
          />
        ))}
      </div>
    </section>
  );
}
