import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { renderTemplate } from "@/lib/portal/template";

async function readUploadedText(formData: FormData, key: string): Promise<string | null> {
  const value = formData.get(key);
  if (!(value instanceof File) || value.size <= 0) return null;
  const text = (await value.text()).trim();
  return text.length > 0 ? text : null;
}

function parseJsonOrRedirect(jsonText: string, reportId: string, clientId: string, granularityId: string): unknown {
  try {
    return JSON.parse(jsonText);
  } catch {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&error=Invalid+JSON+file`,
    );
  }
}

function toObject(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  return input as Record<string, unknown>;
}

function isEmptyObject(input: Record<string, unknown> | null): boolean {
  if (!input) return true;
  return Object.keys(input).length === 0;
}

function flattenObject(
  input: unknown,
  prefix = "",
  output: Array<{ path: string; value: string; type: string }> = [],
) {
  if (input === null || input === undefined) return output;
  if (typeof input !== "object" || Array.isArray(input)) {
    if (prefix) {
      const type = input === null ? "null" : typeof input;
      output.push({ path: prefix, value: input === null ? "" : String(input), type });
    }
    return output;
  }

  Object.entries(input as Record<string, unknown>).forEach(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, next, output);
    } else if (Array.isArray(value)) {
      output.push({ path: next, value: JSON.stringify(value), type: "array" });
    } else {
      const type = value === null ? "null" : typeof value;
      output.push({ path: next, value: value === null ? "" : String(value), type });
    }
  });

  return output;
}

function setByPath(root: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".").filter(Boolean);
  if (parts.length === 0) return;
  let cursor: Record<string, unknown> = root;
  parts.forEach((part, index) => {
    const isLeaf = index === parts.length - 1;
    if (isLeaf) {
      cursor[part] = value;
      return;
    }
    const next = cursor[part];
    if (!next || typeof next !== "object" || Array.isArray(next)) {
      cursor[part] = {};
    }
    cursor = cursor[part] as Record<string, unknown>;
  });
}

function parseFieldValue(rawValue: string, rawType: string): unknown {
  if (rawType === "number") {
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (rawType === "boolean") {
    return rawValue === "true";
  }
  if (rawType === "array") {
    try {
      const parsed = JSON.parse(rawValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (rawType === "null") {
    return rawValue.trim().length === 0 ? null : rawValue;
  }
  return rawValue;
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

async function uploadReportJsonAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const reportId = String(formData.get("report_id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "all").trim();
  const locale = String(formData.get("locale") ?? "en").trim();

  if (!reportId || !["en", "id", "ja"].includes(locale)) {
    redirect("/admin/client-reports?error=Invalid+report+content+update+request");
  }

  const uploadedText = await readUploadedText(formData, "report_json_file");
  const manualText = String(formData.get("report_json") ?? "").trim();
  const jsonText = uploadedText ?? manualText;
  if (!jsonText) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&error=Upload+or+paste+JSON+content`,
    );
  }

  const parsed = parseJsonOrRedirect(jsonText, reportId, clientId, granularityId);
  const root =
    parsed && typeof parsed === "object" && !Array.isArray(parsed) && "pages" in parsed
      ? (parsed as { pages?: unknown }).pages
      : parsed;

  if (!root || typeof root !== "object" || Array.isArray(root)) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&error=JSON+must+be+object+of+page_key+to+content`,
    );
  }

  const pageMap = root as Record<string, unknown>;
  const { data: reportPages, error: reportPagesError } = await supabase
    .from("report_pages")
    .select("id,report_page_templates(page_key)")
    .eq("report_id", reportId);
  if (reportPagesError) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&error=${encodeURIComponent(
        reportPagesError.message,
      )}`,
    );
  }

  const updates: Array<{ id: string; content: unknown }> = [];
  (reportPages ?? []).forEach((page) => {
    const template = Array.isArray(page.report_page_templates)
      ? page.report_page_templates[0]
      : page.report_page_templates;
    const pageKey = template?.page_key;
    if (!pageKey) return;
    if (Object.prototype.hasOwnProperty.call(pageMap, pageKey)) {
      updates.push({ id: page.id, content: pageMap[pageKey] });
    }
  });

  if (updates.length === 0) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&error=No+matching+page_key+found+in+JSON`,
    );
  }

  for (const update of updates) {
    const payload =
      locale === "id"
        ? { id_content: update.content, updated_at: new Date().toISOString() }
        : locale === "ja"
          ? { ja_content: update.content, updated_at: new Date().toISOString() }
          : { en_content: update.content, updated_at: new Date().toISOString() };

    const { error } = await supabase.from("report_pages").update(payload).eq("id", update.id);
    if (error) {
      redirect(
        `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&error=${encodeURIComponent(
          error.message,
        )}`,
      );
    }
  }

  revalidatePath(`/admin/client-reports/${reportId}/edit`);
  revalidatePath("/admin/client-reports");
  revalidatePath(`/reports/${reportId}`);
  redirect(
    `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&success=${encodeURIComponent(
      `Updated ${updates.length} report pages for locale ${locale}`,
    )}`,
  );
}

async function uploadPageCsvAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const reportId = String(formData.get("report_id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "all").trim();
  const defaultLocale = String(formData.get("locale") ?? "en").trim();
  const file = formData.get("pages_csv_file");

  if (!reportId || !["en", "id", "ja"].includes(defaultLocale)) {
    redirect("/admin/client-reports?error=Invalid+CSV+update+request");
  }
  if (!(file instanceof File) || file.size === 0) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${defaultLocale}&error=Upload+CSV+file+first`,
    );
  }

  const rows = parseCsvRows(await file.text());
  if (rows.length === 0) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${defaultLocale}&error=CSV+must+contain+header+and+rows`,
    );
  }

  const { data: reportPages, error: pagesError } = await supabase
    .from("report_pages")
    .select("id,report_page_templates(page_key)")
    .eq("report_id", reportId);
  if (pagesError) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${defaultLocale}&error=${encodeURIComponent(
        pagesError.message,
      )}`,
    );
  }

  const pageIdByKey = new Map<string, string>();
  (reportPages ?? []).forEach((page) => {
    const template = Array.isArray(page.report_page_templates)
      ? page.report_page_templates[0]
      : page.report_page_templates;
    if (template?.page_key) pageIdByKey.set(template.page_key, page.id);
  });

  const errors: string[] = [];
  const updates: Array<{ pageId: string; locale: string; content: unknown }> = [];

  rows.forEach((row, index) => {
    const lineNo = index + 2;
    const pageKey = String(row.page_key ?? "").trim();
    const jsonText = String(row.json ?? row.content_json ?? "").trim();
    const rowLocaleRaw = String(row.locale ?? defaultLocale).trim();
    const rowLocale = ["en", "id", "ja"].includes(rowLocaleRaw) ? rowLocaleRaw : defaultLocale;

    if (!pageKey) {
      errors.push(`Row ${lineNo}: page_key is required`);
      return;
    }
    const pageId = pageIdByKey.get(pageKey);
    if (!pageId) {
      errors.push(`Row ${lineNo}: page_key "${pageKey}" not found`);
      return;
    }
    if (!jsonText) {
      errors.push(`Row ${lineNo}: json is required`);
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      updates.push({ pageId, locale: rowLocale, content: parsed });
    } catch {
      errors.push(`Row ${lineNo}: invalid json`);
    }
  });

  if (errors.length > 0) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${defaultLocale}&error=${encodeURIComponent(
        errors.slice(0, 5).join("; "),
      )}`,
    );
  }

  for (const update of updates) {
    const payload =
      update.locale === "id"
        ? { id_content: update.content, updated_at: new Date().toISOString() }
        : update.locale === "ja"
          ? { ja_content: update.content, updated_at: new Date().toISOString() }
          : { en_content: update.content, updated_at: new Date().toISOString() };

    const { error } = await supabase.from("report_pages").update(payload).eq("id", update.pageId);
    if (error) {
      redirect(
        `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${defaultLocale}&error=${encodeURIComponent(
          error.message,
        )}`,
      );
    }
  }

  revalidatePath(`/admin/client-reports/${reportId}/edit`);
  revalidatePath(`/reports/${reportId}`);
  redirect(
    `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${defaultLocale}&success=${encodeURIComponent(
      `CSV updated ${updates.length} pages`,
    )}`,
  );
}

async function updatePageContentFieldsAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const reportId = String(formData.get("report_id") ?? "").trim();
  const pageId = String(formData.get("page_id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "all").trim();
  const locale = String(formData.get("locale") ?? "en").trim();
  const fieldCount = Number(formData.get("field_count") ?? 0);

  if (!reportId || !pageId || !["en", "id", "ja"].includes(locale)) {
    redirect("/admin/client-reports?error=Invalid+field+update+request");
  }

  const nextContent: Record<string, unknown> = {};
  for (let index = 0; index < fieldCount; index += 1) {
    const path = String(formData.get(`field_path_${index}`) ?? "").trim();
    const value = String(formData.get(`field_value_${index}`) ?? "");
    const type = String(formData.get(`field_type_${index}`) ?? "string");
    if (!path) continue;
    setByPath(nextContent, path, parseFieldValue(value, type));
  }

  const payload =
    locale === "id"
      ? { id_content: nextContent, updated_at: new Date().toISOString() }
      : locale === "ja"
        ? { ja_content: nextContent, updated_at: new Date().toISOString() }
        : { en_content: nextContent, updated_at: new Date().toISOString() };

  const { error } = await supabase
    .from("report_pages")
    .update(payload)
    .eq("id", pageId)
    .eq("report_id", reportId);
  if (error) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${locale}&error=${encodeURIComponent(
        error.message,
      )}`,
    );
  }

  revalidatePath(`/admin/client-reports/${reportId}/edit`);
  revalidatePath(`/reports/${reportId}`);
  redirect(
    `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${locale}&success=${encodeURIComponent(
      "Page content updated from interactive fields",
    )}`,
  );
}

