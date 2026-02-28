import type { CaseStudy } from "@/lib/case-study/types";
import { CaseStudySection } from "./section";

type CaseStudyGoalsProps = {
  caseStudy: Pick<CaseStudy, "goals">;
};

export function CaseStudyGoals({ caseStudy }: CaseStudyGoalsProps) {
  const goals = caseStudy.goals ?? [];
  if (goals.length === 0) return null;

  return (
    <CaseStudySection title="Goals and Objectives">
      <div className="grid gap-4 sm:grid-cols-2">
        {goals.map((goal) => (
          <div key={goal.title} className="rounded-lg border p-4">
            <div className="font-medium">{goal.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {goal.description}
            </p>
          </div>
        ))}
      </div>
    </CaseStudySection>
  );
}

