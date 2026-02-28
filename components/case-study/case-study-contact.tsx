import type { CaseStudy } from "@/lib/case-study/types";
import { CaseStudySection } from "./section";

type CaseStudyContactProps = {
  caseStudy: Pick<CaseStudy, "contact">;
};

export function CaseStudyContact({ caseStudy }: CaseStudyContactProps) {
  if (!caseStudy.contact) return null;

  return (
    <CaseStudySection title="Contact Us">
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        {caseStudy.contact.website ? (
          <div>
            <div className="text-muted-foreground">Website</div>
            <div className="font-medium">{caseStudy.contact.website}</div>
          </div>
        ) : null}
        {caseStudy.contact.email ? (
          <div>
            <div className="text-muted-foreground">E-mail</div>
            <div className="font-medium">{caseStudy.contact.email}</div>
          </div>
        ) : null}
        {caseStudy.contact.phone ? (
          <div>
            <div className="text-muted-foreground">Phone</div>
            <div className="font-medium">{caseStudy.contact.phone}</div>
          </div>
        ) : null}
        {caseStudy.contact.whatsapp ? (
          <div>
            <div className="text-muted-foreground">WhatsApp</div>
            <div className="font-medium">{caseStudy.contact.whatsapp}</div>
          </div>
        ) : null}
        {caseStudy.contact.address ? (
          <div className="sm:col-span-2">
            <div className="text-muted-foreground">Address</div>
            <div className="font-medium">{caseStudy.contact.address}</div>
          </div>
        ) : null}
      </div>
    </CaseStudySection>
  );
}

