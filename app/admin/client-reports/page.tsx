import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader, StatCard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmSubmitDialogButton } from "@/components/ui/confirm-submit-dialog-button";
import { FormDialog } from "@/components/ui/form-dialog";
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

async function assignReportAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "").trim();
  const reportId = String(formData.get("report_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "all").trim();
  if (!clientId || !reportId) redirect("/admin/client-reports?error=Client+and+report+are+required");

  const { error } = await supabase.from("client_reports").insert({
    client_id: clientId,
    report_id: reportId,
  });
  if (error) {
    if (error.code === "23505") {
      redirect(
        `/admin/client-reports?client_id=${clientId}&granularity_id=${granularityId}&success=Report+already+assigned`,
      );
    }
    redirect(`/admin/client-reports?client_id=${clientId}&granularity_id=${granularityId}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/client-reports");
  redirect(`/admin/client-reports?client_id=${clientId}&granularity_id=${granularityId}&success=Report+assigned`);
}

async function unassignReportAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "").trim();
  const reportId = String(formData.get("report_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "all").trim();
  if (!clientId || !reportId) redirect("/admin/client-reports?error=Client+and+report+are+required");

  const { error } = await supabase
    .from("client_reports")
    .delete()
    .eq("client_id", clientId)
    .eq("report_id", reportId);
  if (error) redirect(`/admin/client-reports?client_id=${clientId}&granularity_id=${granularityId}&error=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/client-reports");
  redirect(`/admin/client-reports?client_id=${clientId}&granularity_id=${granularityId}&success=Report+unassigned`);
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

  const [{ data: assignments }, { data: clients }, { data: reports }, { data: entities }, { data: reportTypes }, { data: granularities }] =
    await Promise.all([
      supabase.from("client_reports").select("client_id,report_id,created_at").order("created_at", { ascending: false }),
      supabase.from("clients").select("id,name").order("name", { ascending: true }),
      supabase
        .from("reports")
        .select("id,status,published_at,entity_id,report_type_template_id")
        .order("created_at", { ascending: false }),
      supabase.from("report_entities").select("id,name,client_id,granularity_id"),
      supabase.from("report_type_templates").select("id,name").order("name", { ascending: true }),
      supabase.from("granularities").select("id,name,code").order("name", { ascending: true }),
    ]);

  const clientById = new Map((clients ?? []).map((client) => [client.id, client.name]));
  const reportById = new Map((reports ?? []).map((report) => [report.id, report]));
  const entityById = new Map((entities ?? []).map((entity) => [entity.id, entity]));
  const reportTypeById = new Map((reportTypes ?? []).map((type) => [type.id, type.name]));
  const granularityById = new Map((granularities ?? []).map((granularity) => [granularity.id, granularity]));

  const selectedClientId = params.client_id ?? clients?.[0]?.id ?? "";
  const granularityFilter = params.granularity_id ?? "all";

  const selectedClientAssignmentSet = new Set(
    (assignments ?? [])
      .filter((assignment) => assignment.client_id === selectedClientId)
      .map((assignment) => assignment.report_id),
  );

  const filteredReports = (reports ?? []).filter((report) => {
    const entity = entityById.get(report.entity_id);
    if (!entity) return false;
    if (granularityFilter !== "all" && entity.granularity_id !== granularityFilter) return false;
    return true;
  });

  const publishedReports = filteredReports.filter((report) => report.status === "published");
  const clientCounts = new Map<string, number>();
  (assignments ?? []).forEach((assignment) => {
    clientCounts.set(assignment.client_id, (clientCounts.get(assignment.client_id) ?? 0) + 1);
  });

  const groupedByEntity = new Map<string, Array<(typeof reports)[number]>>();
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Reports"
        description="Select client, filter by granularity, and manage reports grouped by entity."
      />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Assignments" value={assignments?.length ?? 0} />
        <StatCard label="All Reports (Filtered)" value={filteredReports.length} />
        <StatCard label="Clients" value={clients?.length ?? 0} />
      </section>

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
                <p className="text-xs">Assignments: {clientCounts.get(client.id) ?? 0}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <FormDialog
          title="Assign Report"
          description="Assign one report to one client."
          triggerLabel="Assign Report"
          triggerVariant="default"
        >
          <form action={assignReportAction} className="grid gap-3 md:grid-cols-3">
            <label className="text-sm">
              Step 1 — Select Client
              <select
                name="client_id"
                required
                defaultValue={selectedClientId}
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="">Choose client</option>
                {(clients ?? []).map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm md:col-span-2">
              Step 2 — Select Published Report
              <select
                name="report_id"
                required
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="">Choose report</option>
                {publishedReports.map((report) => (
                  <option key={report.id} value={report.id}>
                    {report.id.slice(0, 8)} · {reportTypeById.get(report.report_type_template_id) ?? "-"} ·{" "}
                    {entityById.get(report.entity_id) ?? "-"}
                  </option>
                ))}
              </select>
            </label>
            <div className="md:col-span-3">
              <input type="hidden" name="granularity_id" value={granularityFilter} />
              <Button type="submit">Step 3 — Confirm Assignment</Button>
            </div>
          </form>
        </FormDialog>
      </div>
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
                </CardHeader>
                <CardContent>
                  <DataGrid>
                    <DataGridTable>
                      <DataGridHead>
                        <DataGridRow className="border-t-0">
                          <DataGridCell header>Report</DataGridCell>
                          <DataGridCell header>Report Type</DataGridCell>
                          <DataGridCell header>Status</DataGridCell>
                          <DataGridCell header>Assigned</DataGridCell>
                          <DataGridCell header className="text-right">Actions</DataGridCell>
                        </DataGridRow>
                      </DataGridHead>
                      <DataGridBody>
                        {rows.map((report) => (
                          <DataGridRow key={report.id}>
                            <DataGridCell className="text-muted-foreground">{report.id.slice(0, 8)}</DataGridCell>
                            <DataGridCell className="text-muted-foreground">
                              {reportTypeById.get(report.report_type_template_id) ?? "-"}
                            </DataGridCell>
                            <DataGridCell className="text-muted-foreground">
                              {report.status}
                            </DataGridCell>
                            <DataGridCell className="text-muted-foreground">
                              {selectedClientAssignmentSet.has(report.id) ? (
                                <span className="text-success">Assigned</span>
                              ) : (
                                <span className="text-critical">Not Assigned</span>
                              )}
                            </DataGridCell>
                            <DataGridCell>
                              <div className="flex justify-end">
                                {selectedClientId ? (
                                  selectedClientAssignmentSet.has(report.id) ? (
                                    <form action={unassignReportAction}>
                                      <input type="hidden" name="client_id" value={selectedClientId} />
                                      <input type="hidden" name="report_id" value={report.id} />
                                      <input type="hidden" name="granularity_id" value={granularityFilter} />
                                      <ConfirmSubmitDialogButton
                                        type="submit"
                                        size="sm"
                                        variant="destructive"
                                        confirmTitle="Unassign report"
                                        confirmDescription="Unassign this report from the selected client?"
                                        confirmText="Unassign"
                                      >
                                        Unassign
                                      </ConfirmSubmitDialogButton>
                                    </form>
                                  ) : (
                                    <form action={assignReportAction}>
                                      <input type="hidden" name="client_id" value={selectedClientId} />
                                      <input type="hidden" name="report_id" value={report.id} />
                                      <input type="hidden" name="granularity_id" value={granularityFilter} />
                                      <Button type="submit" size="sm">
                                        Assign
                                      </Button>
                                    </form>
                                  )
                                ) : (
                                  <span className="text-xs text-muted-foreground">Select client</span>
                                )}
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
