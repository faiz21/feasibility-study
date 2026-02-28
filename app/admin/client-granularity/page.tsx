import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader, StatCard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function saveClientGranularityAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "").trim();
  const selectedGranularityIds = formData
    .getAll("granularity_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (!clientId) {
    redirect("/admin/client-granularity?error=Please+select+a+client");
  }

  const { error: deleteError } = await supabase
    .from("client_granularity_access")
    .delete()
    .eq("client_id", clientId);

  if (deleteError) {
    redirect(
      `/admin/client-granularity?client_id=${clientId}&error=${encodeURIComponent(
        deleteError.message,
      )}`,
    );
  }

  if (selectedGranularityIds.length > 0) {
    const payload = selectedGranularityIds.map((granularityId) => ({
      client_id: clientId,
      granularity_id: granularityId,
    }));
    const { error: insertError } = await supabase
      .from("client_granularity_access")
      .insert(payload);

    if (insertError) {
      redirect(
        `/admin/client-granularity?client_id=${clientId}&error=${encodeURIComponent(
          insertError.message,
        )}`,
      );
    }
  }

  revalidatePath("/admin/client-granularity");
  redirect(
    `/admin/client-granularity?client_id=${clientId}&success=Client+granularity+updated`,
  );
}

export default async function AdminClientGranularityPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string; success?: string; error?: string }>;
}) {
  await requireRole("admin");
  const supabase = await createClient();
  const params = await searchParams;

  const [{ data: clients }, { data: granularities }] = await Promise.all([
    supabase.from("clients").select("id,name,code").order("name", { ascending: true }),
    supabase.from("granularities").select("id,code,name").order("name", { ascending: true }),
  ]);

  const selectedClientId = params.client_id ?? clients?.[0]?.id;
  const { data: rows } = selectedClientId
    ? await supabase
        .from("client_granularity_access")
        .select("granularity_id")
        .eq("client_id", selectedClientId)
    : { data: [] };

  const selectedSet = new Set((rows ?? []).map((row) => row.granularity_id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Granularity"
        description="Configure which granularities are enabled for each client."
      />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Clients" value={clients?.length ?? 0} />
        <StatCard label="Granularities" value={granularities?.length ?? 0} />
        <StatCard label="Enabled (Selected Client)" value={selectedSet.size} />
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
                Load Client
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enabled Granularities (Multi-select)</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedClientId ? (
            <p className="text-sm text-muted-foreground">Create a client first to configure access.</p>
          ) : (
            <form action={saveClientGranularityAction} className="space-y-3">
              <input type="hidden" name="client_id" value={selectedClientId} />
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {(granularities ?? []).map((granularity) => (
                  <label
                    key={granularity.id}
                    className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      name="granularity_ids"
                      value={granularity.id}
                      defaultChecked={selectedSet.has(granularity.id)}
                    />
                    <span>
                      {granularity.name} <span className="text-xs text-muted-foreground">({granularity.code})</span>
                    </span>
                  </label>
                ))}
              </div>
              <Button type="submit">Save Granularity Access</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
