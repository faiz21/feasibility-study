import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader, StatCard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDialog } from "@/components/ui/form-dialog";
import { ConfirmSubmitDialogButton } from "@/components/ui/confirm-submit-dialog-button";
import { StatusBanner } from "@/components/ui/status-banner";
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHead,
  DataGridRow,
  DataGridTable,
} from "@/components/ui/data-grid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

const CLIENT_ASSET_BUCKET = process.env.NEXT_PUBLIC_CLIENT_ASSET_BUCKET ?? "client-assets";

function sanitizePathSegment(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
}

function getExtension(filename: string, mimeType: string): string {
  const directExt = filename.split(".").pop()?.toLowerCase();
  if (directExt && /^[a-z0-9]{2,6}$/.test(directExt)) return directExt;
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("svg")) return "svg";
  return "bin";
}

async function getClientCodeForAssets(
  supabase: Awaited<ReturnType<typeof createClient>>,
  clientId: string,
): Promise<string> {
  if (!clientId) return "client";
  const { data } = await supabase.from("clients").select("code").eq("id", clientId).maybeSingle();
  return String(data?.code ?? clientId).trim() || clientId;
}

async function uploadEntityImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fileValue: FormDataEntryValue | null,
  clientCode: string,
  entityName: string,
): Promise<string | null> {
  if (!(fileValue instanceof File) || fileValue.size <= 0) return null;
  if (!fileValue.type.startsWith("image/")) {
    throw new Error("Photo file must be an image");
  }

  const assetBucket = CLIENT_ASSET_BUCKET;

  const safeClientCode = sanitizePathSegment(clientCode || "client");
  const safeEntityName = sanitizePathSegment(entityName || "entity");
  const ext = getExtension(fileValue.name, fileValue.type);
  const filePath = `clients/${safeClientCode}/entities/${safeEntityName}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(assetBucket).upload(filePath, fileValue, {
    upsert: true,
    contentType: fileValue.type || undefined,
  });
  if (error) {
    const message = error.message || "Upload failed";
    if (message.toLowerCase().includes("bucket") && message.toLowerCase().includes("not found")) {
      throw new Error(
        `Storage bucket "${assetBucket}" not found. Double-check the bucket name in Supabase Storage and set NEXT_PUBLIC_CLIENT_ASSET_BUCKET (then restart dev).`,
      );
    }
    throw new Error(message);
  }

  return `${assetBucket}/${filePath}`;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsvRows(csvText: string): Array<Record<string, string>> {
  const normalized = csvText.replace(/^\uFEFF/, "").trim();
  if (!normalized) return [];

  const lines = normalized.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = String(cells[index] ?? "").trim();
      return row;
    }, {});
  });
}

function parseCsvTags(raw: string): string[] {
  if (!raw) return [];
  if (raw.includes("|")) {
    return raw
      .split("|")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return parseTags(raw);
}

async function ensureGranularityAllowed(clientId: string, granularityId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("client_granularity_access")
    .select("id")
    .eq("client_id", clientId)
    .eq("granularity_id", granularityId)
    .maybeSingle();
  return Boolean(data);
}

async function createEntityAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  let photoUrl = String(formData.get("photo_url") ?? "").trim();
  const tags = parseTags(String(formData.get("tags_csv") ?? ""));

  if (!clientId || !granularityId || !name) {
    redirect(`/admin/client-entities?client_id=${clientId}&error=Missing+required+fields`);
  }

  try {
    const clientCode = await getClientCodeForAssets(supabase, clientId);
    const uploadedPhotoPath = await uploadEntityImage(supabase, formData.get("photo_file"), clientCode, name);
    if (uploadedPhotoPath) photoUrl = uploadedPhotoPath;
  } catch (error) {
    redirect(
      `/admin/client-entities?client_id=${clientId}&error=${encodeURIComponent((error as Error).message)}`,
    );
  }

  const allowed = await ensureGranularityAllowed(clientId, granularityId);
  if (!allowed) {
    redirect(
      `/admin/client-entities?client_id=${clientId}&error=Selected+granularity+is+not+enabled+for+this+client`,
    );
  }

  const { error } = await supabase.from("report_entities").insert({
    client_id: clientId,
    granularity_id: granularityId,
    name,
    description: description || null,
    photo_url: photoUrl || null,
    tags,
  });

  if (error) {
    redirect(`/admin/client-entities?client_id=${clientId}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/client-entities");
  redirect(`/admin/client-entities?client_id=${clientId}&success=Entity+created`);
}

