import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell, StatCell } from "../primitives";
import { asArray, asRecord, asString } from "../helpers";

export function ImpactTopMetricRow({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  return (
    <BlockShell title="Top Metrics">
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item, index) => (
          <StatCell key={index} label={asString(item.label)} value={asString(item.value)} />
        ))}
      </div>
    </BlockShell>
  );
}

export function ImpactCategoryPanel({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const metrics = asArray<Record<string, unknown>>(data.metrics);
  return (
    <BlockShell title={asString(data.category)}>
      <div className="grid gap-3 md:grid-cols-3">
        {metrics.map((metric, index) => (
          <StatCell key={index} label={asString(metric.label)} value={asString(metric.value)} />
        ))}
      </div>
    </BlockShell>
  );
}

