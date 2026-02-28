import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { Badge } from "@/components/ui/badge";
import { PageHeader, StatCard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ConfirmSubmitDialogButton } from "@/components/ui/confirm-submit-dialog-button";
import { FormDialog } from "@/components/ui/form-dialog";
import { RowActions, DropdownMenuItem } from "@/components/ui/row-actions";
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHead,
  DataGridRow,
  DataGridTable,
} from "@/components/ui/data-grid";

async function createReportTypeAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "").trim();
  const isActive = formData.get("is_active") === "on";

  if (!name || !category || !granularityId) {
    redirect("/admin/report-types?error=Name,+category,+and+granularity+are+required");
  }

  const { error } = await supabase.from("report_type_templates").insert({
    name,
    description: description || null,
    category,
    granularity_id: granularityId,
    is_active: isActive,
  });

  if (error) {
    redirect(`/admin/report-types?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/report-types");
  redirect("/admin/report-types?success=Report+type+created");
}

async function updateReportTypeAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "").trim();
  const isActive = formData.get("is_active") === "on";

  if (!id || !name || !category || !granularityId) {
    redirect("/admin/report-types?error=Missing+required+fields");
  }

  const { error } = await supabase
    .from("report_type_templates")
    .update({
      name,
      description: description || null,
      category,
      granularity_id: granularityId,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/report-types?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/report-types");
  redirect("/admin/report-types?success=Report+type+updated");
}

async function deleteReportTypeAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/report-types?error=Missing+id");

  const { count } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("report_type_template_id", id);

  if ((count ?? 0) > 0) {
    redirect("/admin/report-types?error=Cannot+delete.+Reports+already+use+this+type");
  }

  const { error } = await supabase.from("report_type_templates").delete().eq("id", id);
  if (error) {
    redirect(`/admin/report-types?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/report-types");
  redirect("/admin/report-types?success=Report+type+deleted");
}

export default async function AdminReportTypesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    granularity?: string;
    active?: "all" | "active" | "inactive";
    success?: string;
    error?: string;
  }>;
}) {
  await requireRole("admin");
  const supabase = await createClient();
  const params = await searchParams;
  const queryText = (params.q ?? "").trim();
  const categoryFilter = (params.category ?? "all").trim();
  const granularityFilter = (params.granularity ?? "all").trim();
  const activeFilter = params.active ?? "all";

  const [{ data: granularities }, { data: pagesCountRows }, { data: reportCountRows }] =
    await Promise.all([
      supabase.from("granularities").select("id,name").order("name", { ascending: true }),
      supabase.from("report_page_templates").select("report_type_template_id"),
      supabase.from("reports").select("report_type_template_id"),
    ]);

  let query = supabase
    .from("report_type_templates")
    .select("id,name,description,category,granularity_id,is_active,created_at,granularities(name)")
    .order("created_at", { ascending: false });

  if (queryText) query = query.ilike("name", `%${queryText}%`);
  if (categoryFilter !== "all") query = query.eq("category", categoryFilter);
  if (granularityFilter !== "all") query = query.eq("granularity_id", granularityFilter);
  if (activeFilter === "active") query = query.eq("is_active", true);
  if (activeFilter === "inactive") query = query.eq("is_active", false);

  const { data } = await query;

  const pageCountMap = new Map<string, number>();
  (pagesCountRows ?? []).forEach((row) => {
    pageCountMap.set(
      row.report_type_template_id,
      (pageCountMap.get(row.report_type_template_id) ?? 0) + 1,
    );
  });

  const reportCountMap = new Map<string, number>();
  (reportCountRows ?? []).forEach((row) => {
    reportCountMap.set(
      row.report_type_template_id,
      (reportCountMap.get(row.report_type_template_id) ?? 0) + 1,
    );
  });

  const categories = Array.from(new Set((data ?? []).map((row) => row.category).filter(Boolean)));
  const groupedEntries = Array.from(
    (data ?? []).reduce((map, row) => {
      const groupKey = row.category || "Uncategorized";
      const current = map.get(groupKey) ?? [];
      current.push(row);
      map.set(groupKey, current);
      return map;
    }, new Map<string, (typeof data extends Array<infer U> ? U : never)[]>()),
  ).sort(([first], [second]) => first.localeCompare(second));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Type Templates"
        description="Reusable report definitions mapped to business granularities."
      />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Templates" value={data?.length ?? 0} />
        <StatCard
          label="Active Templates"
          value={(data ?? []).filter((row) => row.is_active).length}
        />
      </section>
      <div className="flex justify-end">
        <FormDialog
          title="Create Report Type"
          description="Define a reusable report type template."
          triggerLabel="Create Report Type"
          triggerVariant="default"
        >
          <form action={createReportTypeAction} className="grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              Name
              <Input className="mt-1" name="name" required placeholder="Feasibility Assessment" />
            </label>
            <label className="text-sm">
              Category
              <Input className="mt-1" name="category" required placeholder="Operations" />
            </label>
            <label className="text-sm">
              Granularity
              <select
                name="granularity_id"
                required
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="">Select granularity</option>
                {(granularities ?? []).map((granularity) => (
                  <option key={granularity.id} value={granularity.id}>
                    {granularity.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Description
              <Input className="mt-1" name="description" placeholder="Type description" />
            </label>
            <label className="text-sm md:col-span-2">
              <input type="checkbox" name="is_active" defaultChecked className="mr-2 align-middle" />
              Active
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Save Report Type</Button>
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
          <CardTitle className="text-base">Template Catalog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-3 md:grid-cols-4">
            <label className="text-sm">
              Search name
              <Input className="mt-1" name="q" defaultValue={queryText} />
            </label>
            <label className="text-sm">
              Category
              <select
                name="category"
                defaultValue={categoryFilter}
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="all">All</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Granularity
              <select
                name="granularity"
                defaultValue={granularityFilter}
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="all">All</option>
                {(granularities ?? []).map((granularity) => (
                  <option key={granularity.id} value={granularity.id}>
                    {granularity.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Active
              <select
                name="active"
                defaultValue={activeFilter}
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <div className="md:col-span-4">
              <Button type="submit" variant="secondary">
                Apply Filters
              </Button>
            </div>
          </form>
          {(data?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">Define your first report structure.</p>
          ) : null}
          <div className="space-y-4">
            {groupedEntries.map(([categoryName, rows]) => (
              <div key={categoryName} className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Category: {categoryName}
                </h3>
                <DataGrid>
                  <DataGridTable>
                    <DataGridHead>
                      <DataGridRow className="border-t-0">
                        <DataGridCell header>Name</DataGridCell>
                        <DataGridCell header>Granularity</DataGridCell>
                        <DataGridCell header>Active</DataGridCell>
                        <DataGridCell header>Pages</DataGridCell>
                        <DataGridCell header>Used By Reports</DataGridCell>
                        <DataGridCell header>Created</DataGridCell>
                        <DataGridCell header className="text-right">Actions</DataGridCell>
                      </DataGridRow>
                    </DataGridHead>
                    <DataGridBody>
                      {rows.map((row) => {
                        const granularityRelation = row.granularities as
                          | { name?: string }[]
                          | { name?: string }
                          | null;
                        const granularityName = Array.isArray(granularityRelation)
                          ? granularityRelation[0]?.name
                          : granularityRelation?.name;

                        return (
                          <DataGridRow key={row.id}>
                            <DataGridCell className="font-medium">{row.name}</DataGridCell>
                            <DataGridCell className="text-muted-foreground">{granularityName ?? "-"}</DataGridCell>
                            <DataGridCell>
                              <Badge variant={row.is_active ? "secondary" : "outline"}>
                                {row.is_active ? "active" : "inactive"}
                              </Badge>
                            </DataGridCell>
                            <DataGridCell className="text-muted-foreground">
                              {pageCountMap.get(row.id) ?? 0}
                            </DataGridCell>
                            <DataGridCell className="text-muted-foreground">
                              {reportCountMap.get(row.id) ?? 0}
                            </DataGridCell>
                            <DataGridCell className="text-muted-foreground">
                              {new Date(row.created_at).toLocaleDateString()}
                            </DataGridCell>
                            <DataGridCell>
                              <div className="flex justify-end gap-2">
                                <FormDialog
                                  title="Edit Report Type"
                                  description="Update report type metadata and status."
                                  triggerLabel="Edit"
                                >
                                  <form action={updateReportTypeAction} className="grid gap-3 md:grid-cols-2">
                                    <input type="hidden" name="id" value={row.id} />
                                    <label className="text-sm">
                                      Name
                                      <Input className="mt-1" name="name" defaultValue={row.name} required />
                                    </label>
                                    <label className="text-sm">
                                      Category
                                      <Input className="mt-1" name="category" defaultValue={row.category} required />
                                    </label>
                                    <label className="text-sm">
                                      Granularity
                                      <select
                                        name="granularity_id"
                                        defaultValue={row.granularity_id}
                                        className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
                                      >
                                        {(granularities ?? []).map((granularity) => (
                                          <option key={granularity.id} value={granularity.id}>
                                            {granularity.name}
                                          </option>
                                        ))}
                                      </select>
                                    </label>
                                    <label className="text-sm">
                                      Description
                                      <Input className="mt-1" name="description" defaultValue={row.description ?? ""} />
                                    </label>
                                    <label className="text-sm md:col-span-2">
                                      <input
                                        type="checkbox"
                                        name="is_active"
                                        defaultChecked={row.is_active}
                                        className="mr-2 align-middle"
                                      />
                                      Active
                                    </label>
                                    <div className="md:col-span-2">
                                      <Button type="submit">Save Changes</Button>
                                    </div>
                                  </form>
                                </FormDialog>
                                <RowActions>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/report-types/${row.id}/pages`}>
                                      Manage Pages ({pageCountMap.get(row.id) ?? 0})
                                    </Link>
                                  </DropdownMenuItem>
                                </RowActions>
                                <form action={deleteReportTypeAction}>
                                  <input type="hidden" name="id" value={row.id} />
                                  <ConfirmSubmitDialogButton
                                    size="sm"
                                    variant="destructive"
                                    type="submit"
                                    confirmTitle="Delete report type"
                                    confirmDescription="Delete this report type? Existing template pages under this type will also be removed."
                                    confirmText="Delete"
                                  >
                                    Delete
                                  </ConfirmSubmitDialogButton>
                                </form>
                              </div>
                            </DataGridCell>
                          </DataGridRow>
                        );
                      })}
                    </DataGridBody>
                  </DataGridTable>
                </DataGrid>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
