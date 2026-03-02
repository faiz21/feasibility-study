import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader, StatCard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ConfirmSubmitDialogButton } from "@/components/ui/confirm-submit-dialog-button";
import { FormDialog } from "@/components/ui/form-dialog";
import { mvDefaultBrandPalette } from "@/lib/design-system/tokens";
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHead,
  DataGridRow,
  DataGridTable,
} from "@/components/ui/data-grid";

type SyncResult = { added: number; removed: number; generated: number };

type ClientColorPalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

type ClientRow = {
  id: string;
  name: string;
  code: string;
  domain: string | null;
  logo_url: string | null;
  cover_photo_url: string | null;
  color_palette: ClientColorPalette | null;
  default_locale: string;
  created_at: string;
};

type GranularityRow = { id: string; name: string; code: string };
type EntityRow = {
  id: string;
  client_id: string;
  granularity_id: string;
  name: string;
  description: string | null;
  photo_url: string | null;
  tags: string[] | null;
  created_at: string;
};
type ReportTypeRow = { id: string; name: string; category: string | null; granularity_id: string };
type ReportRow = { id: string; entity_id: string; report_type_template_id: string };

const DEFAULT_COLOR_PALETTE: ClientColorPalette = { ...mvDefaultBrandPalette };
const CLIENT_ASSET_BUCKET = process.env.NEXT_PUBLIC_CLIENT_ASSET_BUCKET ?? "client-assets";