async function updatePageJsonAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const reportId = String(formData.get("report_id") ?? "").trim();
  const pageId = String(formData.get("page_id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "all").trim();
  const locale = String(formData.get("locale") ?? "en").trim();
  const uploadedText = await readUploadedText(formData, "page_json_file");
  const manualJson = String(formData.get("page_json") ?? "").trim();
  const rawJson = uploadedText ?? manualJson;

  if (!reportId || !pageId || !["en", "id", "ja"].includes(locale)) {
    redirect("/admin/client-reports?error=Invalid+json+update+request");
  }
  if (!rawJson) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${locale}&error=JSON+is+required`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${locale}&error=Invalid+JSON+format`,
    );
  }

  const payload =
    locale === "id"
      ? { id_content: parsed, updated_at: new Date().toISOString() }
      : locale === "ja"
        ? { ja_content: parsed, updated_at: new Date().toISOString() }
        : { en_content: parsed, updated_at: new Date().toISOString() };

  const { error } = await supabase
    .from("report_pages")
    .update(payload)
    .eq("id", pageId)
    .eq("report_id", reportId);
  if (error) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${locale}&error=${encodeURIComponent(
        error.message,
      )}`,
    );
  }

  revalidatePath(`/admin/client-reports/${reportId}/edit`);
  revalidatePath(`/reports/${reportId}`);
  redirect(
    `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${locale}&success=${encodeURIComponent(
      "Page JSON updated",
    )}`,
  );
}

export default async function AdminClientReportEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ client_id?: string; granularity_id?: string; locale?: string; success?: string; error?: string }>;
}) {
  await requireRole("admin");
  const supabase = await createClient();
  const { reportId } = await params;
  const query = await searchParams;
  const clientId = query.client_id ?? "";
  const granularityId = query.granularity_id ?? "all";
  const locale = ["en", "id", "ja"].includes(query.locale ?? "") ? String(query.locale) : "en";

  const [{ data: report }, { data: pages }] = await Promise.all([
    supabase
      .from("reports")
      .select("id,status,entity_id,report_type_template_id")
      .eq("id", reportId)
      .maybeSingle(),
    supabase
      .from("report_pages")
      .select("id,page_order,en_content,id_content,ja_content,report_page_templates(page_key,title,html_template,sample_data)")
      .eq("report_id", reportId)
      .order("page_order", { ascending: true }),
  ]);

  if (!report) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-critical">Report not found.</p>
        <Link href="/admin/client-reports" className="text-sm text-primary underline">
          Back to Client Reports
        </Link>
      </div>
    );
  }

  const { data: reportType } = await supabase
    .from("report_type_templates")
    .select("name")
    .eq("id", report.report_type_template_id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Report Content — ${reportType?.name ?? "Report Type"}`}
        description="Upload real report JSON and preview rendered HTML per page."
      />
      <Link
        href={`/admin/client-reports?client_id=${clientId}&granularity_id=${granularityId}`}
        className="text-sm text-primary underline"
      >
        Back to Client Reports
      </Link>

      {query.success ? (
        <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          {query.success}
        </p>
      ) : null}
      {query.error ? (
        <p className="rounded-lg border border-critical/30 bg-critical/10 px-3 py-2 text-sm text-critical">
          {query.error}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Report Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form className="flex flex-wrap items-end gap-2">
            <input type="hidden" name="client_id" value={clientId} />
            <input type="hidden" name="granularity_id" value={granularityId} />
            <label className="text-sm block">
              Preview Locale
              <select
                name="locale"
                defaultValue={locale}
                className="mt-1 block h-10 w-40 rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="en">en</option>
                <option value="id">id</option>
                <option value="ja">ja</option>
              </select>
            </label>
            <Button type="submit" variant="secondary">
              Load Locale
            </Button>
          </form>
          <p className="text-sm text-muted-foreground">
            Format: JSON object by <code>page_key</code>, or <code>{`{"pages": {...}}`}</code>.
          </p>
          <form action={uploadPageCsvAction} className="space-y-3 rounded-lg border border-border/70 p-3" encType="multipart/form-data">
            <input type="hidden" name="report_id" value={reportId} />
            <input type="hidden" name="client_id" value={clientId} />
            <input type="hidden" name="granularity_id" value={granularityId} />
            <input type="hidden" name="locale" value={locale} />
            <p className="text-xs text-muted-foreground">
              Bulk page editor by CSV. Columns: <code>page_key</code>, <code>json</code>, optional <code>locale</code>.
            </p>
            <label className="block text-sm">
              Upload page CSV
              <Input name="pages_csv_file" type="file" accept=".csv,text/csv" className="mt-1" />
            </label>
            <Button type="submit" variant="secondary">Upload CSV Per Page</Button>
          </form>
          <form action={uploadReportJsonAction} className="space-y-3" encType="multipart/form-data">
            <input type="hidden" name="report_id" value={reportId} />
            <input type="hidden" name="client_id" value={clientId} />
            <input type="hidden" name="granularity_id" value={granularityId} />
            <label className="text-sm block">
              Locale
              <select
                name="locale"
                defaultValue={locale}
                className="mt-1 block h-10 w-full max-w-xs rounded-lg border border-input bg-card px-3 text-sm shadow-soft"
              >
                <option value="en">en</option>
                <option value="id">id</option>
                <option value="ja">ja</option>
              </select>
            </label>
            <label className="block text-sm">
              Upload report JSON file
              <Input name="report_json_file" type="file" accept=".json,application/json,text/plain" className="mt-1" />
            </label>
            <label className="block text-sm">
              Or paste report JSON
              <textarea
                name="report_json"
                rows={6}
                className="mt-1 block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                placeholder='{"overview":{"title":"..."},"summary":{"text":"..."}}'
              />
            </label>
            <Button type="submit">Upload JSON & Update Pages</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rendered Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(pages ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No report pages available for preview.</p>
          ) : null}
          {(pages ?? []).map((page, pageIndex) => {
            const template = Array.isArray(page.report_page_templates)
              ? page.report_page_templates[0]
              : page.report_page_templates;
            const htmlTemplate = template?.html_template ?? "";
            const localeContent =
              locale === "id"
                ? (page.id_content ?? page.en_content)
                : locale === "ja"
                  ? (page.ja_content ?? page.en_content)
                  : page.en_content;
            const localeObject = toObject(localeContent);
            const sampleObject = toObject(template?.sample_data);
            const content = !isEmptyObject(localeObject) ? localeObject : (sampleObject ?? localeObject ?? {});
            const rendered = renderTemplate(htmlTemplate, content);
            const fields = flattenObject(content);
            return (
              <details
                key={page.id}
                open={pageIndex === 0}
                className="rounded-lg border border-border/70 bg-card"
              >
                <summary className="cursor-pointer list-none border-b border-border/70 px-3 py-2 text-sm font-medium">
                  Page {page.page_order}: {template?.title ?? "Untitled Page"}{" "}
                  <span className="text-xs text-muted-foreground">({template?.page_key ?? "-"})</span>
                </summary>
                <div className="p-3">
                  <form
                    action={updatePageJsonAction}
                    className="mb-4 space-y-2 rounded-md border border-border/70 p-3"
                    encType="multipart/form-data"
                  >
                    <input type="hidden" name="report_id" value={reportId} />
                    <input type="hidden" name="page_id" value={page.id} />
                    <input type="hidden" name="client_id" value={clientId} />
                    <input type="hidden" name="granularity_id" value={granularityId} />
                    <input type="hidden" name="locale" value={locale} />
                    <p className="text-xs text-muted-foreground">
                      Per-page JSON editor. Upload one JSON file for this page or edit the JSON text directly.
                    </p>
                    <label className="block text-xs">
                      Upload JSON for this page
                      <Input
                        name="page_json_file"
                        type="file"
                        accept=".json,application/json,text/plain"
                        className="mt-1"
                      />
                    </label>
                    <textarea
                      name="page_json"
                      rows={8}
                      defaultValue={JSON.stringify(content, null, 2)}
                      className="block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                    />
                    <Button type="submit" size="sm" variant="secondary">
                      Save Page JSON
                    </Button>
                  </form>
                  <form action={updatePageContentFieldsAction} className="mb-4 space-y-3 rounded-md border border-border/70 p-3">
                    <input type="hidden" name="report_id" value={reportId} />
                    <input type="hidden" name="page_id" value={page.id} />
                    <input type="hidden" name="client_id" value={clientId} />
                    <input type="hidden" name="granularity_id" value={granularityId} />
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="field_count" value={fields.length} />
                    <p className="text-xs text-muted-foreground">
                      Interactive fields (from current JSON/template). Edit small values and save this page.
                    </p>
                    {fields.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No editable scalar fields detected.</p>
                    ) : (
                      <div className="grid gap-2 md:grid-cols-2">
                        {fields.map((field, index) => (
                          <label key={`${page.id}-${field.path}-${index}`} className="text-xs">
                            {field.path}
                            <input type="hidden" name={`field_path_${index}`} value={field.path} />
                            <input type="hidden" name={`field_type_${index}`} value={field.type} />
                            <Input
                              name={`field_value_${index}`}
                              defaultValue={field.value}
                              className="mt-1"
                              placeholder={field.type}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    <Button type="submit" size="sm">
                      Save Page Fields
                    </Button>
                  </form>
                  <div
                    className="rounded-md border border-border/70 bg-card p-3"
                    dangerouslySetInnerHTML={{ __html: rendered }}
                  />
                </div>
              </details>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
