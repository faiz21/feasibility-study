import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

export type TableDensity = "compact" | "comfortable" | "spacious";

const DENSITY_STYLES: Record<TableDensity, { cell: string; title: string }> = {
  compact: { cell: "px-2 py-2 text-xs md:text-sm", title: "text-xl md:text-2xl" },
  comfortable: { cell: "px-3 py-3 text-sm md:text-base", title: "text-2xl md:text-3xl" },
  spacious: { cell: "px-4 py-4 text-base md:text-lg", title: "text-2xl md:text-3xl" },
};

export type TableProps = {
  title?: string;
  headers: string[];
  rows: string[][];
  density?: TableDensity;
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function Table({
  title = "Table",
  headers,
  rows,
  density = "comfortable",
  palette,
  gridSpan = { base: 12, lg: 6 },
  className,
}: TableProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("table-block", colors);
  const sizing = DENSITY_STYLES[density];

  if (headers.length === 0) return null;

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style} aria-label={title}>
      <h3 className={cn("font-black tracking-tight text-[var(--table-block-text)]", sizing.title)}>{title}</h3>
      <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--table-block-secondary)]/30 bg-[var(--table-block-background)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--table-block-secondary)]/30">
              {headers.map((header) => (
                <th key={header} className={cn("text-left font-semibold text-[var(--table-block-text)]", sizing.cell)}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}-${row.join("-")}`} className="border-b border-[var(--table-block-secondary)]/20 last:border-b-0">
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`} className={cn("align-top text-[var(--table-block-text)]/90", sizing.cell)}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export { Table as Talbe };
