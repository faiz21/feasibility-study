import type { GridSpanConfig } from "../report-grid";
import type { ReportPalette, ReportTypography } from "../report-theme";
import { HighlightList } from "./highlight-list";

export type ChecklistProps = {
  title?: string;
  items: string[];
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function Checklist({
  title = "Highlights",
  items,
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 12, lg: 6 },
  className,
}: ChecklistProps) {
  return (
    <HighlightList
      title={title}
      items={items}
      mode="checklist"
      palette={palette}
      colorPicker={colorPicker}
      typography={typography}
      gridSpan={gridSpan}
      className={className}
    />
  );
}
