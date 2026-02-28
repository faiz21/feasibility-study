import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell, RichTextRenderer } from "../primitives";
import { asRecord, asString } from "../helpers";

export function CoverHeroImage({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const image = asRecord(data.image);
  return (
    <BlockShell>
      <div className="relative h-52 overflow-hidden rounded-lg border bg-muted">
        <div className="absolute inset-0 bg-gradient-to-tr from-foreground/70 to-transparent" />
        <div className="absolute bottom-3 left-3 text-xs text-white/90">
          {asString(image.alt, "Cover image")}
        </div>
      </div>
    </BlockShell>
  );
}

export function CoverTitleStack({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  return (
    <BlockShell>
      <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
        {asString(data.kicker)}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{asString(data.title)}</h1>
      <p className="text-muted-foreground">{asString(data.subtitle)}</p>
    </BlockShell>
  );
}

export function CoverCompanyProfileCard({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const description = asRecord(data.description) as { blocks: unknown[] };
  return (
    <BlockShell title={asString(data.companyName)} subtitle={asString(data.label, "Background")}>
      <RichTextRenderer value={description as never} />
    </BlockShell>
  );
}

export function CoverTagline({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  return (
    <BlockShell>
      <p className="text-lg font-medium tracking-tight">{asString(data.text)}</p>
    </BlockShell>
  );
}

export function CoverYearBadge({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const year = asString(data.year, "2030");
  return (
    <BlockShell>
      <div className="flex items-end gap-2 text-5xl font-semibold tracking-tight">
        <span>{year.slice(0, 2)}</span>
        <span className="text-muted-foreground">{year.slice(2)}</span>
      </div>
    </BlockShell>
  );
}

export function CoverReportMetaCard({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  return (
    <BlockShell title={asString(data.reportTitle)}>
      <p className="text-sm">
        <span className="text-muted-foreground">Prepared by: </span>
        <span className="font-medium">{asString(data.preparedBy)}</span>
      </p>
    </BlockShell>
  );
}

