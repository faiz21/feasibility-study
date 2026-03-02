import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

export type IconCardSize = "sm" | "md" | "lg";

const SIZE_STYLES: Record<IconCardSize, { iconWrap: string; title: string; body: string; padding: string; minHeight: string }> = {
  sm: {
    iconWrap: "h-14 w-14 -translate-y-7 text-base",
    title: "text-xl",
    body: "text-sm",
    padding: "px-4 pb-5 pt-8",
    minHeight: "min-h-[200px]",
  },
  md: {
    iconWrap: "h-16 w-16 -translate-y-8 text-lg",
    title: "text-2xl",
    body: "text-base",
    padding: "px-5 pb-6 pt-9",
    minHeight: "min-h-[230px]",
  },
  lg: {
    iconWrap: "h-20 w-20 -translate-y-10 text-xl",
    title: "text-3xl",
    body: "text-lg",
    padding: "px-6 pb-8 pt-11",
    minHeight: "min-h-[270px]",
  },
};

export type IconCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  size?: IconCardSize;
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function IconCard({
  title,
  description,
  icon,
  size = "md",
  palette,
  gridSpan = { base: 12, md: 6, lg: 4 },
  className,
}: IconCardProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("icon-card", colors);
  const sizing = SIZE_STYLES[size];

  return (
    <article className={cn(spanClassName(gridSpan), className)} style={style}>
      <div
        className={cn(
          "relative rounded-2xl border border-white/10 bg-[var(--icon-card-primary)] text-white shadow-lg",
          sizing.padding,
          sizing.minHeight,
        )}
      >
        <span
          className={cn(
            "absolute left-1/2 top-0 inline-flex -translate-x-1/2 items-center justify-center rounded-full border border-white/20 bg-[var(--icon-card-secondary)] text-white",
            sizing.iconWrap,
          )}
          aria-hidden="true"
        >
          {icon ?? <span className="font-semibold">*</span>}
        </span>
        <h4 className={cn("text-center font-black tracking-tight", sizing.title)}>{title}</h4>
        <p className={cn("mt-3 text-center leading-relaxed text-white/90", sizing.body)}>{description}</p>
      </div>
    </article>
  );
}
