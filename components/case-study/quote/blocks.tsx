import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell } from "../primitives";
import { asArray, asRecord, asString } from "../helpers";

export function QuoteBackdropPanel({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  return (
    <BlockShell>
      <p className="text-lg italic leading-relaxed">&ldquo;{asString(data.quote)}&rdquo;</p>
      <p className="mt-2 text-xs text-muted-foreground">Backdrop style</p>
    </BlockShell>
  );
}

export function QuoteRibbonStack({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  const repeat = Number(data.repeat ?? 1);
  const lines = Array.from({ length: repeat }).map((_, index) => items[index % Math.max(items.length, 1)]);
  return (
    <BlockShell>
      <div className="space-y-2">
        {lines.map((item, index) => (
          <div key={index} className="rounded bg-muted px-3 py-2 text-xs font-medium tracking-wide">
            {asString(item?.text)}
          </div>
        ))}
      </div>
    </BlockShell>
  );
}
