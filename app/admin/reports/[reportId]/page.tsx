import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatCard } from "@/components/ui/dashboard";

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  await requireRole("admin");
  const { reportId } = await params;
  const supabase = await createClient();

  const { data: activity } = await supabase
    .from("report_page_activity")
    .select("user_id, report_page_id, time_spent_sec, completed_at, last_locale")
    .eq("report_id", reportId);

  const { data: ratings } = await supabase
    .from("report_ratings")
    .select("user_id, rating, comment")
    .eq("report_id", reportId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Report ${reportId.slice(0, 8)} analytics`}
        description="Per-user reading activity and feedback quality signals."
      />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Activity Logs" value={activity?.length ?? 0} />
        <StatCard label="Ratings" value={ratings?.length ?? 0} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Per-user page activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {(activity?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No activity tracked yet.</p>
          ) : null}
          {(activity ?? []).map((row, idx) => (
            <p key={`${row.user_id}-${idx}`} className="rounded-md border border-border/70 bg-muted/30 p-2">
              user={row.user_id.slice(0, 8)} page={row.report_page_id.slice(0, 8)} time=
              {row.time_spent_sec}s completed={row.completed_at ? "yes" : "no"} locale={row.last_locale}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ratings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {(ratings?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No ratings submitted yet.</p>
          ) : null}
          {(ratings ?? []).map((row) => (
            <p key={row.user_id} className="rounded-md border border-border/70 bg-muted/30 p-2">
              user={row.user_id.slice(0, 8)} rating={row.rating} comment={row.comment ?? "-"}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
