import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader, StatCard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHead,
  DataGridRow,
  DataGridTable,
} from "@/components/ui/data-grid";

type AdminReportRow = {
  id: string;
  status: string;
  published_at: string | null;
  entity_id: string;
  report_type_template_id: string;
  created_at: string;
};

async function publishReportAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const reportId = String(formData.get("report_id") ?? "").trim();
  const nextStatus = String(formData.get("next_status") ?? "draft").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "all").trim();

  if (!reportId || !["draft", "published"].includes(nextStatus)) {
    redirect("/admin/client-reports?error=Invalid+publish+action");
  }

  const payload =
    nextStatus === "published"
      ? { status: "published", published_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      : { status: "draft", published_at: null, updated_at: new Date().toISOString() };

  const { error } = await supabase.from("reports").update(payload).eq("id", reportId);
  if (error) {
    redirect(
      `/admin/client-reports?client_id=${clientId}&granularity_id=${granularityId}&error=${encodeURIComponent(error.message)}`,
    );
  }

  revalidatePath("/admin/client-reports");
  revalidatePath("/admin/reports");
  redirect(
    `/admin/client-reports?client_id=${clientId}&granularity_id=${granularityId}&success=${encodeURIComponent(
      `Report ${nextStatus === "published" ? "published" : "set to draft"}`,
    )}`,
  );
}

