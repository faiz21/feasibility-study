import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CaseStudy } from "@/lib/case-study/types";

type CaseStudyCoverProps = {
  caseStudy: Pick<
    CaseStudy,
    | "title"
    | "subtitle"
    | "yearLabel"
    | "reportLabel"
    | "preparedBy"
    | "preparedByLabel"
    | "company"
    | "contact"
  >;
};

export function CaseStudyCover({ caseStudy }: CaseStudyCoverProps) {
  return (
    <Card className="border-foreground/10">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">CASE STUDY</Badge>
          {caseStudy.yearLabel ? (
            <Badge variant="outline">{caseStudy.yearLabel}</Badge>
          ) : null}
          {caseStudy.reportLabel ? (
            <Badge variant="outline">{caseStudy.reportLabel}</Badge>
          ) : null}
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            {caseStudy.title}
          </h1>
          {caseStudy.subtitle ? (
            <p className="text-muted-foreground">{caseStudy.subtitle}</p>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            COMPANY
          </div>
          <div className="text-xl font-semibold">{caseStudy.company.name}</div>
          <div className="text-sm text-muted-foreground">
            {caseStudy.company.backgroundLabel ?? "Background"}
          </div>
          <p className="leading-relaxed">{caseStudy.company.description}</p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {caseStudy.contact?.website ? (
            <div>{caseStudy.contact.website}</div>
          ) : null}
          {caseStudy.contact?.email ? <div>{caseStudy.contact.email}</div> : null}
          {caseStudy.contact?.phone ? <div>{caseStudy.contact.phone}</div> : null}
        </div>

        {caseStudy.preparedBy ? (
          <div className="text-sm">
            <span className="text-muted-foreground">
              {caseStudy.preparedByLabel ?? "Prepared by:"}{" "}
            </span>
            <span className="font-medium">{caseStudy.preparedBy}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

