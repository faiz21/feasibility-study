import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatCard } from "@/components/ui/dashboard";

export default async function ReportsPage() {
  const { profile } = await requireRole("client");
  const supabase = await createClient();

  const { data: assignments } = await supabase
    .from("client_reports")
    .select("report_id, reports(id,status,thumbnail_url,published_at)")
    .eq("client_id", profile.client_id);

  const publishedReports = (assignments ?? []).filter((item) => {
    const report = Array.isArray(item.reports) ? item.reports[0] : item.reports;
    return report?.status === "published";
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Your Reports" description="Published reports assigned to your organization." />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Assigned Reports" value={assignments?.length ?? 0} />
        <StatCard label="Published Reports" value={publishedReports.length} />
      </section>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Reports</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {publishedReports.length === 0 ? (
            <p className="text-sm text-muted-foreground">No published reports available yet.</p>
          ) : null}
          {(assignments ?? []).map((item) => {
          const report = Array.isArray(item.reports) ? item.reports[0] : item.reports;
          if (!report || report.status !== "published") return null;

          return (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="rounded-xl border border-border/70 bg-card p-4 transition-colors hover:bg-accent/70"
            >
              <div className="mb-1 flex items-center gap-2">
                <p className="font-medium">Report {report.id.slice(0, 8)}</p>
                <Badge variant="secondary">{report.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Published: {report.published_at ? new Date(report.published_at).toLocaleDateString() : "-"}
              </p>
            </Link>
          );
        })}
        </CardContent>
      </Card>
    </div>
  );
}