function asColorValue(value: FormDataEntryValue | null, fallback: string): string {
  const raw = String(value ?? "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw;
  return fallback;
}

function paletteFromFormData(formData: FormData): ClientColorPalette {
  return {
    primary: asColorValue(formData.get("palette_primary"), DEFAULT_COLOR_PALETTE.primary),
    secondary: asColorValue(formData.get("palette_secondary"), DEFAULT_COLOR_PALETTE.secondary),
    accent: asColorValue(formData.get("palette_accent"), DEFAULT_COLOR_PALETTE.accent),
    background: asColorValue(formData.get("palette_background"), DEFAULT_COLOR_PALETTE.background),
    text: asColorValue(formData.get("palette_text"), DEFAULT_COLOR_PALETTE.text),
  };
}

function normalizePalette(input: unknown): ClientColorPalette {
  if (!input || typeof input !== "object" || Array.isArray(input)) return DEFAULT_COLOR_PALETTE;
  const palette = input as Record<string, unknown>;
  return {
    primary: typeof palette.primary === "string" ? palette.primary : DEFAULT_COLOR_PALETTE.primary,
    secondary: typeof palette.secondary === "string" ? palette.secondary : DEFAULT_COLOR_PALETTE.secondary,
    accent: typeof palette.accent === "string" ? palette.accent : DEFAULT_COLOR_PALETTE.accent,
    background: typeof palette.background === "string" ? palette.background : DEFAULT_COLOR_PALETTE.background,
    text: typeof palette.text === "string" ? palette.text : DEFAULT_COLOR_PALETTE.text,
  };
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function resolveAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return encodeURI(trimmed);
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  if (trimmed.startsWith("/storage/v1/object/public/")) {
    if (!base) return null;
    return encodeURI(`${base.replace(/\/$/, "")}${trimmed}`);
  }
  if (trimmed.startsWith("/")) return encodeURI(trimmed);
  if (!trimmed.includes("/")) return null;
  if (!base) return null;
  return encodeURI(`${base.replace(/\/$/, "")}/storage/v1/object/public/${trimmed.replace(/^\/+/, "")}`);
}

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

async function uploadClientImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fileValue: FormDataEntryValue | null,
  clientCode: string,
  kind: "logo" | "cover",
): Promise<string | null> {
  if (!(fileValue instanceof File) || fileValue.size <= 0) return null;
  if (!fileValue.type.startsWith("image/")) {
    throw new Error(`${kind} file must be an image`);
  }

  const safeCode = sanitizePathSegment(clientCode || "client");
  const ext = getExtension(fileValue.name, fileValue.type);
  const filePath = `clients/${safeCode}/${kind}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(CLIENT_ASSET_BUCKET).upload(filePath, fileValue, {
    upsert: true,
    contentType: fileValue.type || undefined,
  });
  if (error) throw new Error(error.message);

  return `${CLIENT_ASSET_BUCKET}/${filePath}`;
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

function pairKey(entityId: string, reportTypeId: string): string {
  return `${entityId}::${reportTypeId}`;
}

function computeSyncPreview(params: {
  clientId: string;
  entities: EntityRow[];
  accessIds: Set<string>;
  reportTypesById: Map<string, ReportTypeRow>;
  reportsByEntity: Map<string, ReportRow[]>;
  assignmentsByClient: Map<string, Set<string>>;
  reportById: Map<string, ReportRow>;
}): { addLabels: string[]; removeLabels: string[] } {
  const {
    clientId,
    entities,
    accessIds,
    reportTypesById,
    reportsByEntity,
    assignmentsByClient,
    reportById,
  } = params;

  const entityById = new Map(entities.map((entity) => [entity.id, entity]));
  const desired = new Map<string, string>();

  for (const entity of entities) {
    for (const reportTypeId of accessIds) {
      const reportType = reportTypesById.get(reportTypeId);
      if (!reportType) continue;
      if (reportType.granularity_id !== entity.granularity_id) continue;
      desired.set(pairKey(entity.id, reportType.id), `${entity.name} · ${reportType.name}`);
    }
  }

  const existingPairToReportId = new Map<string, string>();
  for (const entity of entities) {
    const reports = reportsByEntity.get(entity.id) ?? [];
    for (const report of reports) {
      const key = pairKey(report.entity_id, report.report_type_template_id);
      if (!existingPairToReportId.has(key)) {
        existingPairToReportId.set(key, report.id);
      }
    }
  }

  const assignedIds = assignmentsByClient.get(clientId) ?? new Set<string>();
  const addLabels: string[] = [];

  for (const [key, label] of desired) {
    const reportId = existingPairToReportId.get(key);
    if (!reportId || !assignedIds.has(reportId)) {
      addLabels.push(label);
    }
  }

  const removeLabels: string[] = [];
  for (const reportId of assignedIds) {
    const report = reportById.get(reportId);
    if (!report) continue;
    if (!entityById.has(report.entity_id)) continue;
    const key = pairKey(report.entity_id, report.report_type_template_id);
    if (desired.has(key)) continue;
    const entityName = entityById.get(report.entity_id)?.name ?? "Unknown Entity";
    const reportTypeName = reportTypesById.get(report.report_type_template_id)?.name ?? "Unknown Report Type";
    removeLabels.push(`${entityName} · ${reportTypeName}`);
  }

  return { addLabels, removeLabels };
}

async function syncClientReportAssignments(
  supabase: Awaited<ReturnType<typeof createClient>>,
  clientId: string,
): Promise<SyncResult> {
  const [{ data: entities, error: entitiesError }, { data: accessRows, error: accessError }, { data: reportTypes, error: reportTypesError }] =
    await Promise.all([
      supabase
        .from("report_entities")
        .select("id,client_id,granularity_id,name")
        .eq("client_id", clientId),
      supabase.from("client_report_type_access").select("report_type_template_id").eq("client_id", clientId),
      supabase.from("report_type_templates").select("id,name,granularity_id"),
    ]);

  if (entitiesError) throw new Error(entitiesError.message);
  if (accessError) throw new Error(accessError.message);
  if (reportTypesError) throw new Error(reportTypesError.message);

  const entityRows = (entities ?? []) as Array<{ id: string; granularity_id: string; name: string }>;
  const accessIds = new Set((accessRows ?? []).map((row) => row.report_type_template_id));
  const templateById = new Map(
    ((reportTypes ?? []) as Array<{ id: string; name: string; granularity_id: string }>).map((row) => [row.id, row]),
  );

  const desiredPairs = new Map<string, { entity_id: string; report_type_template_id: string; label: string }>();
  for (const entity of entityRows) {
    for (const reportTypeId of accessIds) {
      const reportType = templateById.get(reportTypeId);
      if (!reportType) continue;
      if (reportType.granularity_id !== entity.granularity_id) continue;
      desiredPairs.set(pairKey(entity.id, reportType.id), {
        entity_id: entity.id,
        report_type_template_id: reportType.id,
        label: `${entity.name} · ${reportType.name}`,
      });
    }
  }

  const entityIds = entityRows.map((entity) => entity.id);
  const accessIdList = Array.from(accessIds);
  const desiredPayload = Array.from(desiredPairs.values()).map((pair) => ({
    entity_id: pair.entity_id,
    report_type_template_id: pair.report_type_template_id,
  }));

  const [{ data: existingReports, error: existingReportsError }, { data: assignments, error: assignmentsError }] =
    await Promise.all([
      entityIds.length > 0 && accessIdList.length > 0
        ? supabase
            .from("reports")
            .select("id,entity_id,report_type_template_id")
            .in("entity_id", entityIds)
            .in("report_type_template_id", accessIdList)
        : Promise.resolve({ data: [], error: null }),
      supabase.from("client_reports").select("report_id").eq("client_id", clientId),
    ]);
  if (existingReportsError) throw new Error(existingReportsError.message);
  if (assignmentsError) throw new Error(assignmentsError.message);

  const existingDesiredKeys = new Set(
    ((existingReports ?? []) as ReportRow[]).map((report) => pairKey(report.entity_id, report.report_type_template_id)),
  );
  const generatedReports = Array.from(desiredPairs.keys()).filter((key) => !existingDesiredKeys.has(key)).length;

  if (desiredPayload.length > 0) {
    const { error: upsertReportError } = await supabase.from("reports").upsert(desiredPayload, {
      onConflict: "entity_id,report_type_template_id",
    });
    if (upsertReportError) {
      if (upsertReportError.code === "42P10") {
        throw new Error(
          "Missing unique constraint for reports upsert. Run migration 20260227_reports_entity_template_unique.sql",
        );
      }
      throw new Error(upsertReportError.message);
    }
  }

  const { data: desiredReports, error: desiredReportsError } =
    entityIds.length > 0 && accessIdList.length > 0
      ? await supabase
          .from("reports")
          .select("id,entity_id,report_type_template_id")
          .in("entity_id", entityIds)
          .in("report_type_template_id", accessIdList)
      : { data: [], error: null };
  if (desiredReportsError) throw new Error(desiredReportsError.message);

  const desiredReportIds = new Set(
    ((desiredReports ?? []) as ReportRow[])
      .filter((report) => desiredPairs.has(pairKey(report.entity_id, report.report_type_template_id)))
      .map((report) => report.id),
  );

  const assignedReportIds = new Set((assignments ?? []).map((assignment) => assignment.report_id));
  const toAdd = Array.from(desiredReportIds).filter((reportId) => !assignedReportIds.has(reportId));
  const assignedReportIdList = Array.from(assignedReportIds);
  const { data: assignedReportsForClient, error: assignedReportsError } =
    assignedReportIdList.length > 0
      ? await supabase
          .from("reports")
          .select("id,entity_id,report_type_template_id")
          .in("id", assignedReportIdList)
      : { data: [], error: null };
  if (assignedReportsError) throw new Error(assignedReportsError.message);

  const reportById = new Map<string, ReportRow>(
    ((assignedReportsForClient ?? []) as ReportRow[]).map((report) => [report.id, report]),
  );
  const entityIdSet = new Set(entityIds);
  const toRemove = Array.from(assignedReportIds).filter((reportId) => {
    const report = reportById.get(reportId);
    if (!report) return false;
    if (!entityIdSet.has(report.entity_id)) return false;
    return !desiredPairs.has(pairKey(report.entity_id, report.report_type_template_id));
  });

  if (toAdd.length > 0) {
    const insertPayload = toAdd.map((reportId) => ({ client_id: clientId, report_id: reportId }));
    const { error: addError } = await supabase.from("client_reports").insert(insertPayload);
    if (addError) throw new Error(addError.message);
  }

  if (toRemove.length > 0) {
    const { error: removeError } = await supabase
      .from("client_reports")
      .delete()
      .eq("client_id", clientId)
      .in("report_id", toRemove);
    if (removeError) throw new Error(removeError.message);
  }

  return { added: toAdd.length, removed: toRemove.length, generated: generatedReports };
}

export async function createClientAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const domainRaw = String(formData.get("domain") ?? "").trim();
  const domain = domainRaw.length > 0 ? domainRaw.toLowerCase() : null;
  const logoUrlRaw = String(formData.get("logo_url") ?? "").trim();
  const coverPhotoUrlRaw = String(formData.get("cover_photo_url") ?? "").trim();
  let logoUrl = logoUrlRaw.length > 0 ? logoUrlRaw : null;
  let coverPhotoUrl = coverPhotoUrlRaw.length > 0 ? coverPhotoUrlRaw : null;
  const colorPalette = paletteFromFormData(formData);
  const defaultLocale = String(formData.get("default_locale") ?? "en");

  if (!name || !code) {
    redirect("/admin/clients?error=Name+and+code+are+required");
  }

  try {
    const uploadedLogoPath = await uploadClientImage(supabase, formData.get("logo_file"), code, "logo");
    if (uploadedLogoPath) logoUrl = uploadedLogoPath;
    const uploadedCoverPath = await uploadClientImage(supabase, formData.get("cover_photo_file"), code, "cover");
    if (uploadedCoverPath) coverPhotoUrl = uploadedCoverPath;
  } catch (error) {
    redirect(`/admin/clients?error=${encodeURIComponent((error as Error).message)}`);
  }

  const { error } = await supabase.from("clients").insert({
    name,
    code,
    domain,
    logo_url: logoUrl,
    cover_photo_url: coverPhotoUrl,
    color_palette: colorPalette,
    default_locale: defaultLocale,
  });

  if (error) {
    redirect(`/admin/clients?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/clients");
  redirect("/admin/clients?success=Client+created");
}

