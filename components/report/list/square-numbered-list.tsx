import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

type ListSize = "sm" | "md" | "lg";
type BadgeSize = "sm" | "md" | "lg";
type BadgeStyle = "single-color" | "multi-color";

const SIZE_STYLES: Record<ListSize, { title: string; itemTitle: string; body: string }> = {
  sm: {
    title: "text-2xl md:text-3xl",
    itemTitle: "text-2xl md:text-3xl",
    body: "text-lg md:text-2xl",
  },
  md: {
    title: "text-3xl md:text-4xl",
    itemTitle: "text-3xl md:text-[2.6rem]",
    body: "text-xl md:text-[2.1rem]",
  },
  lg: {
    title: "text-4xl md:text-5xl",
    itemTitle: "text-4xl md:text-[3.1rem]",
    body: "text-2xl md:text-[2.35rem]",
  },
};

const BADGE_BOX: Record<BadgeSize, string> = {
  sm: "h-14 w-14 text-3xl md:h-16 md:w-16 md:text-4xl",
  md: "h-16 w-16 text-4xl md:h-20 md:w-20 md:text-5xl",
  lg: "h-20 w-20 text-5xl md:h-24 md:w-24 md:text-6xl",
};

export type SquareNumberedListItem = {
  title: string;
  description: string;
};

export type SquareNumberedListProps = {
  title?: string;
  items: SquareNumberedListItem[];
  palette?: Partial<ReportPalette>;
  size?: ListSize;
  badgeSize?: BadgeSize;
  badgeStyle?: BadgeStyle;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function SquareNumberedList({
  title = "Benefits",
  items,
  palette,
  size = "md",
  badgeSize = "md",
  badgeStyle = "single-color",
  gridSpan = { base: 12, lg: 5 },
  className,
}: SquareNumberedListProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("square-list", colors);
  const selected = SIZE_STYLES[size];

  if (items.length === 0) return null;

  const multicolorCycle = [colors.primary, colors.secondary, colors.accent];

  return (
    <section
      className={cn(
        spanClassName(gridSpan),
        "border border-foreground/10 bg-[var(--square-list-background)] p-5 text-[var(--square-list-text)] md:p-7",
        className,
      )}
      style={style}
      aria-label={title}
    >
      <h3 className={cn("font-black uppercase tracking-tight", selected.title)}>{title}</h3>
      <ol className="mt-5 grid gap-5 md:gap-6">
        {items.map((item, index) => {
          const badgeColor =
            badgeStyle === "multi-color"
              ? multicolorCycle[index % multicolorCycle.length]
              : "var(--square-list-primary)";

          return (
            <li key={`${item.title}-${index}`} className="grid grid-cols-[auto_1fr] items-start gap-4 md:gap-5">
              <span
                className={cn("inline-flex items-center justify-center font-black text-white", BADGE_BOX[badgeSize])}
                style={{ backgroundColor: badgeColor }}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div>
                <p className={cn("font-black leading-tight", selected.itemTitle)}>{item.title}</p>
                <p className={cn("mt-1 leading-snug text-[var(--square-list-secondary)]", selected.body)}>
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
