import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell } from "../primitives";
import { asArray, asRecord, asString, asStringList } from "../helpers";

export function GoalsListWithIcons({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  return (
    <BlockShell title={asString(data.title)}>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 rounded-lg border p-3">
            <div className="mt-0.5 h-6 w-6 rounded-full bg-muted text-center text-xs leading-6">
              {asString(asRecord(item.icon).name).slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{asString(item.title)}</p>
              <p className="text-sm text-muted-foreground">{asString(item.text)}</p>
            </div>
          </div>
        ))}
      </div>
    </BlockShell>
  );
}

export function NumberedBenefitsBlock({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  return (
    <BlockShell title={asString(data.title)}>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">{asString(item.n, String(index + 1))}</p>
            <p className="font-medium">{asString(item.title)}</p>
            <p className="text-sm text-muted-foreground">{asString(item.text)}</p>
          </div>
        ))}
      </div>
    </BlockShell>
  );
}

export function RankedPlatformList({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  return (
    <BlockShell title={asString(data.title)}>
      <div className="space-y-2">
        {items.map((item, index) => {
          const delta = Number(item.deltaPct ?? 0);
          return (
            <div key={index} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
              <span>{asString(item.label)}</span>
              <span className="font-medium">{String(item.value)}</span>
              <span className={delta >= 0 ? "text-success" : "text-critical"}>
                {delta >= 0 ? "+" : ""}
                {delta}%
              </span>
            </div>
          );
        })}
      </div>
    </BlockShell>
  );
}

export function WorkflowStepper({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const steps = asStringList(data.steps);
  return (
    <BlockShell title={asString(data.title)}>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-2 rounded-md border px-3 py-2 text-sm">
            <span className="font-semibold">{index + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </BlockShell>
  );
}

