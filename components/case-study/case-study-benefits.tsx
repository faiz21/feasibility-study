import type { CaseStudy } from "@/lib/case-study/types";
import { CaseStudySection } from "./section";

type CaseStudyBenefitsProps = {
  caseStudy: Pick<CaseStudy, "benefits">;
};

export function CaseStudyBenefits({ caseStudy }: CaseStudyBenefitsProps) {
  const benefits = caseStudy.benefits ?? [];
  if (benefits.length === 0) return null;

  return (
    <CaseStudySection title="Benefits">
      <div className="grid gap-4 sm:grid-cols-3">
        {benefits.map((benefit, index) => (
          <div key={benefit.title} className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="mt-2 font-medium">{benefit.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </CaseStudySection>
  );
}

