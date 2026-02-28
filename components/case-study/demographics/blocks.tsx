import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell, StatCell } from "../primitives";
import { asArray, asRecord, asString } from "../helpers";

export function DemographicSummaryCards({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const gender = asArray<Record<string, unknown>>(data.gender);
  const ageBands = asArray<Record<string, unknown>>(data.ageBands);
  const unit = asString(data.unit, "%");
  return (
    <BlockShell title="Demographics" subtitle={`Total Audience: ${asString(data.totalAudience)}`}>
      <div className="grid gap-3 md:grid-cols-2">
        {gender.map((item, index) => (
          <StatCell key={`g-${index}`} label={asString(item.label)} value={`${String(item.value)}${unit}`} />
        ))}
        {ageBands.map((item, index) => (
          <StatCell key={`a-${index}`} label={asString(item.label)} value={`${String(item.value)}${unit}`} />
        ))}
      </div>
    </BlockShell>
  );
}

