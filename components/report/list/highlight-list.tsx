import type { ReactNode } from "react";
import CheckIcon from "@mui/icons-material/Check";
import LensIcon from "@mui/icons-material/Lens";
import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  paletteVars,
  resolveReportPalette,
  typographyVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";

export type HighlightListMode = "icon" | "checklist" | "number" | "bullet";

export type HighlightListItem =
  | string
  | {
      label: string;
      icon?: ReactNode;
    };

export type HighlightListProps = {
  title?: string;
  items: HighlightListItem[];
  mode?: HighlightListMode;
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

function toLabel(item: HighlightListItem) {
  return typeof item === "string" ? item : item.label;
}

function toIcon(item: HighlightListItem) {
  return typeof item === "string" ? null : item.icon ?? null;
}

export function HighlightList({
  title = "Highlights",
  items,
  mode = "bullet",
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 12, lg: 6 },
  className,
}: HighlightListProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = {
    ...paletteVars("highlight-list", colors),
    ...typographyVars("highlight-list", typography),
  };
  if (items.length === 0) return null;

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style}>
      <h3
        className="font-black tracking-tight text-[var(--highlight-list-text)] md:text-7xl"
        style={{
          fontFamily: "var(--highlight-list-font-family)",
          fontSize: "var(--highlight-list-title-size, 3rem)",
        }}
      >
        {title}
      </h3>
      <article className="mt-4 rounded-[1.75rem] bg-[var(--highlight-list-primary)] p-7 text-white md:p-8">
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={`${toLabel(item)}-${index}`} className="grid grid-cols-[auto_1fr] items-center gap-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--highlight-list-secondary)]/25 bg-[var(--highlight-list-background)] text-[var(--highlight-list-text)]">
                {mode === "number" ? (
                  <span className="text-xl font-bold leading-none">{index + 1}</span>
                ) : null}
                {mode === "checklist" ? <CheckIcon sx={{ fontSize: 20 }} aria-hidden="true" /> : null}
                {mode === "bullet" ? <LensIcon sx={{ fontSize: 10 }} aria-hidden="true" /> : null}
                {mode === "icon" ? (
                  <span className="inline-flex h-5 w-5 items-center justify-center">
                    {toIcon(item) ?? <LensIcon sx={{ fontSize: 10 }} aria-hidden="true" />}
                  </span>
                ) : null}
              </span>
              <span
                className="font-medium leading-tight md:text-[2.3rem]"
                style={{
                  fontFamily: "var(--highlight-list-font-family)",
                  fontSize: "var(--highlight-list-body-size, 2rem)",
                }}
              >
                {toLabel(item)}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
