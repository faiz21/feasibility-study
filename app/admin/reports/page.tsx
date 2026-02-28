import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader, StatCard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminReportsPage() {
  await requireRole("admin");
  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("reports")
    .select("id,status,published_at,report_page_activity(time_spent_sec,user_id),report_ratings(rating)")
    .order("created_at", { ascending: false })
    .limit(100);

  const totalReports = reports?.length ?? 0;
  const publishedReports = (reports ?? []).filter((report) => report.status === "published").length;
  const allActivities = (reports ?? []).flatMap((report) =>
    Array.isArray(report.report_page_activity) ? report.report_page_activity : [],
  );
  const uniqueReaders = new Set(allActivities.map((activity) => activity.user_id)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports Analytics"
        description="Portfolio-level activity, completion, and rating signals."
      />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Reports" value={totalReports} />
        <StatCard label="Published Reports" value={publishedReports} />
        <StatCard label="Unique Readers" value={uniqueReaders} />
      </section>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Latest Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {totalReports === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No reports found.</p>
          ) : null}
        {(reports ?? []).map((report) => {
          const activities = Array.isArray(report.report_page_activity)
            ? report.report_page_activity
            : [];
          const ratings = Array.isArray(report.report_ratings) ? report.report_ratings : [];
          const openedUsers = new Set(activities.map((a) => a.user_id)).size;
          const totalTime = activities.reduce((sum, a) => sum + (a.time_spent_sec ?? 0), 0);
          const avgRating = ratings.length
            ? (ratings.reduce((sum, r) => sum + (r.rating ?? 0), 0) / ratings.length).toFixed(2)
            : "-";

          return (
            <Link
              key={report.id}
              href={`/admin/reports/${report.id}`}
              className="block border-t border-border/70 p-4 first:border-t-0 hover:bg-accent/70"
            >
              <div className="mb-1 flex items-center gap-2">
                <p className="font-medium">Report {report.id.slice(0, 8)}</p>
                <Badge variant="secondary">{report.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Opened users: {openedUsers} | Time spent: {totalTime}s | Avg rating: {avgRating}
              </p>
            </Link>
          );
        })}
        </CardContent>
      </Card>
    </div>
  );
}
