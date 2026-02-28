import type { CaseStudy } from "@/lib/case-study/types";
import { CaseStudySection } from "./section";

type CaseStudyFaqProps = {
  caseStudy: Pick<CaseStudy, "faq">;
};

export function CaseStudyFaq({ caseStudy }: CaseStudyFaqProps) {
  const items = caseStudy.faq ?? [];
  if (items.length === 0) return null;

  return (
    <CaseStudySection title="FAQ Sheet">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.question} className="rounded-lg border p-4">
            <div className="font-medium">{item.question}</div>
            <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </div>
    </CaseStudySection>
  );
}

