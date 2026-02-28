import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell } from "../primitives";
import { asArray, asRecord, asString } from "../helpers";

export function IconCategoryGrid({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  const repeat = Number(data.repeat ?? 1);
  const repeated = Array.from({ length: repeat }).flatMap(() => items);
  return (
    <BlockShell title="Categories">
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {repeated.map((item, index) => (
          <div key={index} className="rounded-lg border p-3 text-center">
            <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-muted text-xs leading-10">
              {asString(asRecord(item.icon).name).slice(0, 2).toUpperCase()}
            </div>
            <p className="text-sm">{asString(item.label)}</p>
          </div>
        ))}
      </div>
    </BlockShell>
  );
}

