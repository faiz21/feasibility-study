import { CASE_STUDY_BLOCKS } from "@/lib/case-study/catalog";
import type { CaseStudyBlock, ComponentTypeKey } from "@/lib/case-study/types";

export function getBlockByType(type: ComponentTypeKey): CaseStudyBlock {
  const found = CASE_STUDY_BLOCKS.find((block) => block.type === type);
  if (!found) throw new Error(`Missing sample block for type: ${type}`);
  return found;
}

