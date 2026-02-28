import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell, RichTextRenderer } from "../primitives";
import { asArray, asRecord, asString, asStringList } from "../helpers";

export function SidePanelNarrativeCard({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  return (
    <BlockShell title={asString(data.title)} subtitle={asString(data.titleLabel)}>
      <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground">
        {asString(data.sectionLabel)}
      </p>
      <RichTextRenderer value={asRecord(data.body) as never} />
    </BlockShell>
  );
}

export function TwoColumnTextBlock({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const left = asRecord(data.left);
  const right = asRecord(data.right);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <BlockShell title={asString(left.title)}>
        <RichTextRenderer value={asRecord(left.body) as never} />
      </BlockShell>
      <BlockShell title={asString(right.title)}>
        <RichTextRenderer value={asRecord(right.body) as never} />
      </BlockShell>
    </div>
  );
}

export function LongFormOverview({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  return (
    <BlockShell title={asString(data.title)}>
      <RichTextRenderer value={asRecord(data.body) as never} />
    </BlockShell>
  );
}

export function HighlightsCard({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asStringList(data.items);
  return (
    <BlockShell title={asString(data.title, "Highlights")}>
      <ul className="space-y-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="rounded-md border bg-muted/40 px-3 py-2">{item}</li>
        ))}
      </ul>
    </BlockShell>
  );
}

export function SupportingTextCard({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  return (
    <BlockShell>
      <RichTextRenderer value={asRecord(data.body) as never} />
    </BlockShell>
  );
}

export function IconBulletsAnalysisCard({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const icon = asRecord(data.icon);
  return (
    <BlockShell title={asString(data.title)} subtitle={asString(icon.name, "Icon")}>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {asStringList(data.bullets).map((bullet, index) => (
          <li key={index}>{bullet}</li>
        ))}
      </ul>
    </BlockShell>
  );
}

export function SectionSummaryTextBlock({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  return (
    <BlockShell title={asString(data.title)}>
      <RichTextRenderer value={asRecord(data.body) as never} />
    </BlockShell>
  );
}

export function GoalsCardRow({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  return (
    <BlockShell title={asString(data.title)}>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">{asString(asRecord(item.icon).name)}</p>
            <p className="font-medium">{asString(item.title)}</p>
            <p className="text-sm text-muted-foreground">{asString(item.text)}</p>
          </div>
        ))}
      </div>
    </BlockShell>
  );
}

export function PricingPackageCards({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const items = asArray<Record<string, unknown>>(data.items);
  return (
    <BlockShell title={asString(data.title)}>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border p-3">
            <p className="font-medium">{asString(item.title)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{asString(item.description)}</p>
            <p className="mt-3 text-lg font-semibold">
              Starting from {asString(item.currency, "USD")} {String(item.priceFrom ?? 0)}
            </p>
          </div>
        ))}
      </div>
    </BlockShell>
  );
}