async function updateEntityAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  let photoUrl = String(formData.get("photo_url") ?? "").trim();
  const tags = parseTags(String(formData.get("tags_csv") ?? ""));

  if (!id || !clientId || !granularityId || !name) {
    redirect(`/admin/client-entities?client_id=${clientId}&error=Missing+required+fields`);
  }

  try {
    const clientCode = await getClientCodeForAssets(supabase, clientId);
    const uploadedPhotoPath = await uploadEntityImage(supabase, formData.get("photo_file"), clientCode, name);
    if (uploadedPhotoPath) photoUrl = uploadedPhotoPath;
  } catch (error) {
    redirect(
      `/admin/client-entities?client_id=${clientId}&error=${encodeURIComponent((error as Error).message)}`,
    );
  }

  const allowed = await ensureGranularityAllowed(clientId, granularityId);
  if (!allowed) {
    redirect(
      `/admin/client-entities?client_id=${clientId}&error=Selected+granularity+is+not+enabled+for+this+client`,
    );
  }

  const { error } = await supabase
    .from("report_entities")
    .update({
      client_id: clientId,
      granularity_id: granularityId,
      name,
      description: description || null,
      photo_url: photoUrl || null,
      tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/client-entities?client_id=${clientId}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/client-entities");
  redirect(`/admin/client-entities?client_id=${clientId}&success=Entity+updated`);
}

async function deleteEntityAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  if (!id || !clientId) {
    redirect("/admin/client-entities?error=Missing+entity+id");
  }

  const { error } = await supabase.from("report_entities").delete().eq("id", id);
  if (error) {
    redirect(`/admin/client-entities?client_id=${clientId}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/client-entities");
  redirect(`/admin/client-entities?client_id=${clientId}&success=Entity+deleted`);
}

async function importEntitiesCsvAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "").trim();
  const file = formData.get("entities_csv");

  if (!clientId) {
    redirect("/admin/client-entities?error=Missing+client");
  }
  if (!(file instanceof File) || file.size === 0) {
    redirect(`/admin/client-entities?client_id=${clientId}&error=Please+upload+a+CSV+file`);
  }

  const csvRows = parseCsvRows(await file.text());
  if (csvRows.length === 0) {
    redirect(
      `/admin/client-entities?client_id=${clientId}&error=CSV+must+contain+header+and+at+least+1+row`,
    );
  }

  const { data: allowedGranularities } = await supabase
    .from("client_granularity_access")
    .select("granularity:granularity_id(id,name,code)")
    .eq("client_id", clientId);

  const normalizedAllowed = (allowedGranularities ?? []).flatMap((row) => {
    const candidate = row.granularity as unknown;
    const normalizeOne = (value: unknown): { id: string; code: string; name: string } | null => {
      if (!value || typeof value !== "object") return null;
      const v = value as Record<string, unknown>;
      if (typeof v.id !== "string" || typeof v.code !== "string" || typeof v.name !== "string") {
        return null;
      }
      return { id: v.id, code: v.code, name: v.name };
    };

    if (Array.isArray(candidate)) {
      return candidate
        .map((item) => normalizeOne(item))
        .filter((item): item is { id: string; code: string; name: string } => Boolean(item));
    }

    const single = normalizeOne(candidate);
    return single ? [single] : [];
  });

  const granularityById = new Map(normalizedAllowed.map((granularity) => [granularity.id, granularity.id]));
  const granularityByCode = new Map(
    normalizedAllowed.map((granularity) => [granularity.code.toLowerCase(), granularity.id]),
  );
  const granularityByName = new Map(
    normalizedAllowed.map((granularity) => [granularity.name.toLowerCase(), granularity.id]),
  );

  const errors: string[] = [];
  const payload: Array<{
    client_id: string;
    granularity_id: string;
    name: string;
    description: string | null;
    photo_url: string | null;
    tags: string[];
  }> = [];

  csvRows.forEach((row, index) => {
    const lineNo = index + 2;
    const name = String(row.name ?? "").trim();
    const granularityToken = String(
      row.granularity_id ?? row.granularity_code ?? row.granularity_name ?? row.granularity ?? "",
    ).trim();
    const description = String(row.description ?? "").trim();
    const photoUrl = String(row.photo_url ?? "").trim();
    const tagsRaw = String(row.tags ?? "").trim();

    if (!name) errors.push(`Row ${lineNo}: name is required`);
    if (!granularityToken) {
      errors.push(`Row ${lineNo}: granularity_id, granularity_code, or granularity_name is required`);
      return;
    }

    const resolvedGranularityId =
      granularityById.get(granularityToken) ??
      granularityByCode.get(granularityToken.toLowerCase()) ??
      granularityByName.get(granularityToken.toLowerCase());

    if (!resolvedGranularityId) {
      errors.push(`Row ${lineNo}: granularity "${granularityToken}" is not enabled for this client`);
      return;
    }

    if (name) {
      payload.push({
        client_id: clientId,
        granularity_id: resolvedGranularityId,
        name,
        description: description || null,
        photo_url: photoUrl || null,
        tags: parseCsvTags(tagsRaw),
      });
    }
  });

  if (errors.length > 0) {
    redirect(
      `/admin/client-entities?client_id=${clientId}&error=${encodeURIComponent(errors.slice(0, 5).join("; "))}`,
    );
  }

  const { error } = await supabase.from("report_entities").insert(payload);
  if (error) {
    redirect(`/admin/client-entities?client_id=${clientId}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/client-entities");
  redirect(
    `/admin/client-entities?client_id=${clientId}&success=${encodeURIComponent(`Imported ${payload.length} entities`)}`,
  );
}

export default async function AdminClientEntitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string; q?: string; success?: string; error?: string }>;
}) {
  await requireRole("admin");
  const supabase = await createClient();
  const params = await searchParams;

  const [{ data: clients }, { data: granularities }] = await Promise.all([
    supabase.from("clients").select("id,name,code").order("name", { ascending: true }),
    supabase.from("granularities").select("id,name,code").order("name", { ascending: true }),
  ]);

  const selectedClientId = params.client_id ?? clients?.[0]?.id;
  const searchText = (params.q ?? "").trim();

  const { data: mappingRows } = selectedClientId
    ? await supabase
        .from("client_granularity_access")
        .select("granularity_id")
        .eq("client_id", selectedClientId)
    : { data: [] };

  const allowedGranularityIds = new Set((mappingRows ?? []).map((row) => row.granularity_id));
  const allowedGranularities = (granularities ?? []).filter((granularity) =>
    allowedGranularityIds.has(granularity.id),
  );

  let entityQuery = supabase
    .from("report_entities")
    .select("id,client_id,granularity_id,name,description,photo_url,tags,created_at")
    .order("created_at", { ascending: false });

  if (selectedClientId) entityQuery = entityQuery.eq("client_id", selectedClientId);
  if (searchText) entityQuery = entityQuery.ilike("name", `%${searchText}%`);

  const { data: entities } = selectedClientId ? await entityQuery : { data: [] };

  const grouped = allowedGranularities.map((granularity) => ({
    granularity,
    entities: (entities ?? []).filter((entity) => entity.granularity_id === granularity.id),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Entities"
        description="Manage entities grouped by the selected client's configured granularities."
      />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Clients" value={clients?.length ?? 0} />
        <StatCard label="Allowed Granularities" value={allowedGranularities.length} />
        <StatCard label="Entities" value={entities?.length ?? 0} />
      </section>

      {params.success ? (
        <StatusBanner tone="success">{params.success}</StatusBanner>
      ) : null}
      {params.error ? (
        <StatusBanner tone="critical">{params.error}</StatusBanner>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-3">
            <label className="text-sm md:col-span-2">
              Client
              <select
                name="client_id"
                defaultValue={selectedClientId}
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                {(clients ?? []).map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.code})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Search entity
              <Input name="q" defaultValue={searchText} className="mt-1" placeholder="Search by name" />
            </label>
            <div className="md:col-span-3">
              <Button type="submit" variant="secondary">
                Load Entities
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end gap-2">
        <FormDialog
          title="Import Entities CSV"
          description="Quick insert multiple entities for the selected client."
          triggerLabel="Import CSV"
          triggerVariant="secondary"
        >
          {!selectedClientId ? (
            <p className="text-sm text-muted-foreground">Select a client first.</p>
          ) : allowedGranularities.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Configure client granularity first from Client Granularity page.
            </p>
          ) : (
            <form action={importEntitiesCsvAction} className="grid gap-3" encType="multipart/form-data">
              <input type="hidden" name="client_id" value={selectedClientId} />
              <label className="text-sm">
                CSV file
                <Input name="entities_csv" type="file" accept=".csv,text/csv" required className="mt-1" />
              </label>
              <p className="text-xs text-muted-foreground">
                Required columns: <code>name</code> and one of{" "}
                <code>granularity_id | granularity_code | granularity_name | granularity</code>. Optional:
                <code>description</code>, <code>photo_url</code>, <code>tags</code> (use <code>|</code> separator).
              </p>
              <Button type="submit">Import Entities</Button>
            </form>
          )}
        </FormDialog>
        <FormDialog
          title="Create Client Entity"
          description="Create an entity under an allowed granularity."
          triggerLabel="Create Entity"
          triggerVariant="default"
        >
          {!selectedClientId ? (
            <p className="text-sm text-muted-foreground">Select a client first.</p>
          ) : allowedGranularities.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Configure client granularity first from Client Granularity page.
            </p>
          ) : (
            <form
              action={createEntityAction}
              className="grid gap-3 md:grid-cols-2"
              encType="multipart/form-data"
            >
              <input type="hidden" name="client_id" value={selectedClientId} />
              <label className="text-sm">
                Name
                <Input name="name" required className="mt-1" />
              </label>
              <label className="text-sm">
                Granularity
                <select
                  name="granularity_id"
                  required
                  className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
                >
                  {allowedGranularities.map((granularity) => (
                    <option key={granularity.id} value={granularity.id}>
                      {granularity.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm md:col-span-2">
                Description
                <Input name="description" className="mt-1" />
              </label>
              <label className="text-sm">
                Photo (upload)
                <Input name="photo_file" type="file" accept="image/*" className="mt-1" />
              </label>
              <label className="text-sm">
                Photo URL
                <Input name="photo_url" type="url" className="mt-1" placeholder="https://..." />
              </label>
              <label className="text-sm">
                Tags (comma-separated)
                <Input name="tags_csv" className="mt-1" placeholder="tag1, tag2" />
              </label>
              <p className="text-xs text-muted-foreground md:col-span-2">
                Upload a photo file or paste a URL. Upload overrides the URL field.
              </p>
              <div className="md:col-span-2">
                <Button type="submit">Save Entity</Button>
              </div>
            </form>
          )}
        </FormDialog>
      </div>

      {selectedClientId && allowedGranularities.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Configure client granularity first, then manage client entities.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {grouped.map(({ granularity, entities: entityRows }) => (
        <Card key={granularity.id}>
          <CardHeader>
            <CardTitle className="text-base">
              {granularity.name} <span className="text-xs text-muted-foreground">({granularity.code})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {entityRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No entities yet.</p>
            ) : (
              <DataGrid>
                <DataGridTable>
                  <DataGridHead>
                    <DataGridRow className="border-t-0">
                      <DataGridCell header>Name</DataGridCell>
                      <DataGridCell header>Description</DataGridCell>
                      <DataGridCell header>Tags</DataGridCell>
                      <DataGridCell header>Created</DataGridCell>
                      <DataGridCell header className="text-right">Actions</DataGridCell>
                    </DataGridRow>
                  </DataGridHead>
                  <DataGridBody>
                    {entityRows.map((entity) => (
                      <DataGridRow key={entity.id}>
                        <DataGridCell className="font-medium">{entity.name}</DataGridCell>
                        <DataGridCell className="text-muted-foreground">{entity.description ?? "-"}</DataGridCell>
                        <DataGridCell className="text-muted-foreground">
                          {Array.isArray(entity.tags) ? entity.tags.join(", ") : "-"}
                        </DataGridCell>
                        <DataGridCell className="text-muted-foreground">
                          {new Date(entity.created_at).toLocaleDateString()}
                        </DataGridCell>
                        <DataGridCell>
                          <div className="flex justify-end gap-2">
                            <FormDialog
                              title="Edit Client Entity"
                              description="Update entity information."
                              triggerLabel="Edit"
                            >
                              <form
                                action={updateEntityAction}
                                className="grid gap-3 md:grid-cols-2"
                                encType="multipart/form-data"
                              >
                                <input type="hidden" name="id" value={entity.id} />
                                <input type="hidden" name="client_id" value={selectedClientId} />
                                <label className="text-sm">
                                  Name
                                  <Input name="name" required defaultValue={entity.name} className="mt-1" />
                                </label>
                                <label className="text-sm">
                                  Granularity
                                  <select
                                    name="granularity_id"
                                    required
                                    defaultValue={entity.granularity_id}
                                    className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
                                  >
                                    {allowedGranularities.map((allowed) => (
                                      <option key={allowed.id} value={allowed.id}>
                                        {allowed.name}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <label className="text-sm md:col-span-2">
                                  Description
                                  <Input
                                    name="description"
                                    defaultValue={entity.description ?? ""}
                                    className="mt-1"
                                  />
                                </label>
                                <label className="text-sm">
                                  Photo (upload)
                                  <Input name="photo_file" type="file" accept="image/*" className="mt-1" />
                                </label>
                                <label className="text-sm">
                                  Photo URL
                                  <Input
                                    name="photo_url"
                                    defaultValue={entity.photo_url ?? ""}
                                    className="mt-1"
                                  />
                                </label>
                                <label className="text-sm">
                                  Tags (comma-separated)
                                  <Input
                                    name="tags_csv"
                                    defaultValue={Array.isArray(entity.tags) ? entity.tags.join(", ") : ""}
                                    className="mt-1"
                                  />
                                </label>
                                <p className="text-xs text-muted-foreground md:col-span-2">
                                  Upload overrides the URL field.
                                </p>
                                <div className="md:col-span-2">
                                  <Button type="submit">Save Changes</Button>
                                </div>
                              </form>
                            </FormDialog>
                            <form action={deleteEntityAction}>
                              <input type="hidden" name="id" value={entity.id} />
                              <input type="hidden" name="client_id" value={selectedClientId} />
                              <ConfirmSubmitDialogButton
                                type="submit"
                                size="sm"
                                variant="destructive"
                                confirmTitle="Delete entity"
                                confirmDescription="Delete this entity?"
                                confirmText="Delete"
                              >
                                Delete
                              </ConfirmSubmitDialogButton>
                            </form>
                          </div>
                        </DataGridCell>
                      </DataGridRow>
                    ))}
                  </DataGridBody>
                </DataGridTable>
              </DataGrid>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
