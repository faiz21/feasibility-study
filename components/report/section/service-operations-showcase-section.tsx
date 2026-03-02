import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  resolveReportPalette,
  paletteVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";
import {
  ChallengeSolutionResultsCards,
  type ChallengeSolutionResultsCardsProps,
} from "../card/challenge-solution-results-cards";
import { PackageCards, type PackageCardItem } from "../card/package-cards";
import { HighlightList } from "../list/highlight-list";

export type ServiceOperationsShowcaseSectionProps = {
  challengeSolutionResults: Omit<ChallengeSolutionResultsCardsProps, "palette" | "gridSpan" | "className">;
  packagesHeading?: string;
  packages: PackageCardItem[];
  workflowTitle?: string;
  workflowItems: string[];
  highlightsTitle?: string;
  highlightItems: string[];
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function ServiceOperationsShowcaseSection({
  challengeSolutionResults,
  packagesHeading = "Our Packages",
  packages,
  workflowTitle = "Workflow Process",
  workflowItems,
  highlightsTitle = "Highlights",
  highlightItems,
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 12, lg: 12 },
  className,
}: ServiceOperationsShowcaseSectionProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = paletteVars("ops-showcase", colors);

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style}>
      <div className="space-y-5 md:space-y-7">
        <ChallengeSolutionResultsCards {...challengeSolutionResults} palette={palette} colorPicker={colorPicker} typography={typography} />
        <PackageCards heading={packagesHeading} items={packages} palette={palette} colorPicker={colorPicker} typography={typography} />
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <HighlightList title={workflowTitle} items={workflowItems} mode="number" palette={palette} colorPicker={colorPicker} typography={typography} />
          <HighlightList title={highlightsTitle} items={highlightItems} mode="checklist" palette={palette} colorPicker={colorPicker} typography={typography} />
        </div>
      </div>
    </section>
  );
}
