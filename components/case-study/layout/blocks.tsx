import { Badge } from "@/components/ui/badge";
import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell } from "../primitives";
import { asArray, asNumber, asRecord, asString } from "../helpers";

export function HeaderBarBrand({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const brand = asRecord(data.brand);
  const logo = asRecord(brand.logo);
  return (
    <BlockShell>
      <div className="flex items-center justify-between gap-4">
        <Badge variant="secondary">{asString(data.headerLabel, "HEADER")}</Badge>
        <div className="text-xs text-muted-foreground">{asString(logo.alt, "Brand")}</div>
      </div>
    </BlockShell>
  );
}

export function FooterContactStrip({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const contacts = asArray<Record<string, unknown>>(data.contacts);
  return (
    <BlockShell>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        {contacts.map((contact, index) => (
          <div key={index}>
            {asString(contact.kind).toUpperCase()}: {asString(contact.value)}
          </div>
        ))}
        <div className="ml-auto">Page {asNumber(data.pageNumber, 1)}</div>
      </div>
    </BlockShell>
  );
}

export function WatermarkBackgroundPattern({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  return (
    <BlockShell>
      <div
        className="h-24 rounded-lg border"
        style={{
          opacity: asNumber(data.opacity, 0.08),
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground) / 0.12) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.12) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
    </BlockShell>
  );
}

export function Grid2Column({
  block,
  context,
  path,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const left = asArray<Record<string, unknown>>(data.left);
  const right = asArray<Record<string, unknown>>(data.right);
  return (
    <div className="grid gap-4 md:grid-cols-[3fr_2fr]">
      <div className="space-y-4">
        {left.map((item, index) => context.renderRef(asString(item.ref), [...path, `left-${index}`]))}
      </div>
      <div className="space-y-4">
        {right.map((item, index) => context.renderRef(asString(item.ref), [...path, `right-${index}`]))}
      </div>
    </div>
  );
}

export function Grid3Column({
  block,
  context,
  path,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const columns = asArray<unknown[]>(data.columns);
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="space-y-4">
          {asArray<Record<string, unknown>>(column).map((item, itemIndex) =>
            context.renderRef(asString(item.ref), [...path, `col-${columnIndex}-${itemIndex}`]),
          )}
        </div>
      ))}
    </div>
  );
}

export function CardGrid({
  block,
  context,
  path,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const refs = asArray<Record<string, unknown>>(data.items);
  const minCardWidth = asNumber(data.minCardWidth, 260);
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}px, 1fr))` }}
    >
      {refs.map((item, index) => context.renderRef(asString(item.ref), [...path, `grid-${index}`]))}
    </div>
  );
}
