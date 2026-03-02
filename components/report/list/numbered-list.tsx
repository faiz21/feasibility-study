import type { GridSpanConfig } from "../report-grid";
import type { ReportPalette, ReportTypography } from "../report-theme";
import { HighlightList } from "./highlight-list";

export type NumberedListProps = {
  title?: string;
  items: string[];
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function NumberedList({
  title = "Workflow Process",
  items,
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 12, lg: 6 },
  className,
}: NumberedListProps) {
  return (
    <HighlightList
      title={title}
      items={items}
      mode="number"
      palette={palette}
      colorPicker={colorPicker}
      typography={typography}
      gridSpan={gridSpan}
      className={className}
    />
  );
}
