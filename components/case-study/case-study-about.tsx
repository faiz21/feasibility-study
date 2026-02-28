import type { CaseStudy } from "@/lib/case-study/types";
import { CaseStudySection } from "./section";

type CaseStudyAboutProps = {
  caseStudy: Pick<CaseStudy, "aboutUs">;
};

export function CaseStudyAbout({ caseStudy }: CaseStudyAboutProps) {
  if (!caseStudy.aboutUs) return null;

  return (
    <CaseStudySection title={caseStudy.aboutUs.heading ?? "About Us"}>
      <div className="space-y-4">
        <p className="leading-relaxed">{caseStudy.aboutUs.description}</p>
        {caseStudy.aboutUs.stats?.length ? (
          <div className="grid gap-4 sm:grid-cols-4">
            {caseStudy.aboutUs.stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border p-4">
                <div className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </CaseStudySection>
  );
}

