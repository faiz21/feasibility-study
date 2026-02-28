import { AlertTriangle } from "lucide-react";

import { isCaseStudyPageDocument } from "@/lib/case-study/guards";
import type { CaseStudyPageDocument, CaseStudyRenderContext } from "@/lib/case-study/types";
import { BlockShell } from "../primitives";
import { CaseStudyBlockRenderer } from "./block-renderer";

type CaseStudyPageRendererProps = {
  document: CaseStudyPageDocument | unknown;
};

export function CaseStudyPageRenderer({ document }: CaseStudyPageRendererProps) {
  if (!isCaseStudyPageDocument(document)) {
    return (
      <main className="mx-auto w-full max-w-6xl p-4 md:p-8">
        <BlockShell title="Invalid Document">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Case study payload is invalid and cannot be rendered.
          </div>
        </BlockShell>
      </main>
    );
  }

  const blockMap = new Map(document.layout.map((block) => [block.id, block]));

  const context: CaseStudyRenderContext = {
    blockMap,
    renderRef: (id, path) => {
      const block = blockMap.get(id);
      if (!block) return null;
      if (path.includes(id)) {
        return (
          <BlockShell title="Reference Loop">
            <p className="text-sm text-destructive">Skipped recursive reference: {id}</p>
          </BlockShell>
        );
      }
      return (
        <CaseStudyBlockRenderer
          key={`${path.join("-")}-${id}`}
          block={block}
          context={context}
          path={[...path, id]}
        />
      );
    },
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 p-4 md:p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{document.pageTitle}</h1>
        <p className="text-sm text-muted-foreground">
          JSON-driven renderer with registry-based block dispatch.
        </p>
      </header>
      {document.layout.map((block) => (
        <CaseStudyBlockRenderer
          key={block.id}
          block={block}
          context={context}
          path={[block.id]}
        />
      ))}
    </main>
  );
}

