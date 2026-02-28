import { CaseStudyPageRenderer } from "@/components/case-study/renderer/page-renderer";
import { CASE_STUDY_DOCUMENT } from "@/lib/case-study/catalog";

export default function CaseStudyPage() {
  return <CaseStudyPageRenderer document={CASE_STUDY_DOCUMENT} />;
}
