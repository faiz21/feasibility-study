import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CaseStudySectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function CaseStudySection({
  title,
  description,
  children,
  className,
}: CaseStudySectionProps) {
  return (
    <Card className={cn("border-foreground/10", className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