export default async function AdminClientReportsPage({
  searchParams,
}: {
  searchParams: Promise<{
    client_id?: string;
    granularity_id?: string;
    success?: string;
    error?: string;
  }>;
}) {
  await requireRole("admin");
  const supabase = await createClient();
  const params = await searchParams;

  const [
    { data: clients },
    { data: reports },
    { data: entities },
    { data: reportTypes },
    { data: granularities },
    { data: reportPages },
  ] =
    await Promise.all([
      supabase.from("clients").select("id,name").order("name", { ascending: true }),
      supabase
        .from("reports")
        .select("id,status,published_at,entity_id,report_type_template_id,created_at")
        .order("created_at", { ascending: false }),
      supabase.from("report_entities").select("id,name,description,client_id,granularity_id"),
      supabase.from("report_type_templates").select("id,name").order("name", { ascending: true }),
      supabase.from("granularities").select("id,name,code").order("name", { ascending: true }),
      supabase
        .from("report_pages")
        .select("report_id,page_order,report_page_templates(page_key,title)")
        .order("page_order", { ascending: true }),
    ]);

  const selectedClientId = params.client_id ?? clients?.[0]?.id ?? "";
  const granularityFilter = params.granularity_id ?? "all";
  const reportRows = (reports ?? []) as AdminReportRow[];

  const entityById = new Map((entities ?? []).map((entity) => [entity.id, entity]));
  const reportTypeById = new Map((reportTypes ?? []).map((type) => [type.id, type.name]));
  const granularityById = new Map((granularities ?? []).map((granularity) => [granularity.id, granularity]));
  const pagesByReportId = new Map<string, string[]>();
  (reportPages ?? []).forEach((page) => {
    const template = Array.isArray(page.report_page_templates)
      ? page.report_page_templates[0]
      : page.report_page_templates;
    const label = `${template?.title ?? "Untitled"} (${template?.page_key ?? "-"})`;
    const existing = pagesByReportId.get(page.report_id) ?? [];
    existing.push(label);
    pagesByReportId.set(page.report_id, existing);
  });

  const filteredReports = reportRows.filter((report) => {
    const entity = entityById.get(report.entity_id);
    if (!entity) return false;
    if (selectedClientId && entity.client_id !== selectedClientId) return false;
    if (granularityFilter !== "all" && entity.granularity_id !== granularityFilter) return false;
    return true;
  });

  const groupedByEntity = new Map<string, AdminReportRow[]>();
  filteredReports.forEach((report) => {
    const existing = groupedByEntity.get(report.entity_id) ?? [];
    existing.push(report);
    groupedByEntity.set(report.entity_id, existing);
  });

  const groupedEntries = Array.from(groupedByEntity.entries()).sort((a, b) => {
    const entityA = entityById.get(a[0]);
    const entityB = entityById.get(b[0]);
    return (entityA?.name ?? "").localeCompare(entityB?.name ?? "");
  });

  const publishedCount = filteredReports.filter((report) => report.status === "published").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Reports"
        description="Configure all generated reports from table reports: publish/draft and content editing."
      />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Reports (Filtered)" value={filteredReports.length} />
        <StatCard label="Published (Filtered)" value={publishedCount} />
        <StatCard label="Clients" value={clients?.length ?? 0} />
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
          <CardTitle className="text-base">Client Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {(clients ?? []).map((client) => (
              <Link
                key={client.id}
                href={`/admin/client-reports?client_id=${client.id}&granularity_id=${granularityFilter}`}
                className={`rounded-lg border px-3 py-3 text-sm ${
                  selectedClientId === client.id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border/70 bg-card text-muted-foreground hover:bg-accent/40"
                }`}
              >
                <p className="font-medium text-foreground">{client.name}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reports Grouped by Entity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-3 md:grid-cols-2">
            <input type="hidden" name="client_id" value={selectedClientId} />
            <label className="text-sm md:col-span-1">
              Granularity
              <select
                name="granularity_id"
                defaultValue={granularityFilter}
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="all">All</option>
                {(granularities ?? []).map((granularity) => (
                  <option key={granularity.id} value={granularity.id}>
                    {granularity.name} ({granularity.code})
                  </option>
                ))}
              </select>
            </label>
            <div className="md:col-span-1 flex items-end">
              <Button type="submit" variant="secondary">
                Apply Granularity Filter
              </Button>
            </div>
          </form>

          {groupedEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reports found in table reports.</p>
          ) : null}

          {groupedEntries.map(([entityId, rows]) => {
            const entity = entityById.get(entityId);
            const granularity = entity ? granularityById.get(entity.granularity_id) : null;
            return (
              <Card key={entityId}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {entity?.name ?? "Unknown Entity"}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({granularity?.name ?? "-"}{granularity?.code ? ` · ${granularity.code}` : ""})
                    </span>
                  </CardTitle>
                  {entity?.description ? (
                    <p className="text-sm text-muted-foreground">{entity.description}</p>
                  ) : null}
                </CardHeader>
                <CardContent>
                  <DataGrid>
                    <DataGridTable>
                      <DataGridHead>
                        <DataGridRow className="border-t-0">
                          <DataGridCell header>Entity Name</DataGridCell>
                          <DataGridCell header>Report Type</DataGridCell>
                          <DataGridCell header>Pages</DataGridCell>
                          <DataGridCell header>Status</DataGridCell>
                          <DataGridCell header>Published At</DataGridCell>
                          <DataGridCell header className="text-right">Actions</DataGridCell>
                        </DataGridRow>
                      </DataGridHead>
                      <DataGridBody>
                        {rows.map((report) => (
                          <DataGridRow key={report.id}>
                            <DataGridCell className="text-foreground">
                              <div className="space-y-1">
                                <p>{entity?.name ?? "-"}</p>
                                <p className="text-xs text-muted-foreground">{entity?.description ?? "-"}</p>
                              </div>
                            </DataGridCell>
                            <DataGridCell className="text-muted-foreground">
                              {reportTypeById.get(report.report_type_template_id) ?? "-"}
                            </DataGridCell>
                            <DataGridCell className="text-muted-foreground">
                              {(pagesByReportId.get(report.id) ?? []).slice(0, 3).join(", ") || "-"}
                            </DataGridCell>
                            <DataGridCell className="text-muted-foreground">{report.status}</DataGridCell>
                            <DataGridCell className="text-muted-foreground">
                              {report.published_at ? new Date(report.published_at).toLocaleString() : "-"}
                            </DataGridCell>
                            <DataGridCell>
                              <div className="flex justify-end gap-2">
                                <form action={publishReportAction}>
                                  <input type="hidden" name="report_id" value={report.id} />
                                  <input
                                    type="hidden"
                                    name="next_status"
                                    value={report.status === "published" ? "draft" : "published"}
                                  />
                                  <input type="hidden" name="client_id" value={selectedClientId} />
                                  <input type="hidden" name="granularity_id" value={granularityFilter} />
                                  <Button
                                    type="submit"
                                    size="sm"
                                    variant={report.status === "published" ? "secondary" : "default"}
                                  >
                                    {report.status === "published" ? "Set Draft" : "Publish"}
                                  </Button>
                                </form>
                                <Link
                                  href={`/admin/client-reports/${report.id}/edit?client_id=${selectedClientId}&granularity_id=${granularityFilter}`}
                                  className="inline-flex h-8 items-center rounded-md border border-border/70 px-3 text-xs font-medium hover:bg-accent/50"
                                >
                                  Edit Content
                                </Link>
                                <Link
                                  href={`/admin/client-reports/${report.id}/markdown-preview?client_id=${selectedClientId}&granularity_id=${granularityFilter}&locale=en`}
                                  className="inline-flex h-8 items-center rounded-md border border-border/70 px-3 text-xs font-medium hover:bg-accent/50"
                                >
                                  Preview Markdown
                                </Link>
                              </div>
                            </DataGridCell>
                          </DataGridRow>
                        ))}
                      </DataGridBody>
                    </DataGridTable>
                  </DataGrid>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
