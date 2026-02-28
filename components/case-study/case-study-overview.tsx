import type { CaseStudy } from "@/lib/case-study/types";
import { CaseStudySection } from "./section";

type CaseStudyOverviewProps = {
  caseStudy: Pick<CaseStudy, "overview">;
};

export function CaseStudyOverview({ caseStudy }: CaseStudyOverviewProps) {
  return (
    <CaseStudySection title="Overview">
      <p className="leading-relaxed">{caseStudy.overview}</p>
    </CaseStudySection>
  );
}

