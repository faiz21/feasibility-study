import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell, RichTextRenderer } from "../primitives";
import { asArray, asRecord, asString } from "../helpers";

export function ThreePillarSummary({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  return (
    <BlockShell title="Challenge / Solution / Result">
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border p-3">
            <p className="font-medium">{asString(item.title)}</p>
            {Array.isArray(item.metrics) ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {asArray<Record<string, unknown>>(item.metrics).map((metric, metricIndex) => (
                  <li key={metricIndex}>
                    {asString(metric.value)} {asString(metric.label)}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-2">
                <RichTextRenderer value={asRecord(item.body) as never} />
              </div>
            )}
          </div>
        ))}
      </div>
    </BlockShell>
  );
}