export async function updateClientAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const domainRaw = String(formData.get("domain") ?? "").trim();
  const domain = domainRaw.length > 0 ? domainRaw.toLowerCase() : null;
  const logoUrlRaw = String(formData.get("logo_url") ?? "").trim();
  const coverPhotoUrlRaw = String(formData.get("cover_photo_url") ?? "").trim();
  let logoUrl = logoUrlRaw.length > 0 ? logoUrlRaw : null;
  let coverPhotoUrl = coverPhotoUrlRaw.length > 0 ? coverPhotoUrlRaw : null;
  const colorPalette = paletteFromFormData(formData);
  const defaultLocale = String(formData.get("default_locale") ?? "en");

  if (!id || !name || !code) {
    redirect("/admin/clients?error=Missing+required+fields");
  }

  try {
    const uploadedLogoPath = await uploadClientImage(supabase, formData.get("logo_file"), code, "logo");
    if (uploadedLogoPath) logoUrl = uploadedLogoPath;
    const uploadedCoverPath = await uploadClientImage(supabase, formData.get("cover_photo_file"), code, "cover");
    if (uploadedCoverPath) coverPhotoUrl = uploadedCoverPath;
  } catch (error) {
    redirect(`/admin/clients?error=${encodeURIComponent((error as Error).message)}`);
  }

  const { error } = await supabase
    .from("clients")
    .update({
      name,
      code,
      domain,
      logo_url: logoUrl,
      cover_photo_url: coverPhotoUrl,
      color_palette: colorPalette,
      default_locale: defaultLocale,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/clients?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/clients");
  redirect("/admin/clients?success=Client+updated");
}

export async function deleteClientAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin/clients?error=Missing+client+id");
  }

  const { count: assignedCount } = await supabase
    .from("client_reports")
    .select("report_id", { count: "exact", head: true })
    .eq("client_id", id);

  if ((assignedCount ?? 0) > 0) {
    redirect("/admin/clients?error=This+client+has+assigned+reports.+Unassign+before+deletion");
  }

  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) {
    redirect(`/admin/clients?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/clients");
  redirect("/admin/clients?success=Client+deleted");
}

export async function saveClientGranularityAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "").trim();
  const selectedGranularityIds = formData
    .getAll("granularity_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (!clientId) {
    redirect("/admin/clients?error=Missing+client+id");
  }

  const { error: deleteError } = await supabase
    .from("client_granularity_access")
    .delete()
    .eq("client_id", clientId);
  if (deleteError) {
    redirect(`/admin/clients?error=${encodeURIComponent(deleteError.message)}`);
  }

  if (selectedGranularityIds.length > 0) {
    const payload = selectedGranularityIds.map((granularityId) => ({
      client_id: clientId,
      granularity_id: granularityId,
    }));
    const { error: insertError } = await supabase.from("client_granularity_access").insert(payload);
    if (insertError) {
      redirect(`/admin/clients?error=${encodeURIComponent(insertError.message)}`);
    }
  }

  try {
    const result = await syncClientReportAssignments(supabase, clientId);
    revalidatePath("/admin/clients");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/client-reports");
    redirect(
      `/admin/clients?success=${encodeURIComponent(
        `Client granularity updated. Generated ${result.generated} reports, assignments (+${result.added}, -${result.removed})`,
      )}`,
    );
  } catch (error) {
    redirect(`/admin/clients?error=${encodeURIComponent((error as Error).message)}`);
  }
}

export async function saveClientAccessAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "").trim();
  const selectedReportTypeIds = formData
    .getAll("report_type_template_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (!clientId) {
    redirect("/admin/clients?error=Missing+client+id");
  }

  const { data: allowedGranularityRows, error: allowedGranularityError } = await supabase
    .from("client_granularity_access")
    .select("granularity_id")
    .eq("client_id", clientId);
  if (allowedGranularityError) {
    redirect(`/admin/clients?error=${encodeURIComponent(allowedGranularityError.message)}`);
  }

  const allowedGranularityIds = new Set((allowedGranularityRows ?? []).map((row) => row.granularity_id));
  if (selectedReportTypeIds.length > 0 && allowedGranularityIds.size === 0) {
    redirect("/admin/clients?error=Configure+client+granularity+before+setting+report+access");
  }

  if (selectedReportTypeIds.length > 0) {
    const { data: selectedTypes, error: selectedTypesError } = await supabase
      .from("report_type_templates")
      .select("id,granularity_id")
      .in("id", selectedReportTypeIds);
    if (selectedTypesError) {
      redirect(`/admin/clients?error=${encodeURIComponent(selectedTypesError.message)}`);
    }

    const hasInvalidGranularity = (selectedTypes ?? []).some(
      (template) => !allowedGranularityIds.has(template.granularity_id),
    );
    const hasUnknownTemplate = (selectedTypes ?? []).length !== selectedReportTypeIds.length;

    if (hasInvalidGranularity || hasUnknownTemplate) {
      redirect("/admin/clients?error=Some+selected+report+types+do+not+match+client+granularity+configuration");
    }
  }

  const { error: deleteError } = await supabase
    .from("client_report_type_access")
    .delete()
    .eq("client_id", clientId);
  if (deleteError) {
    redirect(`/admin/clients?error=${encodeURIComponent(deleteError.message)}`);
  }

  if (selectedReportTypeIds.length > 0) {
    const payload = selectedReportTypeIds.map((reportTypeId) => ({
      client_id: clientId,
      report_type_template_id: reportTypeId,
    }));
    const { error: insertError } = await supabase.from("client_report_type_access").insert(payload);
    if (insertError) {
      redirect(`/admin/clients?error=${encodeURIComponent(insertError.message)}`);
    }
  }

  try {
    const result = await syncClientReportAssignments(supabase, clientId);
    revalidatePath("/admin/clients");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/client-reports");
    redirect(
      `/admin/clients?success=${encodeURIComponent(
        `Client access updated. Generated ${result.generated} reports, assignments (+${result.added}, -${result.removed})`,
      )}`,
    );
  } catch (error) {
    redirect(`/admin/clients?error=${encodeURIComponent((error as Error).message)}`);
  }
}

export async function createClientEntityAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const photoUrl = String(formData.get("photo_url") ?? "").trim();
  const tags = parseTags(String(formData.get("tags_csv") ?? ""));

  if (!clientId || !granularityId || !name) {
    redirect("/admin/clients?error=Missing+required+entity+fields");
  }

  const { data: allowed } = await supabase
    .from("client_granularity_access")
    .select("id")
    .eq("client_id", clientId)
    .eq("granularity_id", granularityId)
    .maybeSingle();
  if (!allowed) {
    redirect("/admin/clients?error=Selected+granularity+is+not+enabled+for+this+client");
  }

  const { error } = await supabase.from("report_entities").insert({
    client_id: clientId,
    granularity_id: granularityId,
    name,
    description: description || null,
    photo_url: photoUrl || null,
    tags,
  });
  if (error) redirect(`/admin/clients?error=${encodeURIComponent(error.message)}`);

  try {
    const result = await syncClientReportAssignments(supabase, clientId);
    revalidatePath("/admin/clients");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/client-reports");
    redirect(
      `/admin/clients?success=${encodeURIComponent(
        `Entity created. Generated ${result.generated} reports, assignments (+${result.added}, -${result.removed})`,
      )}`,
    );
  } catch (syncError) {
    redirect(`/admin/clients?error=${encodeURIComponent((syncError as Error).message)}`);
  }
}

export async function updateClientEntityAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const photoUrl = String(formData.get("photo_url") ?? "").trim();
  const tags = parseTags(String(formData.get("tags_csv") ?? ""));

  if (!id || !clientId || !granularityId || !name) {
    redirect("/admin/clients?error=Missing+required+entity+fields");
  }

  const { data: allowed } = await supabase
    .from("client_granularity_access")
    .select("id")
    .eq("client_id", clientId)
    .eq("granularity_id", granularityId)
    .maybeSingle();
  if (!allowed) {
    redirect("/admin/clients?error=Selected+granularity+is+not+enabled+for+this+client");
  }

  const { error } = await supabase
    .from("report_entities")
    .update({
      granularity_id: granularityId,
      name,
      description: description || null,
      photo_url: photoUrl || null,
      tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("client_id", clientId);
  if (error) redirect(`/admin/clients?error=${encodeURIComponent(error.message)}`);

  try {
    const result = await syncClientReportAssignments(supabase, clientId);
    revalidatePath("/admin/clients");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/client-reports");
    redirect(
      `/admin/clients?success=${encodeURIComponent(
        `Entity updated. Generated ${result.generated} reports, assignments (+${result.added}, -${result.removed})`,
      )}`,
    );
  } catch (syncError) {
    redirect(`/admin/clients?error=${encodeURIComponent((syncError as Error).message)}`);
  }
}

export async function deleteClientEntityAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  if (!id || !clientId) redirect("/admin/clients?error=Missing+entity+id");

  const { error } = await supabase.from("report_entities").delete().eq("id", id).eq("client_id", clientId);
  if (error) redirect(`/admin/clients?error=${encodeURIComponent(error.message)}`);

  try {
    const result = await syncClientReportAssignments(supabase, clientId);
    revalidatePath("/admin/clients");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/client-reports");
    redirect(
      `/admin/clients?success=${encodeURIComponent(
        `Entity deleted. Generated ${result.generated} reports, assignments (+${result.added}, -${result.removed})`,
      )}`,
    );
  } catch (syncError) {
    redirect(`/admin/clients?error=${encodeURIComponent((syncError as Error).message)}`);
  }
}

export async function importClientEntitiesCsvAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "").trim();
  const file = formData.get("entities_csv");
  if (!clientId) redirect("/admin/clients?error=Missing+client+id");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/clients?error=Please+upload+a+CSV+file");
  }

  const { data: allowedGranularityRows, error: granularityError } = await supabase
    .from("client_granularity_access")
    .select("granularity:granularity_id(id,name,code)")
    .eq("client_id", clientId);
  if (granularityError) redirect(`/admin/clients?error=${encodeURIComponent(granularityError.message)}`);

  const allowedGranularities = (allowedGranularityRows ?? [])
    .map((row) => row.granularity)
    .filter((granularity): granularity is { id: string; name: string; code: string } => Boolean(granularity));
  if (allowedGranularities.length === 0) {
    redirect("/admin/clients?error=Enable+client+granularity+before+importing+entities");
  }

  const granularityById = new Map(allowedGranularities.map((row) => [row.id, row.id]));
  const granularityByCode = new Map(allowedGranularities.map((row) => [row.code.toLowerCase(), row.id]));
  const granularityByName = new Map(allowedGranularities.map((row) => [row.name.toLowerCase(), row.id]));

  const rows = parseCsvRows(await file.text());
  if (rows.length === 0) {
    redirect("/admin/clients?error=CSV+must+have+header+and+at+least+1+row");
  }

  const payload: Array<{
    client_id: string;
    granularity_id: string;
    name: string;
    description: string | null;
    photo_url: string | null;
    tags: string[];
  }> = [];
  const errors: string[] = [];

  rows.forEach((row, index) => {
    const lineNo = index + 2;
    const name = String(row.name ?? "").trim();
    const granularityToken = String(
      row.granularity_id ?? row.granularity_code ?? row.granularity_name ?? row.granularity ?? "",
    ).trim();
    const description = String(row.description ?? "").trim();
    const photoUrl = String(row.photo_url ?? "").trim();
    const tags = parseCsvTags(String(row.tags ?? "").trim());

    if (!name) {
      errors.push(`Row ${lineNo}: name is required`);
      return;
    }

    const resolvedGranularityId =
      granularityById.get(granularityToken) ??
      granularityByCode.get(granularityToken.toLowerCase()) ??
      granularityByName.get(granularityToken.toLowerCase()) ??
      (allowedGranularities.length === 1 ? allowedGranularities[0].id : undefined);

    if (!resolvedGranularityId) {
      errors.push(`Row ${lineNo}: invalid or missing granularity`);
      return;
    }

    payload.push({
      client_id: clientId,
      granularity_id: resolvedGranularityId,
      name,
      description: description || null,
      photo_url: photoUrl || null,
      tags,
    });
  });

  if (errors.length > 0) {
    redirect(`/admin/clients?error=${encodeURIComponent(errors.slice(0, 5).join("; "))}`);
  }

  const { error } = await supabase.from("report_entities").insert(payload);
  if (error) redirect(`/admin/clients?error=${encodeURIComponent(error.message)}`);

  try {
    const result = await syncClientReportAssignments(supabase, clientId);
    revalidatePath("/admin/clients");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/client-reports");
    redirect(
      `/admin/clients?success=${encodeURIComponent(
        `Imported ${payload.length} entities. Generated ${result.generated} reports, assignments (+${result.added}, -${result.removed})`,
      )}`,
    );
  } catch (syncError) {
    redirect(`/admin/clients?error=${encodeURIComponent((syncError as Error).message)}`);
  }
}

export async function syncClientReportsAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "").trim();
  if (!clientId) redirect("/admin/clients?error=Missing+client+id");

  try {
    const result = await syncClientReportAssignments(supabase, clientId);
    revalidatePath("/admin/clients");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/client-reports");
    redirect(
      `/admin/clients?success=${encodeURIComponent(
        `Reports synced. Generated ${result.generated}, assignments (+${result.added}, -${result.removed})`,
      )}`,
    );
  } catch (error) {
    redirect(`/admin/clients?error=${encodeURIComponent((error as Error).message)}`);
  }
}

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    locale?: string;
    sort?: "newest" | "oldest";
    success?: string;
    error?: string;
  }>;
}) {
  await requireRole("admin");
  const supabase = await createClient();
  const params = await searchParams;
  const queryText = (params.q ?? "").trim();
  const localeFilter = (params.locale ?? "all").trim();
  const sortDirection = params.sort === "oldest";

  let query = supabase
    .from("clients")
    .select("id,name,code,domain,logo_url,cover_photo_url,color_palette,default_locale,created_at")
    .order("created_at", { ascending: sortDirection });

  if (queryText) {
    query = query.or(`name.ilike.%${queryText}%,code.ilike.%${queryText}%,domain.ilike.%${queryText}%`);
  }
  if (localeFilter !== "all") {
    query = query.eq("default_locale", localeFilter);
  }

  const [
    { data: clients },
    { data: accessRows },
    { data: assignmentRows },
    { data: granularities },
    { data: reportTypesRaw },
    { data: granularityAccessRows },
    { data: entitiesRaw },
    { data: reportsRaw },
  ] = await Promise.all([
    query,
    supabase.from("client_report_type_access").select("client_id,report_type_template_id"),
    supabase.from("client_reports").select("client_id,report_id"),
    supabase.from("granularities").select("id,name,code").order("name", { ascending: true }),
    supabase.from("report_type_templates").select("id,name,category,granularity_id,granularities(name)").order("name", { ascending: true }),
    supabase.from("client_granularity_access").select("client_id,granularity_id"),
    supabase
      .from("report_entities")
      .select("id,client_id,granularity_id,name,description,photo_url,tags,created_at")
      .order("created_at", { ascending: false }),
    supabase.from("reports").select("id,entity_id,report_type_template_id"),
  ]);

  const clientRows = ((clients ?? []) as ClientRow[]).map((client) => ({
    ...client,
    color_palette: normalizePalette(client.color_palette),
  }));
  const granularityRows = (granularities ?? []) as GranularityRow[];
  const entityRows = (entitiesRaw ?? []) as EntityRow[];
  const reportRows = (reportsRaw ?? []) as ReportRow[];
  const reportTypes = ((reportTypesRaw ?? []) as Array<{
    id: string;
    name: string;
    category: string | null;
    granularity_id: string;
    granularities?: { name?: string } | Array<{ name?: string }>;
  }>).map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    granularity_id: row.granularity_id,
    granularity_name: Array.isArray(row.granularities) ? row.granularities[0]?.name : row.granularities?.name,
  }));

  const accessCountByClient = new Map<string, number>();
  const accessIdsByClient = new Map<string, Set<string>>();
  (accessRows ?? []).forEach((row) => {
    accessCountByClient.set(row.client_id, (accessCountByClient.get(row.client_id) ?? 0) + 1);
    const existing = accessIdsByClient.get(row.client_id) ?? new Set<string>();
    existing.add(row.report_type_template_id);
    accessIdsByClient.set(row.client_id, existing);
  });

  const granularityIdsByClient = new Map<string, Set<string>>();
  (granularityAccessRows ?? []).forEach((row) => {
    const existing = granularityIdsByClient.get(row.client_id) ?? new Set<string>();
    existing.add(row.granularity_id);
    granularityIdsByClient.set(row.client_id, existing);
  });

  const assignmentCountByClient = new Map<string, number>();
  const assignmentsByClient = new Map<string, Set<string>>();
  (assignmentRows ?? []).forEach((row) => {
    assignmentCountByClient.set(row.client_id, (assignmentCountByClient.get(row.client_id) ?? 0) + 1);
    const existing = assignmentsByClient.get(row.client_id) ?? new Set<string>();
    existing.add(row.report_id);
    assignmentsByClient.set(row.client_id, existing);
  });

  const entitiesByClient = new Map<string, EntityRow[]>();
  entityRows.forEach((entity) => {
    const existing = entitiesByClient.get(entity.client_id) ?? [];
    existing.push(entity);
    entitiesByClient.set(entity.client_id, existing);
  });

  const reportsByEntity = new Map<string, ReportRow[]>();
  const reportById = new Map<string, ReportRow>();
  reportRows.forEach((report) => {
    reportById.set(report.id, report);
    const existing = reportsByEntity.get(report.entity_id) ?? [];
    existing.push(report);
    reportsByEntity.set(report.entity_id, existing);
  });

  const reportTypesById = new Map(reportTypes.map((type) => [type.id, type]));
  const granularityById = new Map(granularityRows.map((granularity) => [granularity.id, granularity]));

  return (
    <div className="space-y-6">
      <PageHeader title="Clients" description="Manage clients, granularities, template access, entities, and auto report sync." />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Clients" value={clientRows.length} />
        <StatCard label="Entities" value={entityRows.length} />
        <StatCard label="Reports" value={reportRows.length} />
        <StatCard label="Assignments" value={assignmentRows?.length ?? 0} />
      </section>

      <div className="flex justify-end">
        <FormDialog
          title="Create Client"
          description="Add a new client tenant with code, domain, branding, and default locale."
          triggerLabel="Create Client"
          triggerVariant="default"
        >
          <form action={createClientAction} className="grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              Name
              <Input className="mt-1" name="name" required placeholder="PT Machine Vision" />
            </label>
            <label className="text-sm">
              Code
              <Input className="mt-1" name="code" required placeholder="mv-main" />
            </label>
            <label className="text-sm">
              Domain
              <Input className="mt-1" name="domain" placeholder="client.company.com" />
            </label>
            <label className="text-sm md:col-span-2">
              Logo URL
              <Input className="mt-1" name="logo_url" type="url" placeholder="https://cdn.example.com/client-logo.png" />
            </label>
            <label className="text-sm md:col-span-2">
              Upload Logo
              <Input className="mt-1" name="logo_file" type="file" accept="image/*" />
            </label>
            <label className="text-sm md:col-span-2">
              Cover Photo URL
              <Input className="mt-1" name="cover_photo_url" type="url" placeholder="https://cdn.example.com/client-cover.jpg" />
            </label>
            <label className="text-sm md:col-span-2">
              Upload Cover Photo
              <Input className="mt-1" name="cover_photo_file" type="file" accept="image/*" />
            </label>
            <label className="text-sm">
              Default Locale
              <select
                name="default_locale"
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
                defaultValue="en"
              >
                <option value="en">en</option>
                <option value="id">id</option>
                <option value="ja">ja</option>
              </select>
            </label>
            <div className="space-y-2 md:col-span-2">
              <p className="text-sm font-medium">Color Palette</p>
              <div className="grid gap-3 md:grid-cols-5">
                <label className="text-xs">
                  Primary
                  <input className="mt-1 h-10 w-full rounded-lg border border-input bg-card p-1" type="color" name="palette_primary" defaultValue={DEFAULT_COLOR_PALETTE.primary} />
                </label>
                <label className="text-xs">
                  Secondary
                  <input className="mt-1 h-10 w-full rounded-lg border border-input bg-card p-1" type="color" name="palette_secondary" defaultValue={DEFAULT_COLOR_PALETTE.secondary} />
                </label>
                <label className="text-xs">
                  Accent
                  <input className="mt-1 h-10 w-full rounded-lg border border-input bg-card p-1" type="color" name="palette_accent" defaultValue={DEFAULT_COLOR_PALETTE.accent} />
                </label>
                <label className="text-xs">
                  Background
                  <input className="mt-1 h-10 w-full rounded-lg border border-input bg-card p-1" type="color" name="palette_background" defaultValue={DEFAULT_COLOR_PALETTE.background} />
                </label>
                <label className="text-xs">
                  Text
                  <input className="mt-1 h-10 w-full rounded-lg border border-input bg-card p-1" type="color" name="palette_text" defaultValue={DEFAULT_COLOR_PALETTE.text} />
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Save Client</Button>
            </div>
          </form>
        </FormDialog>
      </div>

      {params.success ? (
        <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">{params.success}</p>
      ) : null}
      {params.error ? (
        <p className="rounded-lg border border-critical/30 bg-critical/10 px-3 py-2 text-sm text-critical">{params.error}</p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-3 md:grid-cols-4">
            <label className="text-sm md:col-span-2">
              Search
              <Input className="mt-1" name="q" defaultValue={queryText} placeholder="name, code, domain" />
            </label>
            <label className="text-sm">
              Locale
              <select
                name="locale"
                defaultValue={localeFilter}
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="all">All</option>
                <option value="en">en</option>
                <option value="id">id</option>
                <option value="ja">ja</option>
              </select>
            </label>
            <label className="text-sm">
              Sort
              <select
                name="sort"
                defaultValue={params.sort ?? "newest"}
                className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
            <div className="md:col-span-4">
              <Button type="submit" variant="secondary">
                Apply Filters
              </Button>
            </div>
          </form>

          {clientRows.length === 0 ? <p className="text-sm text-muted-foreground">Create your first client.</p> : null}

          <DataGrid>
            <DataGridTable>
              <DataGridHead>
                <DataGridRow className="border-t-0">
                  <DataGridCell header>Name</DataGridCell>
                  <DataGridCell header>Code</DataGridCell>
                  <DataGridCell header>Locale</DataGridCell>
                  <DataGridCell header>Branding</DataGridCell>
                  <DataGridCell header>Entities</DataGridCell>
                  <DataGridCell header>Templates</DataGridCell>
                  <DataGridCell header>Reports</DataGridCell>
                  <DataGridCell header>Sync (+/-)</DataGridCell>
                  <DataGridCell header className="text-right">
                    Actions
                  </DataGridCell>
                </DataGridRow>
              </DataGridHead>
              <DataGridBody>
                {clientRows.map((client) => {
                  const clientEntities = entitiesByClient.get(client.id) ?? [];
                  const accessIds = accessIdsByClient.get(client.id) ?? new Set<string>();
                  const allowedGranularityIds = granularityIdsByClient.get(client.id) ?? new Set<string>();
                  const syncPreview = computeSyncPreview({
                    clientId: client.id,
                    entities: clientEntities,
                    accessIds,
                    reportTypesById,
                    reportsByEntity,
                    assignmentsByClient,
                    reportById,
                  });

                  return (
                    <DataGridRow key={client.id}>
                      <DataGridCell className="font-medium">{client.name}</DataGridCell>
                      <DataGridCell className="text-muted-foreground">{client.code}</DataGridCell>
                      <DataGridCell className="text-muted-foreground">{client.default_locale}</DataGridCell>
                      <DataGridCell>
                        <div className="flex items-center gap-2">
                          {client.logo_url ? (
                            <Image
                              src={resolveAssetUrl(client.logo_url) ?? client.logo_url}
                              alt={`${client.name} logo`}
                              className="h-6 w-6 rounded object-contain"
                              width={24}
                              height={24}
                              unoptimized
                            />
                          ) : (
                            <div className="h-6 w-6 rounded border border-dashed border-border/70" />
                          )}
                          <div className="flex gap-1">
                            {Object.values(normalizePalette(client.color_palette)).map((hex, index) => (
                              <span
                                key={`${client.id}-${index}`}
                                className="h-4 w-4 rounded border border-border/70"
                                style={{ backgroundColor: hex }}
                                title={hex}
                              />
                            ))}
                          </div>
                        </div>
                      </DataGridCell>
                      <DataGridCell className="text-muted-foreground">{clientEntities.length}</DataGridCell>
                      <DataGridCell className="text-muted-foreground">{accessCountByClient.get(client.id) ?? 0}</DataGridCell>
                      <DataGridCell className="text-muted-foreground">{assignmentCountByClient.get(client.id) ?? 0}</DataGridCell>
                      <DataGridCell>
                        <div className="text-xs">
                          <span className="text-success">+{syncPreview.addLabels.length}</span>
                          <span className="mx-1 text-muted-foreground">/</span>
                          <span className="text-critical">-{syncPreview.removeLabels.length}</span>
                        </div>
                      </DataGridCell>
                      <DataGridCell>
                        <div className="flex flex-wrap justify-end gap-2">
                          <FormDialog title="Edit Client" description="Update client details." triggerLabel="Edit">
                            <form action={updateClientAction} className="grid gap-3 md:grid-cols-2">
                              <input type="hidden" name="id" value={client.id} />
                              <label className="text-sm">
                                Name
                                <Input className="mt-1" name="name" defaultValue={client.name} required />
                              </label>
                              <label className="text-sm">
                                Code
                                <Input className="mt-1" name="code" defaultValue={client.code} required />
                              </label>
                              <label className="text-sm">
                                Domain
                                <Input className="mt-1" name="domain" defaultValue={client.domain ?? ""} />
                              </label>
                              <label className="text-sm md:col-span-2">
                                Logo URL
                                <Input className="mt-1" name="logo_url" type="url" defaultValue={client.logo_url ?? ""} />
                              </label>
                              <label className="text-sm md:col-span-2">
                                Upload Logo
                                <Input className="mt-1" name="logo_file" type="file" accept="image/*" />
                              </label>
                              <label className="text-sm md:col-span-2">
                                Cover Photo URL
                                <Input className="mt-1" name="cover_photo_url" type="url" defaultValue={client.cover_photo_url ?? ""} />
                              </label>
                              <label className="text-sm md:col-span-2">
                                Upload Cover Photo
                                <Input className="mt-1" name="cover_photo_file" type="file" accept="image/*" />
                              </label>
                              <label className="text-sm">
                                Default Locale
                                <select
                                  name="default_locale"
                                  defaultValue={client.default_locale}
                                  className="mt-1 block h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
                                >
                                  <option value="en">en</option>
                                  <option value="id">id</option>
                                  <option value="ja">ja</option>
                                </select>
                              </label>
                              <div className="space-y-2 md:col-span-2">
                                <p className="text-sm font-medium">Color Palette</p>
                                <div className="grid gap-3 md:grid-cols-5">
                                  <label className="text-xs">
                                    Primary
                                    <input
                                      className="mt-1 h-10 w-full rounded-lg border border-input bg-card p-1"
                                      type="color"
                                      name="palette_primary"
                                      defaultValue={normalizePalette(client.color_palette).primary}
                                    />
                                  </label>
                                  <label className="text-xs">
                                    Secondary
                                    <input
                                      className="mt-1 h-10 w-full rounded-lg border border-input bg-card p-1"
                                      type="color"
                                      name="palette_secondary"
                                      defaultValue={normalizePalette(client.color_palette).secondary}
                                    />
                                  </label>
                                  <label className="text-xs">
                                    Accent
                                    <input
                                      className="mt-1 h-10 w-full rounded-lg border border-input bg-card p-1"
                                      type="color"
                                      name="palette_accent"
                                      defaultValue={normalizePalette(client.color_palette).accent}
                                    />
                                  </label>
                                  <label className="text-xs">
                                    Background
                                    <input
                                      className="mt-1 h-10 w-full rounded-lg border border-input bg-card p-1"
                                      type="color"
                                      name="palette_background"
                                      defaultValue={normalizePalette(client.color_palette).background}
                                    />
                                  </label>
                                  <label className="text-xs">
                                    Text
                                    <input
                                      className="mt-1 h-10 w-full rounded-lg border border-input bg-card p-1"
                                      type="color"
                                      name="palette_text"
                                      defaultValue={normalizePalette(client.color_palette).text}
                                    />
                                  </label>
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <Button type="submit">Save Changes</Button>
                              </div>
                            </form>
                          </FormDialog>

                          <FormDialog
                            title="Manage Client Granularity"
                            description="Choose granularities enabled for this client."
                            triggerLabel="Granularity"
                          >
                            <form action={saveClientGranularityAction} className="space-y-3">
                              <input type="hidden" name="client_id" value={client.id} />
                              <div className="grid gap-2 md:grid-cols-2">
                                {granularityRows.map((granularity) => (
                                  <label
                                    key={granularity.id}
                                    className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 text-sm"
                                  >
                                    <input
                                      type="checkbox"
                                      name="granularity_ids"
                                      value={granularity.id}
                                      defaultChecked={allowedGranularityIds.has(granularity.id)}
                                    />
                                    <span>
                                      {granularity.name}{" "}
                                      <span className="text-xs text-muted-foreground">({granularity.code})</span>
                                    </span>
                                  </label>
                                ))}
                              </div>
                              <Button type="submit">Save Granularity</Button>
                            </form>
                          </FormDialog>

                          <FormDialog
                            title="Manage Client Access"
                            description="Choose report type templates this client can access."
                            triggerLabel="Access"
                          >
                            <form action={saveClientAccessAction} className="space-y-3">
                              <input type="hidden" name="client_id" value={client.id} />
                              {allowedGranularityIds.size === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  Enable client granularities first to configure report access.
                                </p>
                              ) : (
                                <div className="grid gap-2 md:grid-cols-2">
                                  {reportTypes
                                    .filter((reportType) => allowedGranularityIds.has(reportType.granularity_id))
                                    .map((reportType) => (
                                      <label
                                        key={reportType.id}
                                        className="flex items-start gap-2 rounded-md border border-border/70 px-3 py-2 text-sm"
                                      >
                                        <input
                                          type="checkbox"
                                          name="report_type_template_ids"
                                          value={reportType.id}
                                          defaultChecked={accessIds.has(reportType.id)}
                                          className="mt-0.5"
                                        />
                                        <span>
                                          <span className="block">{reportType.name}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {reportType.category ?? "-"} | {reportType.granularity_name ?? "-"}
                                          </span>
                                        </span>
                                      </label>
                                    ))}
                                </div>
                              )}
                              <Button type="submit">Save Access</Button>
                            </form>
                          </FormDialog>

                          <FormDialog
                            title="Manage Client Entities"
                            description="Create and maintain entities for this client."
                            triggerLabel="Entities"
                          >
                            <div className="space-y-4">
                              {allowedGranularityIds.size === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  Enable client granularity first before adding entities.
                                </p>
                              ) : (
                                <>
                                  <form action={importClientEntitiesCsvAction} className="grid gap-3" encType="multipart/form-data">
                                    <input type="hidden" name="client_id" value={client.id} />
                                    <label className="text-sm">
                                      Import Entities CSV
                                      <Input name="entities_csv" type="file" accept=".csv,text/csv" required className="mt-1" />
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                      Required: <code>name</code> and one of{" "}
                                      <code>granularity_id | granularity_code | granularity_name | granularity</code>.
                                      Optional: <code>description</code>, <code>photo_url</code>, <code>tags</code>{" "}
                                      (<code>|</code> separator).
                                    </p>
                                    <div>
                                      <Button type="submit" variant="secondary">Import CSV</Button>
                                    </div>
                                  </form>
                                  <div className="space-y-3">
                                    {Array.from(allowedGranularityIds)
                                      .map((granularityId) => granularityById.get(granularityId))
                                      .filter((granularity): granularity is GranularityRow => Boolean(granularity))
                                      .map((granularity) => {
                                        const entityRowsByGranularity = clientEntities.filter(
                                          (entity) => entity.granularity_id === granularity.id,
                                        );
                                        return (
                                          <div key={granularity.id} className="rounded-md border border-border/70 p-3">
                                            <div className="mb-3 flex items-center justify-between gap-2">
                                              <div>
                                                <p className="text-sm font-medium">{granularity.name}</p>
                                                <p className="text-xs text-muted-foreground">{granularity.code}</p>
                                              </div>
                                              <FormDialog
                                                title={`Add Entity — ${granularity.name}`}
                                                description="Create an entity under this granularity."
                                                triggerLabel="Add Entity"
                                              >
                                                <form action={createClientEntityAction} className="grid gap-3 md:grid-cols-2">
                                                  <input type="hidden" name="client_id" value={client.id} />
                                                  <input type="hidden" name="granularity_id" value={granularity.id} />
                                                  <label className="text-sm md:col-span-2">
                                                    Name
                                                    <Input name="name" required className="mt-1" />
                                                  </label>
                                                  <label className="text-sm md:col-span-2">
                                                    Description
                                                    <Input name="description" className="mt-1" />
                                                  </label>
                                                  <label className="text-sm">
                                                    Photo URL
                                                    <Input name="photo_url" className="mt-1" />
                                                  </label>
                                                  <label className="text-sm">
                                                    Tags (comma-separated)
                                                    <Input name="tags_csv" className="mt-1" />
                                                  </label>
                                                  <div className="md:col-span-2">
                                                    <Button type="submit">Create Entity</Button>
                                                  </div>
                                                </form>
                                              </FormDialog>
                                            </div>
                                            {entityRowsByGranularity.length === 0 ? (
                                              <p className="text-xs text-muted-foreground">No entities in this granularity.</p>
                                            ) : (
                                              <div className="space-y-2">
                                                {entityRowsByGranularity.map((entity) => (
                                                  <div
                                                    key={entity.id}
                                                    className="flex items-center justify-between gap-3 rounded-md border border-border/70 px-3 py-2"
                                                  >
                                                    <div>
                                                      <p className="text-sm font-medium">{entity.name}</p>
                                                      <p className="text-xs text-muted-foreground">
                                                        {Array.isArray(entity.tags) ? entity.tags.join(", ") : "-"}
                                                      </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                      <FormDialog
                                                        title="Edit Entity"
                                                        description="Update entity details."
                                                        triggerLabel="Edit"
                                                      >
                                                        <form action={updateClientEntityAction} className="grid gap-3 md:grid-cols-2">
                                                          <input type="hidden" name="id" value={entity.id} />
                                                          <input type="hidden" name="client_id" value={client.id} />
                                                          <input type="hidden" name="granularity_id" value={granularity.id} />
                                                          <label className="text-sm md:col-span-2">
                                                            Name
                                                            <Input name="name" defaultValue={entity.name} required className="mt-1" />
                                                          </label>
                                                          <label className="text-sm md:col-span-2">
                                                            Description
                                                            <Input name="description" defaultValue={entity.description ?? ""} className="mt-1" />
                                                          </label>
                                                          <label className="text-sm">
                                                            Photo URL
                                                            <Input name="photo_url" defaultValue={entity.photo_url ?? ""} className="mt-1" />
                                                          </label>
                                                          <label className="text-sm">
                                                            Tags (comma-separated)
                                                            <Input
                                                              name="tags_csv"
                                                              defaultValue={Array.isArray(entity.tags) ? entity.tags.join(", ") : ""}
                                                              className="mt-1"
                                                            />
                                                          </label>
                                                          <div className="md:col-span-2">
                                                            <Button type="submit">Save Entity</Button>
                                                          </div>
                                                        </form>
                                                      </FormDialog>
                                                      <form action={deleteClientEntityAction}>
                                                        <input type="hidden" name="id" value={entity.id} />
                                                        <input type="hidden" name="client_id" value={client.id} />
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
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                  </div>
                                </>
                              )}
                            </div>
                          </FormDialog>

                          <FormDialog
                            title="Report Sync Checker"
                            description="Green means report assignment will be added. Red means report assignment will be removed."
                            triggerLabel="Sync Checker"
                          >
                            <div className="space-y-4">
                              <form action={syncClientReportsAction}>
                                <input type="hidden" name="client_id" value={client.id} />
                                <Button type="submit">Apply Sync (+{syncPreview.addLabels.length} / -{syncPreview.removeLabels.length})</Button>
                              </form>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <p className="mb-2 text-sm font-medium text-success">Will be added ({syncPreview.addLabels.length})</p>
                                  <div className="space-y-1">
                                    {syncPreview.addLabels.length === 0 ? (
                                      <p className="text-xs text-muted-foreground">No additions.</p>
                                    ) : (
                                      syncPreview.addLabels.map((label, index) => (
                                        <p key={`${label}-${index}`} className="text-xs text-success">
                                          + {label}
                                        </p>
                                      ))
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <p className="mb-2 text-sm font-medium text-critical">
                                    Will be removed ({syncPreview.removeLabels.length})
                                  </p>
                                  <div className="space-y-1">
                                    {syncPreview.removeLabels.length === 0 ? (
                                      <p className="text-xs text-muted-foreground">No removals.</p>
                                    ) : (
                                      syncPreview.removeLabels.map((label, index) => (
                                        <p key={`${label}-${index}`} className="text-xs text-critical">
                                          - {label}
                                        </p>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </FormDialog>

                          <form action={deleteClientAction}>
                            <input type="hidden" name="id" value={client.id} />
                            <ConfirmSubmitDialogButton
                              type="submit"
                              size="sm"
                              variant="destructive"
                              confirmTitle="Delete client"
                              confirmDescription="Delete this client? This cannot be undone."
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
        </CardContent>
      </Card>
    </div>
  );
}
