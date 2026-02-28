import type { CaseStudy } from "@/lib/case-study/types";
import { CaseStudySection } from "./section";

type CaseStudySegmentationProps = {
  caseStudy: Pick<CaseStudy, "segments">;
};

export function CaseStudySegmentation({ caseStudy }: CaseStudySegmentationProps) {
  const segments = caseStudy.segments ?? [];
  if (segments.length === 0) return null;

  return (
    <CaseStudySection title="Target Audience and Segmentation">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr className="border-b">
              <th className="py-2 pr-4 text-left font-medium">Segment</th>
              <th className="py-2 pr-4 text-left font-medium">
                Characteristics
              </th>
              <th className="py-2 text-left font-medium">
                Marketing Strategy
              </th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => (
              <tr key={segment.name} className="border-b last:border-b-0">
                <td className="py-3 pr-4 font-medium">{segment.name}</td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {segment.characteristics}
                </td>
                <td className="py-3 text-muted-foreground">
                  {segment.marketingStrategy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CaseStudySection>
  );
}

