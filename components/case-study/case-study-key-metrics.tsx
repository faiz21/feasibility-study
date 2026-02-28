import type { CaseStudy } from "@/lib/case-study/types";
import { CaseStudySection } from "./section";

type CaseStudyKeyMetricsProps = {
  caseStudy: Pick<CaseStudy, "keyMetrics">;
};

export function CaseStudyKeyMetrics({ caseStudy }: CaseStudyKeyMetricsProps) {
  const metrics = caseStudy.keyMetrics ?? [];
  if (metrics.length === 0) return null;

  return (
    <CaseStudySection title="Key Metrics">
      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border p-4">
            <div className="text-3xl font-semibold tracking-tight">
              {metric.value}
            </div>
            <div className="mt-1 font-medium">{metric.label}</div>
            {metric.description ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {metric.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </CaseStudySection>
  );
}

