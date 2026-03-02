import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

type ListSize = "sm" | "md" | "lg";
type ListDensity = "compact" | "default" | "comfortable";
type IconSize = "sm" | "md" | "lg";

const SIZE_STYLES: Record<ListSize, { titleSize: string; itemTitle: string; body: string }> = {
  sm: {
    titleSize: "text-2xl md:text-3xl",
    itemTitle: "text-2xl md:text-3xl",
    body: "text-lg md:text-2xl",
  },
  md: {
    titleSize: "text-3xl md:text-4xl",
    itemTitle: "text-3xl md:text-[2.6rem]",
    body: "text-xl md:text-[2.1rem]",
  },
  lg: {
    titleSize: "text-4xl md:text-5xl",
    itemTitle: "text-4xl md:text-[3.1rem]",
    body: "text-2xl md:text-[2.35rem]",
  },
};

const DENSITY_GAP: Record<ListDensity, string> = {
  compact: "gap-4",
  default: "gap-6",
  comfortable: "gap-8",
};

const ICON_BOX: Record<IconSize, string> = {
  sm: "h-14 w-14 text-base",
  md: "h-16 w-16 text-lg",
  lg: "h-20 w-20 text-xl",
};

export type IconListItem = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export type IconListProps = {
  title?: string;
  items: IconListItem[];
  palette?: Partial<ReportPalette>;
  size?: ListSize;
  density?: ListDensity;
  iconSize?: IconSize;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function IconList({
  title = "Goals and Objectives",
  items,
  palette,
  size = "md",
  density = "default",
  iconSize = "md",
  gridSpan = { base: 12, lg: 7 },
  className,
}: IconListProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("icon-list", colors);
  const selected = SIZE_STYLES[size];

  if (items.length === 0) return null;

  return (
    <section
      className={cn(
        spanClassName(gridSpan),
        "border border-foreground/10 bg-[var(--icon-list-background)] p-5 text-[var(--icon-list-text)] md:p-7",
        className,
      )}
      style={style}
      aria-label={title}
    >
      <h3 className={cn("font-black tracking-tight", selected.titleSize)}>{title}</h3>
      <ul className={cn("mt-5 grid", DENSITY_GAP[density])}>
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="grid grid-cols-[auto_1fr] items-start gap-4 md:gap-6">
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-full bg-[var(--icon-list-primary)] text-white",
                ICON_BOX[iconSize],
              )}
              aria-hidden="true"
            >
              {item.icon ?? <span className="font-semibold">{index + 1}</span>}
            </span>
            <div>
              <p className={cn("font-black leading-tight", selected.itemTitle)}>{item.title}</p>
              <p className={cn("mt-1 leading-snug text-[var(--icon-list-secondary)]", selected.body)}>{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
