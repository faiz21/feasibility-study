import type { CaseStudy } from "@/lib/case-study/types";
import { CaseStudyAbout } from "./case-study-about";
import { CaseStudyBenefits } from "./case-study-benefits";
import { CaseStudyContact } from "./case-study-contact";
import { CaseStudyCover } from "./case-study-cover";
import { CaseStudyFaq } from "./case-study-faq";
import { CaseStudyGoals } from "./case-study-goals";
import { CaseStudyKeyFindings } from "./case-study-key-findings";
import { CaseStudyKeyMetrics } from "./case-study-key-metrics";
import { CaseStudyOverview } from "./case-study-overview";
import { CaseStudySegmentation } from "./case-study-segmentation";

type CaseStudyTemplateProps = {
  caseStudy: CaseStudy;
};

export function CaseStudyTemplate({ caseStudy }: CaseStudyTemplateProps) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <CaseStudyCover caseStudy={caseStudy} />
      <div className="grid gap-6">
        <CaseStudyOverview caseStudy={caseStudy} />
        <CaseStudyGoals caseStudy={caseStudy} />
        <CaseStudyBenefits caseStudy={caseStudy} />
        <CaseStudyKeyFindings caseStudy={caseStudy} />
        <CaseStudyKeyMetrics caseStudy={caseStudy} />
        <CaseStudySegmentation caseStudy={caseStudy} />
        <CaseStudyFaq caseStudy={caseStudy} />
        <CaseStudyAbout caseStudy={caseStudy} />
        <CaseStudyContact caseStudy={caseStudy} />
      </div>
    </div>
  );
}

