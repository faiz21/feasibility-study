import type { CaseStudy } from "@/lib/case-study/types";
import { CaseStudySection } from "./section";

type CaseStudyKeyFindingsProps = {
  caseStudy: Pick<CaseStudy, "keyFindings">;
};

export function CaseStudyKeyFindings({ caseStudy }: CaseStudyKeyFindingsProps) {
  const findings = caseStudy.keyFindings ?? [];
  if (findings.length === 0) return null;

  return (
    <CaseStudySection title="Key Findings and Recommendations">
      <ul className="list-disc pl-5 space-y-2">
        {findings.map((finding, index) => (
          <li key={index} className="text-sm leading-relaxed">
            {finding.text}
          </li>
        ))}
      </ul>
    </CaseStudySection>
  );
}

