import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell, RichTextRenderer, StatCell } from "../primitives";
import { asArray, asRecord, asString } from "../helpers";

export function KpiCard({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const metrics = asArray<Record<string, unknown>>(data.metrics);
  return (
    <BlockShell title={asString(data.title)}>
      <RichTextRenderer value={asRecord(data.body) as never} />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {metrics.map((metric, index) => (
          <StatCell key={index} label={asString(metric.label)} value={asString(metric.value)} />
        ))}
      </div>
    </BlockShell>
  );
}

export function KpiCardGrid2x2({
  block,
  context,
  path,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => context.renderRef(asString(item.ref), [...path, `kpi-${index}`]))}
    </div>
  );
}

export function KpiStrip3({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item, index) => (
        <StatCell key={index} label={asString(item.label)} value={asString(item.value)} />
      ))}
    </div>
  );
}

