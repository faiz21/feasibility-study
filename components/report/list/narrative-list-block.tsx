import LensIcon from "@mui/icons-material/Lens";
import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

export type NarrativeListBlockSize = "sm" | "md" | "lg";

const SIZE_STYLES: Record<NarrativeListBlockSize, { title: string; text: string; gap: string; dot: string }> = {
  sm: {
    title: "text-xl md:text-2xl",
    text: "text-sm md:text-base",
    gap: "space-y-2",
    dot: "h-3 w-3",
  },
  md: {
    title: "text-2xl md:text-3xl",
    text: "text-base md:text-lg",
    gap: "space-y-3",
    dot: "h-3.5 w-3.5",
  },
  lg: {
    title: "text-3xl md:text-4xl",
    text: "text-lg md:text-xl",
    gap: "space-y-4",
    dot: "h-4 w-4",
  },
};

export type NarrativeListBlockProps = {
  title?: string;
  items: string[];
  size?: NarrativeListBlockSize;
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function NarrativeListBlock({
  title = "Key Findings",
  items,
  size = "md",
  palette,
  gridSpan = { base: 12, md: 6, lg: 6 },
  className,
}: NarrativeListBlockProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("narrative-list-block", colors);
  const sizing = SIZE_STYLES[size];

  if (items.length === 0) return null;

  return (
    <section
      className={cn(
        spanClassName(gridSpan),
        "rounded-2xl border border-foreground/10 bg-[var(--narrative-list-block-background)] p-5 text-[var(--narrative-list-block-text)] md:p-6",
        className,
      )}
      style={style}
      aria-label={title}
    >
      <h3 className={cn("font-black tracking-tight", sizing.title)}>{title}</h3>
      <ul className={cn("mt-4", sizing.gap)}>
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="grid grid-cols-[auto_1fr] items-start gap-3">
            <LensIcon className={cn(sizing.dot, "mt-1 text-[var(--narrative-list-block-primary)]")} aria-hidden="true" />
            <span className={cn("leading-relaxed", sizing.text)}>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
