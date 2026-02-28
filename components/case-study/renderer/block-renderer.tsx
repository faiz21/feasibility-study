import { AlertTriangle } from "lucide-react";

import type { CaseStudyBlock, CaseStudyRenderContext } from "@/lib/case-study/types";
import { CASE_STUDY_RENDERERS } from "../registry";
import { BlockShell } from "../primitives";

type CaseStudyBlockRendererProps = {
  block: CaseStudyBlock;
  context: CaseStudyRenderContext;
  path?: string[];
};

export function CaseStudyBlockRenderer({
  block,
  context,
  path = [],
}: CaseStudyBlockRendererProps) {
  const renderer = CASE_STUDY_RENDERERS[block.type];
  if (!renderer) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Unknown case-study block type: ${block.type}`);
    }
    return (
      <BlockShell title="Unknown Block" subtitle={block.type}>
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Unsupported block type. Rendering skipped safely.
        </div>
      </BlockShell>
    );
  }
  return <>{renderer({ block, context, path })}</>;
}

