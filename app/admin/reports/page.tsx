import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader, StatCard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clearAdminPreviewClientId, getAdminPreviewClientId, setAdminPreviewClientId } from "@/lib/portal/admin-preview";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function startClientPreviewAction(formData: FormData) {
  "use server";
  await requireRole("admin");

  const clientId = String(formData.get("client_id") ?? "").trim();
  if (!clientId) {
    redirect("/admin/reports?error=Please+select+a+client+for+preview");
  }

  const supabase = await createClient();
  const { data: client } = await supabase.from("clients").select("id").eq("id", clientId).maybeSingle();
  if (!client) {
    redirect("/admin/reports?error=Invalid+client+selected");
  }

  await setAdminPreviewClientId(clientId);
  revalidatePath("/reports");
  redirect("/reports");
}

async function stopClientPreviewAction() {
  "use server";
  await requireRole("admin");
  await clearAdminPreviewClientId();
  revalidatePath("/reports");
  redirect("/admin/reports?success=Client+preview+stopped");
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  await requireRole("admin");
  const supabase = await createClient();
  const params = await searchParams;
  const previewClientId = await getAdminPreviewClientId();

  const [{ data: reports }, { data: clients }] = await Promise.all([
    supabase
      .from("reports")
      .select("id,status,published_at,report_page_activity(time_spent_sec,user_id),report_ratings(rating)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("clients").select("id,name,code").order("name", { ascending: true }),
  ]);

  const previewClient = (clients ?? []).find((client) => client.id === previewClientId) ?? null;

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
      {params.success ? (
        <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          {params.success}
        </p>
      ) : null}
      {params.error ? (
        <p className="rounded-lg border border-critical/30 bg-critical/10 px-3 py-2 text-sm text-critical">
          {params.error}
        </p>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client Report Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose a client and open `/reports` without re-login. In preview mode, admin reading and rating are not recorded.
          </p>
          {previewClient ? (
            <p className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-foreground">
              Active preview client: <span className="font-medium">{previewClient.name}</span> ({previewClient.code})
            </p>
          ) : null}
          <form action={startClientPreviewAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="w-full text-sm">
              Client
              <select
                name="client_id"
                defaultValue={previewClientId ?? ""}
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="">Select client</option>
                {(clients ?? []).map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.code})
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit">Open Client Preview</Button>
          </form>
          {previewClient ? (
            <form action={stopClientPreviewAction}>
              <Button type="submit" variant="secondary">
                Stop Preview
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>
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
