import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function ReportsNotFound() {
  return (
    <Card>
      <CardContent className="space-y-3 p-8 text-center">
        <p className="text-base font-semibold">Report resource not found.</p>
        <p className="text-sm text-muted-foreground">
          The report category or report you requested is unavailable or you do not have access.
        </p>
        <Link href="/reports" className="text-sm font-medium text-primary hover:underline">
          Back to categories
        </Link>
      </CardContent>
    </Card>
  );
}
