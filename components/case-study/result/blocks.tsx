import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell } from "../primitives";
import { asArray, asRecord, asString } from "../helpers";

export function ResultMetricCard({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const metrics = asArray<Record<string, unknown>>(data.metrics);
  return (
    <BlockShell title={asString(data.label, "Result")}>
      <div className="grid gap-3 md:grid-cols-2">
        {metrics.map((metric, index) => (
          <div key={index} className="rounded-lg border p-3">
            <p className="text-3xl font-semibold tracking-tight">{asString(metric.value)}</p>
            <p className="text-sm text-muted-foreground">{asString(metric.text)}</p>
          </div>
        ))}
      </div>
    </BlockShell>
  );
}

export function ResultQuoteCallout({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  return (
    <BlockShell>
      <blockquote className="border-l-2 pl-4 text-lg leading-relaxed">
        &ldquo;{asString(data.text)}&rdquo;
      </blockquote>
    </BlockShell>
  );
}
