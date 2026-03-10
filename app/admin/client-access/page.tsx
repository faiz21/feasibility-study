import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader, StatCard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmSubmitDialogButton } from "@/components/ui/confirm-submit-dialog-button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function resolveGranularityName(input: unknown): string | null {
  if (Array.isArray(input)) {
    const first = input[0];
    if (first && typeof first === "object" && "name" in first && typeof first.name === "string") {
      return first.name;
    }
    return null;
  }
  if (input && typeof input === "object" && "name" in input && typeof input.name === "string") {
    return input.name;
  }
  return null;
}

async function addAccessAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();
  const clientId = String(formData.get("client_id") ?? "");
  const reportTypeId = String(formData.get("report_type_template_id") ?? "");

  if (!clientId || !reportTypeId) redirect("/admin/client-access?error=Missing+client+or+template");

  const { error } = await supabase.from("client_report_type_access").insert({
    client_id: clientId,
    report_type_template_id: reportTypeId,
  });
  if (error) redirect(`/admin/client-access?client_id=${clientId}&error=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/client-access");
  redirect(`/admin/client-access?client_id=${clientId}&success=Template+access+added`);
}

async function removeAccessAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();
  const clientId = String(formData.get("client_id") ?? "");
  const reportTypeId = String(formData.get("report_type_template_id") ?? "");

  if (!clientId || !reportTypeId) redirect("/admin/client-access?error=Missing+client+or+template");

  const { error } = await supabase
    .from("client_report_type_access")
    .delete()
    .eq("client_id", clientId)
    .eq("report_type_template_id", reportTypeId);

  if (error) redirect(`/admin/client-access?client_id=${clientId}&error=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/client-access");
  redirect(`/admin/client-access?client_id=${clientId}&success=Template+access+removed`);
}

export default async function AdminClientAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string; success?: string; error?: string }>;
}) {
  await requireRole("admin");
  const supabase = await createClient();
  const params = await searchParams;

  const [{ data: clients }, { data: reportTypes }] = await Promise.all([
    supabase.from("clients").select("id,name,code").order("name", { ascending: true }),
    supabase
      .from("report_type_templates")
      .select("id,name,category,granularities(name)")
      .order("name", { ascending: true }),
  ]);

  const selectedClientId = params.client_id ?? clients?.[0]?.id;

  const { data: accessRows } = selectedClientId
    ? await supabase
        .from("client_report_type_access")
        .select("report_type_template_id")
        .eq("client_id", selectedClientId)
    : { data: [] };

  const enabledSet = new Set((accessRows ?? []).map((row) => row.report_type_template_id));
  const available = (reportTypes ?? []).filter((type) => !enabledSet.has(type.id));
  const enabled = (reportTypes ?? []).filter((type) => enabledSet.has(type.id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Access"
        description="Enable or revoke report type template access per client."
      />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Clients" value={clients?.length ?? 0} />
        <StatCard label="Available Types" value={available.length} />
        <StatCard label="Enabled Types" value={enabled.length} />
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
          <CardTitle className="text-base">Select Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <select
              name="client_id"
              defaultValue={selectedClientId}
              className="block h-10 w-full max-w-md rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
            >
              {(clients ?? []).map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.code})
                </option>
              ))}
            </select>
            <div className="mt-3">
              <Button type="submit" variant="secondary">
                Load Client Access
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Available Report Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {available.length === 0 ? (
              <p className="text-sm text-muted-foreground">No available report types.</p>
            ) : null}
            {available.map((type) => {
              const granularity = resolveGranularityName(type.granularities);
              return (
                <div key={type.id} className="flex items-center justify-between rounded-lg border border-border/70 p-2">
                  <div>
                    <p className="text-sm font-medium">{type.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {type.category} | {granularity ?? "-"}
                    </p>
                  </div>
                  <form action={addAccessAction}>
                    <input type="hidden" name="client_id" value={selectedClientId} />
                    <input type="hidden" name="report_type_template_id" value={type.id} />
                    <Button type="submit" size="sm">
                      Add &gt;&gt;
                    </Button>
                  </form>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enabled for Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {enabled.length === 0 ? (
              <p className="text-sm text-muted-foreground">No template access configured yet.</p>
            ) : null}
            {enabled.map((type) => {
              const granularity = resolveGranularityName(type.granularities);
              return (
                <div key={type.id} className="flex items-center justify-between rounded-lg border border-border/70 p-2">
                  <div>
                    <p className="text-sm font-medium">{type.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {type.category} | {granularity ?? "-"}
                    </p>
                  </div>
                  <form action={removeAccessAction}>
                    <input type="hidden" name="client_id" value={selectedClientId} />
                    <input type="hidden" name="report_type_template_id" value={type.id} />
                    <ConfirmSubmitDialogButton
                      type="submit"
                      size="sm"
                      variant="secondary"
                      confirmTitle="Remove template access"
                      confirmDescription="Remove this template access for the selected client?"
                      confirmText="Remove"
                    >
                      &lt;&lt; Remove
                    </ConfirmSubmitDialogButton>
                  </form>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
