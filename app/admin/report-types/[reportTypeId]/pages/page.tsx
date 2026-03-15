import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmSubmitDialogButton } from "@/components/ui/confirm-submit-dialog-button";
import { FormDialog } from "@/components/ui/form-dialog";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { hasReferenceContract } from "@/lib/report-json-contract";
import { StatusBanner } from "@/components/ui/status-banner";

const ANALYSIS_LEVEL_OPTIONS = ["TOP GRADE", "COST-EFFECTIVE", "OPTIMAL"] as const;

type AnalysisLevel = (typeof ANALYSIS_LEVEL_OPTIONS)[number];

type ReportPageTemplateRow = {
  id: string;
  page_key: string;
  page_order: number;
  title: string;
  html_template: string | null;
  readme_markdown: string | null;
  sample_data: unknown;
  gpt_json_schema: unknown;
  report_format: string | null;
  analysis_level: AnalysisLevel | null;
  system_prompt: string | null;
  execution_order: number | null;
};

const REPORT_PAGE_TEMPLATE_SELECT = [
  "id",
  "page_key",
  "page_order",
  "title",
  "html_template",
  "readme_markdown",
  "sample_data",
  'gpt_json_schema:"gpt json schema"',
  'report_format:"Report_format"',
  "analysis_level",
  'system_prompt:"system prompt"',
  "execution_order",
].join(",");

async function readUploadedText(formData: FormData, key: string): Promise<string | null> {
  const value = formData.get(key);
  if (!(value instanceof File) || value.size <= 0) return null;
  const text = (await value.text()).trim();
  return text.length > 0 ? text : null;
}

function parseJsonOrRedirect(jsonText: string, reportTypeId: string, fieldLabel: string): unknown {
  try {
    return JSON.parse(jsonText);
  } catch {
    redirect(`/admin/report-types/${reportTypeId}/pages?error=${encodeURIComponent(`Invalid JSON for ${fieldLabel}`)}`);
  }
}

function coerceSampleData(sample: unknown): unknown {
  if (typeof sample !== "string") return sample;
  try {
    return JSON.parse(sample);
  } catch {
    return sample;
  }
}

function extractTokens(template: string): string[] {
  const matches = template.match(/{{{\s*[^{}]+?\s*}}}|{{\s*[^{}]+?\s*}}/g) ?? [];
  return Array.from(
    new Set(
      matches
        .map((match) => match.replace(/{{{\s*|\s*}}}|{{\s*|\s*}}/g, "").trim())
        .map((token) => (token.startsWith("json:") ? token.slice("json:".length).trim() : token))
        .filter(Boolean),
    ),
  );
}

function hasValueByPath(input: unknown, token: string): boolean {
  if (!token) return false;
  const segments = token.split(".");
  let current: unknown = input;
  for (const segment of segments) {
    if (current === null || current === undefined) return false;
    if (typeof current !== "object") return false;
    current = (current as Record<string, unknown>)[segment];
  }
  return current !== undefined && current !== null && String(current).length > 0;
}

function jsonToEditorText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function compactValue(value: unknown, max = 120): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") {
    const raw = jsonToEditorText(value).replace(/\s+/g, " ").trim();
    return raw.length <= max ? raw : `${raw.slice(0, max)}...`;
  }
  const text = String(value).replace(/\s+/g, " ").trim();
  if (!text) return "-";
  return text.length <= max ? text : `${text.slice(0, max)}...`;
}

function parseAnalysisLevel(value: string): AnalysisLevel | null {
  if (!value) return null;
  if ((ANALYSIS_LEVEL_OPTIONS as readonly string[]).includes(value)) {
    return value as AnalysisLevel;
  }
  return null;
}

async function createPageTemplateAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const reportTypeId = String(formData.get("report_type_template_id") ?? "");
  const pageKey = String(formData.get("page_key") ?? "").trim();
  const pageOrder = Number(formData.get("page_order") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const htmlTextFromFile = await readUploadedText(formData, "html_file");
  const htmlTemplate = htmlTextFromFile ?? String(formData.get("html_template") ?? "").trim();
  const readmeTextFromFile = await readUploadedText(formData, "readme_file");
  const readmeMarkdownText = String(formData.get("readme_markdown") ?? "").trim();
  const readmeMarkdown = readmeTextFromFile ?? (readmeMarkdownText.length > 0 ? readmeMarkdownText : null);
  const sampleDataTextFromFile = await readUploadedText(formData, "sample_data_file");
  const sampleDataText = sampleDataTextFromFile ?? String(formData.get("sample_data_json") ?? "").trim();
  const sampleData = sampleDataText ? parseJsonOrRedirect(sampleDataText, reportTypeId, "sample_data") : null;
  const gptJsonSchemaText = String(formData.get("gpt_json_schema") ?? "").trim();
  const gptJsonSchema = gptJsonSchemaText
    ? parseJsonOrRedirect(gptJsonSchemaText, reportTypeId, "gpt json schema")
    : null;
  const reportFormatText = String(formData.get("report_format") ?? "").trim();
  const reportFormat = reportFormatText.length > 0 ? reportFormatText : null;
  const analysisLevel = parseAnalysisLevel(String(formData.get("analysis_level") ?? "").trim());
  const systemPromptText = String(formData.get("system_prompt") ?? "").trim();
  const systemPrompt = systemPromptText.length > 0 ? systemPromptText : null;
  const executionOrderRaw = String(formData.get("execution_order") ?? "").trim();
  const executionOrder = executionOrderRaw.length > 0 ? Number(executionOrderRaw) : null;

  if (!reportTypeId || !pageKey || !title || !htmlTemplate || !Number.isFinite(pageOrder)) {
    redirect(`/admin/report-types/${reportTypeId}/pages?error=Missing+required+fields+(HTML+is+required)`);
  }
  if (executionOrderRaw.length > 0 && !Number.isFinite(executionOrder)) {
    redirect(`/admin/report-types/${reportTypeId}/pages?error=execution_order+must+be+a+valid+number`);
  }
  if (String(formData.get("analysis_level") ?? "").trim().length > 0 && !analysisLevel) {
    redirect(
      `/admin/report-types/${reportTypeId}/pages?error=${encodeURIComponent(
        "analysis_level must be TOP GRADE, COST-EFFECTIVE, or OPTIMAL",
      )}`,
    );
  }

  const { error } = await supabase.from("report_page_templates").insert({
    report_type_template_id: reportTypeId,
    page_key: pageKey,
    page_order: pageOrder,
    title,
    html_template: htmlTemplate,
    readme_markdown: readmeMarkdown,
    sample_data: sampleData,
    "gpt json schema": gptJsonSchema,
    Report_format: reportFormat,
    analysis_level: analysisLevel,
    "system prompt": systemPrompt,
    execution_order: executionOrder,
  });

  if (error) redirect(`/admin/report-types/${reportTypeId}/pages?error=${encodeURIComponent(error.message)}`);

  revalidatePath(`/admin/report-types/${reportTypeId}/pages`);
  redirect(`/admin/report-types/${reportTypeId}/pages?success=Page+created`);
}

async function updatePageTemplateColumnAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const reportTypeId = String(formData.get("report_type_template_id") ?? "").trim();
  const column = String(formData.get("column") ?? "").trim();
  const value = String(formData.get("value") ?? "");
  const clear = formData.get("clear") === "on";

  if (!id || !reportTypeId || !column) {
    redirect(`/admin/report-types/${reportTypeId}/pages?error=Missing+required+fields`);
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  switch (column) {
    case "page_key": {
      const next = value.trim();
      if (!next) redirect(`/admin/report-types/${reportTypeId}/pages?error=page_key+cannot+be+empty`);
      updates.page_key = next;
      break;
    }
    case "page_order": {
      const next = Number(value);
      if (!Number.isInteger(next) || next < 1) {
        redirect(`/admin/report-types/${reportTypeId}/pages?error=page_order+must+be+an+integer+>=+1`);
      }
      updates.page_order = next;
      break;
    }
    case "title": {
      const next = value.trim();
      if (!next) redirect(`/admin/report-types/${reportTypeId}/pages?error=title+cannot+be+empty`);
      updates.title = next;
      break;
    }
    case "html_template": {
      const next = value.trim();
      if (!next) redirect(`/admin/report-types/${reportTypeId}/pages?error=html_template+cannot+be+empty`);
      updates.html_template = next;
      break;
    }
    case "readme_markdown": {
      updates.readme_markdown = clear ? null : value;
      break;
    }
    case "sample_data": {
      if (clear) {
        updates.sample_data = null;
      } else {
        const next = value.trim();
        if (!next) redirect(`/admin/report-types/${reportTypeId}/pages?error=Invalid+JSON+for+sample_data`);
        updates.sample_data = parseJsonOrRedirect(next, reportTypeId, "sample_data");
      }
      break;
    }
    case "gpt_json_schema": {
      if (clear) {
        updates["gpt json schema"] = null;
      } else {
        const next = value.trim();
        if (!next) redirect(`/admin/report-types/${reportTypeId}/pages?error=Invalid+JSON+for+gpt_json_schema`);
        updates["gpt json schema"] = parseJsonOrRedirect(next, reportTypeId, "gpt json schema");
      }
      break;
    }
    case "report_format": {
      updates.Report_format = clear ? null : value;
      break;
    }
    case "analysis_level": {
      if (clear) {
        updates.analysis_level = null;
      } else {
        const next = parseAnalysisLevel(value);
        if (!next) {
          redirect(
            `/admin/report-types/${reportTypeId}/pages?error=${encodeURIComponent(
              "analysis_level must be TOP GRADE, COST-EFFECTIVE, or OPTIMAL",
            )}`,
          );
        }
        updates.analysis_level = next;
      }
      break;
    }
    case "system_prompt": {
      updates["system prompt"] = clear ? null : value;
      break;
    }
    case "execution_order": {
      if (clear) {
        updates.execution_order = null;
      } else {
        const next = Number(value);
        if (!Number.isFinite(next)) {
          redirect(`/admin/report-types/${reportTypeId}/pages?error=execution_order+must+be+a+valid+number`);
        }
        updates.execution_order = next;
      }
      break;
    }
    default: {
      redirect(`/admin/report-types/${reportTypeId}/pages?error=Unsupported+column`);
    }
  }

  const { error } = await supabase
    .from("report_page_templates")
    .update(updates)
    .eq("id", id)
    .eq("report_type_template_id", reportTypeId);

  if (error) redirect(`/admin/report-types/${reportTypeId}/pages?error=${encodeURIComponent(error.message)}`);

  revalidatePath(`/admin/report-types/${reportTypeId}/pages`);
  redirect(`/admin/report-types/${reportTypeId}/pages?success=${encodeURIComponent(`${column} updated`)}`);
}

async function deletePageTemplateAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const reportTypeId = String(formData.get("report_type_template_id") ?? "");
  if (!id || !reportTypeId) redirect("/admin/report-types?error=Missing+id");

  const { error } = await supabase.from("report_page_templates").delete().eq("id", id);
  if (error) redirect(`/admin/report-types/${reportTypeId}/pages?error=${encodeURIComponent(error.message)}`);

  revalidatePath(`/admin/report-types/${reportTypeId}/pages`);
  redirect(`/admin/report-types/${reportTypeId}/pages?success=Page+deleted`);
}

async function movePageTemplateAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const reportTypeId = String(formData.get("report_type_template_id") ?? "");
  const direction = String(formData.get("direction") ?? "up");
  if (!id || !reportTypeId) redirect("/admin/report-types?error=Missing+id");

  const { data: current } = await supabase
    .from("report_page_templates")
    .select("id,page_order")
    .eq("id", id)
    .maybeSingle();
  if (!current) redirect(`/admin/report-types/${reportTypeId}/pages?error=Page+not+found`);

  const targetOrder = direction === "up" ? current.page_order - 1 : current.page_order + 1;
  if (targetOrder < 1) redirect(`/admin/report-types/${reportTypeId}/pages`);

  const { data: target } = await supabase
    .from("report_page_templates")
    .select("id,page_order")
    .eq("report_type_template_id", reportTypeId)
    .eq("page_order", targetOrder)
    .maybeSingle();

  if (!target) redirect(`/admin/report-types/${reportTypeId}/pages`);

  await supabase
    .from("report_page_templates")
    .update({ page_order: current.page_order })
    .eq("id", target.id);

  await supabase
    .from("report_page_templates")
    .update({ page_order: targetOrder })
    .eq("id", current.id);

  revalidatePath(`/admin/report-types/${reportTypeId}/pages`);
  redirect(`/admin/report-types/${reportTypeId}/pages?success=Page+order+updated`);
}

function ColumnEditorDialog({
  title,
  description,
  triggerLabel,
  children,
}: {
  title: string;
  description: string;
  triggerLabel: string;
  children: React.ReactNode;
}) {
  return (
    <FormDialog title={title} description={description} triggerLabel={triggerLabel}>
      {children}
    </FormDialog>
  );
}

export default async function ReportTypePagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportTypeId: string }>;
  searchParams: Promise<{ success?: string; error?: string; page_id?: string }>;
}) {
  await requireRole("admin");
  const supabase = await createClient();
  const { reportTypeId } = await params;
  const query = await searchParams;

  const { data: reportType } = await supabase
    .from("report_type_templates")
    .select("id,name,category")
    .eq("id", reportTypeId)
    .maybeSingle();

  const baseSelect = "id,page_key,page_order,title,html_template,readme_markdown,sample_data";
  const extendedResult = await supabase
    .from("report_page_templates")
    .select(REPORT_PAGE_TEMPLATE_SELECT)
    .eq("report_type_template_id", reportTypeId)
    .order("page_order", { ascending: true });

  let supportsExtendedColumns = !extendedResult.error;
  let extendedColumnsWarning: string | null = null;
  let pages = extendedResult.data as ReportPageTemplateRow[] | null;

  if (extendedResult.error) {
    const fallback = await supabase
      .from("report_page_templates")
      .select(baseSelect)
      .eq("report_type_template_id", reportTypeId)
      .order("page_order", { ascending: true });

    if (fallback.error) {
      redirect(`/admin/report-types/${reportTypeId}/pages?error=${encodeURIComponent(fallback.error.message)}`);
    }

    supportsExtendedColumns = false;
    extendedColumnsWarning =
      "Extended template columns are not available in this database yet. Ensure report_page_templates includes \"gpt json schema\", \"Report_format\", \"analysis_level\", \"system prompt\", and \"execution_order\".";
    pages = (fallback.data ?? []).map((row) => ({
      ...row,
      gpt_json_schema: null,
      report_format: null,
      analysis_level: null,
      system_prompt: null,
      execution_order: null,
    })) as ReportPageTemplateRow[];
  }

  if (!reportType) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-critical">Report type not found.</p>
        <Link href="/admin/report-types" className="text-sm text-primary underline">
          Back to Report Types
        </Link>
      </div>
    );
  }

  const templateRows = (pages ?? []) as ReportPageTemplateRow[];
  const requestedPageId = String(query.page_id ?? "").trim();
  const selectedPage =
    templateRows.find((page) => page.id === requestedPageId) ??
    templateRows[0] ??
    null;
  const nextOrder = Math.max(0, ...templateRows.map((page) => page.page_order)) + 1;

  return (
    <div className="space-y-6">
      <PageHeader title={`Manage Pages — ${reportType.name}`} description={`Category: ${reportType.category}`} />
      <Link href="/admin/report-types" className="text-sm text-primary underline">
        Back to Report Types
      </Link>

      <div className="flex justify-end">
        <FormDialog
          title="Add Page Template"
          description="Create a page template for this report type."
          triggerLabel="Add Page"
          triggerVariant="default"
        >
          <form action={createPageTemplateAction} className="space-y-3" encType="multipart/form-data">
            <input type="hidden" name="report_type_template_id" value={reportTypeId} />
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-sm">
                Page Key
                <Input className="mt-1" name="page_key" placeholder="overview" required />
              </label>
              <label className="text-sm">
                Page Order
                <Input className="mt-1" name="page_order" type="number" defaultValue={nextOrder} min={1} required />
              </label>
              <label className="text-sm">
                Title
                <Input className="mt-1" name="title" placeholder="Overview" required />
              </label>
            </div>
            <label className="block text-sm">
              Upload HTML template (.html)
              <input
                type="file"
                name="html_file"
                accept=".html,.hml,text/html,text/plain"
                className="mt-1 block w-full rounded-lg border border-input bg-card p-2 text-xs shadow-soft"
              />
            </label>
            <label className="block text-sm">
              Upload README (.md)
              <input
                type="file"
                name="readme_file"
                accept=".md,.markdown,text/markdown,text/plain"
                className="mt-1 block w-full rounded-lg border border-input bg-card p-2 text-xs shadow-soft"
              />
            </label>
            <label className="block text-sm">
              Upload sample data (.json)
              <input
                type="file"
                name="sample_data_file"
                accept=".json,application/json,text/json,text/plain"
                className="mt-1 block w-full rounded-lg border border-input bg-card p-2 text-xs shadow-soft"
              />
            </label>
            <details className="rounded-lg border border-border/70 p-3">
              <summary className="cursor-pointer text-sm font-medium">Manual code editors (optional)</summary>
              <div className="mt-3 space-y-3">
                <label className="block text-sm">
                  HTML Template (manual)
                  <textarea
                    name="html_template"
                    rows={6}
                    className="mt-1 block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                    placeholder="<section><h1>{{title}}</h1></section>"
                  />
                </label>
                <label className="block text-sm">
                  README (.md) manual
                  <textarea
                    name="readme_markdown"
                    rows={4}
                    className="mt-1 block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                    placeholder="# Page notes"
                  />
                </label>
                <label className="block text-sm">
                  Sample data (.json) manual
                  <textarea
                    name="sample_data_json"
                    rows={4}
                    className="mt-1 block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                    placeholder='{"title":"Example"}'
                  />
                </label>
                <label className="block text-sm">
                  gpt json schema (.json) manual
                  <textarea
                    name="gpt_json_schema"
                    rows={4}
                    className="mt-1 block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                    placeholder='{"type":"object","properties":{}}'
                  />
                </label>
                <label className="block text-sm">
                  Report_format manual
                  <textarea
                    name="report_format"
                    rows={4}
                    className="mt-1 block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                    placeholder="# Report format"
                  />
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm">
                    analysis_level
                    <select
                      name="analysis_level"
                      className="mt-1 block w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-soft"
                      defaultValue=""
                    >
                      <option value="">(none)</option>
                      {ANALYSIS_LEVEL_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm">
                    execution_order
                    <Input className="mt-1" name="execution_order" type="number" step="any" placeholder="1" />
                  </label>
                </div>
                <label className="block text-sm">
                  system prompt manual
                  <textarea
                    name="system_prompt"
                    rows={5}
                    className="mt-1 block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                    placeholder="System prompt for generation"
                  />
                </label>
              </div>
            </details>
            <Button type="submit">Add Page</Button>
          </form>
        </FormDialog>
      </div>

      {query.success ? <StatusBanner tone="success">{query.success}</StatusBanner> : null}
      {query.error ? <StatusBanner tone="critical">{query.error}</StatusBanner> : null}
      {extendedColumnsWarning ? <StatusBanner tone="warning">{extendedColumnsWarning}</StatusBanner> : null}

      <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="h-fit md:sticky md:top-20">
          <CardHeader>
            <CardTitle className="text-base">Page Selector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {templateRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add your first page template.</p>
            ) : null}
            {templateRows.map((page) => {
              const isActive = selectedPage?.id === page.id;
              return (
                <Link
                  key={page.id}
                  href={`/admin/report-types/${reportTypeId}/pages?page_id=${page.id}`}
                  className={`block rounded-md border px-3 py-2 text-xs ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-border/70 bg-card text-foreground hover:bg-accent/50"}`}
                >
                  <p className="font-semibold">{page.page_key}</p>
                  <p className={`mt-0.5 ${isActive ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                    #{page.page_order} · {page.title}
                  </p>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Page Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!selectedPage ? (
              <p className="text-sm text-muted-foreground">Add your first page template.</p>
            ) : null}

            {selectedPage ? (() => {
              const page = selectedPage;
            const canPreview = Boolean(page.html_template && page.sample_data);
            const sampleForPreview = coerceSampleData(page.sample_data);
            const hasContract = hasReferenceContract(sampleForPreview);
            const tokens = extractTokens(page.html_template ?? "");
            const unresolvedTokens = tokens.filter((token) => !hasValueByPath(sampleForPreview, token));
            const previewUrl = `/admin/report-types/${reportTypeId}/pages/${page.id}/preview`;

            return (
              <div key={page.id} className="rounded-xl border border-border/70 p-3">
                <p className="text-sm font-medium">#{page.page_order} · {page.page_key} · {page.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Contract status: {hasContract ? "Ready for content upload" : "Missing template JSON object/array"}
                </p>

                <details className="mt-3 rounded-md border border-border/70 p-2" open>
                  <summary className="cursor-pointer text-xs font-semibold">Basic Fields</summary>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <div className="rounded-md border border-border/70 p-2">
                    <p className="text-xs font-medium">page_key</p>
                    <p className="mt-1 text-xs text-muted-foreground">{compactValue(page.page_key)}</p>
                    <div className="mt-2">
                      <ColumnEditorDialog title="Edit page_key" description="Update page key" triggerLabel="View / Edit">
                        <form action={updatePageTemplateColumnAction} className="space-y-3">
                          <input type="hidden" name="id" value={page.id} />
                          <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                          <input type="hidden" name="column" value="page_key" />
                          <Input name="value" defaultValue={page.page_key} required />
                          <Button type="submit">Save</Button>
                        </form>
                      </ColumnEditorDialog>
                    </div>
                  </div>

                  <div className="rounded-md border border-border/70 p-2">
                    <p className="text-xs font-medium">page_order</p>
                    <p className="mt-1 text-xs text-muted-foreground">{compactValue(page.page_order)}</p>
                    <div className="mt-2">
                      <ColumnEditorDialog title="Edit page_order" description="Update page order" triggerLabel="View / Edit">
                        <form action={updatePageTemplateColumnAction} className="space-y-3">
                          <input type="hidden" name="id" value={page.id} />
                          <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                          <input type="hidden" name="column" value="page_order" />
                          <Input name="value" type="number" min={1} defaultValue={page.page_order} required />
                          <Button type="submit">Save</Button>
                        </form>
                      </ColumnEditorDialog>
                    </div>
                  </div>

                  <div className="rounded-md border border-border/70 p-2">
                    <p className="text-xs font-medium">title</p>
                    <p className="mt-1 text-xs text-muted-foreground">{compactValue(page.title)}</p>
                    <div className="mt-2">
                      <ColumnEditorDialog title="Edit title" description="Update title" triggerLabel="View / Edit">
                        <form action={updatePageTemplateColumnAction} className="space-y-3">
                          <input type="hidden" name="id" value={page.id} />
                          <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                          <input type="hidden" name="column" value="title" />
                          <Input name="value" defaultValue={page.title} required />
                          <Button type="submit">Save</Button>
                        </form>
                      </ColumnEditorDialog>
                    </div>
                  </div>

                  <div className="rounded-md border border-border/70 p-2">
                    <p className="text-xs font-medium">analysis_level (select: TOP GRADE / COST-EFFECTIVE / OPTIMAL)</p>
                    <p className="mt-1 text-xs text-muted-foreground">{compactValue(page.analysis_level)}</p>
                    <div className="mt-2">
                      <ColumnEditorDialog title="Edit analysis_level" description="Allowed: TOP GRADE, COST-EFFECTIVE, OPTIMAL" triggerLabel="View / Edit">
                        <form action={updatePageTemplateColumnAction} className="space-y-3">
                          <input type="hidden" name="id" value={page.id} />
                          <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                          <input type="hidden" name="column" value="analysis_level" />
                          <select
                            name="value"
                            className="block w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-soft"
                            defaultValue={page.analysis_level ?? ""}
                          >
                            <option value="">(none)</option>
                            {ANALYSIS_LEVEL_OPTIONS.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input type="checkbox" name="clear" /> Clear value
                          </label>
                          <Button type="submit">Save</Button>
                        </form>
                      </ColumnEditorDialog>
                    </div>
                  </div>
                  </div>
                </details>

                <details className="mt-2 rounded-md border border-border/70 p-2" open>
                  <summary className="cursor-pointer text-xs font-semibold">Template and Markdown Content</summary>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <div className="rounded-md border border-border/70 p-2 md:col-span-2">
                    <p className="text-xs font-medium">html_template (preview html)</p>
                    <p className="mt-1 text-xs text-muted-foreground">{compactValue(page.html_template, 160)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {canPreview ? (
                        <FormDialog title="Template Preview" description="Rendered preview" triggerLabel="Preview HTML" fullScreen allowBrowserFullscreen>
                          {unresolvedTokens.length > 0 ? (
                            <p className="mb-2 rounded-md border border-critical/30 bg-critical/10 px-3 py-2 text-xs text-critical">
                              Unresolved tokens: {unresolvedTokens.join(", ")}
                            </p>
                          ) : null}
                          <div className="rounded-lg border border-border/70 p-2">
                            <iframe title={`preview-${page.id}`} src={previewUrl} className="h-[calc(100vh-15rem)] w-full rounded-md bg-white" />
                          </div>
                        </FormDialog>
                      ) : (
                        <Button type="button" size="sm" variant="secondary" disabled>Preview (needs .html + .json)</Button>
                      )}
                      <ColumnEditorDialog title="Edit html_template" description="Edit HTML template" triggerLabel="View / Edit">
                        <form action={updatePageTemplateColumnAction} className="space-y-3">
                          <input type="hidden" name="id" value={page.id} />
                          <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                          <input type="hidden" name="column" value="html_template" />
                          <textarea
                            name="value"
                            rows={14}
                            defaultValue={page.html_template ?? ""}
                            className="block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                            required
                          />
                          <Button type="submit">Save</Button>
                        </form>
                      </ColumnEditorDialog>
                    </div>
                  </div>

                  <div className="rounded-md border border-border/70 p-2 md:col-span-2">
                    <p className="text-xs font-medium">readme_markdown (markdown)</p>
                    <p className="mt-1 text-xs text-muted-foreground">{compactValue(page.readme_markdown, 160)}</p>
                    <div className="mt-2">
                      <ColumnEditorDialog title="Edit readme_markdown" description="Markdown editor" triggerLabel="View / Edit">
                        <form action={updatePageTemplateColumnAction} className="space-y-3">
                          <input type="hidden" name="id" value={page.id} />
                          <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                          <input type="hidden" name="column" value="readme_markdown" />
                          <textarea
                            name="value"
                            rows={12}
                            defaultValue={page.readme_markdown ?? ""}
                            className="block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                          />
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input type="checkbox" name="clear" /> Clear value
                          </label>
                          <Button type="submit">Save</Button>
                        </form>
                      </ColumnEditorDialog>
                    </div>
                  </div>
                  </div>
                </details>

                <details className="mt-2 rounded-md border border-border/70 p-2" open>
                  <summary className="cursor-pointer text-xs font-semibold">JSON Schema and Prompt Settings</summary>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <div className="rounded-md border border-border/70 p-2 md:col-span-2">
                    <p className="text-xs font-medium">sample_data (jsonb)</p>
                    <p className="mt-1 text-xs text-muted-foreground">{compactValue(page.sample_data, 160)}</p>
                    <div className="mt-2">
                      <ColumnEditorDialog title="Edit sample_data" description="JSON editor" triggerLabel="View / Edit">
                        <form action={updatePageTemplateColumnAction} className="space-y-3">
                          <input type="hidden" name="id" value={page.id} />
                          <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                          <input type="hidden" name="column" value="sample_data" />
                          <textarea
                            name="value"
                            rows={12}
                            defaultValue={jsonToEditorText(page.sample_data)}
                            className="block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                          />
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input type="checkbox" name="clear" /> Clear value
                          </label>
                          <Button type="submit">Save</Button>
                        </form>
                      </ColumnEditorDialog>
                    </div>
                  </div>

                  <div className="rounded-md border border-border/70 p-2 md:col-span-2">
                    <p className="text-xs font-medium">gpt json schema (jsonb)</p>
                    <p className="mt-1 text-xs text-muted-foreground">{compactValue(page.gpt_json_schema, 160)}</p>
                    <div className="mt-2">
                      <ColumnEditorDialog title="Edit gpt json schema" description="JSON editor" triggerLabel="View / Edit">
                        <form action={updatePageTemplateColumnAction} className="space-y-3">
                          <input type="hidden" name="id" value={page.id} />
                          <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                          <input type="hidden" name="column" value="gpt_json_schema" />
                          <textarea
                            name="value"
                            rows={12}
                            defaultValue={jsonToEditorText(page.gpt_json_schema)}
                            className="block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                          />
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input type="checkbox" name="clear" /> Clear value
                          </label>
                          <Button type="submit" disabled={!supportsExtendedColumns}>Save</Button>
                        </form>
                      </ColumnEditorDialog>
                    </div>
                  </div>

                  <div className="rounded-md border border-border/70 p-2 md:col-span-2">
                    <p className="text-xs font-medium">Report_format (markdown)</p>
                    <p className="mt-1 text-xs text-muted-foreground">{compactValue(page.report_format, 160)}</p>
                    <div className="mt-2">
                      <ColumnEditorDialog title="Edit Report_format" description="Markdown editor" triggerLabel="View / Edit">
                        <form action={updatePageTemplateColumnAction} className="space-y-3">
                          <input type="hidden" name="id" value={page.id} />
                          <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                          <input type="hidden" name="column" value="report_format" />
                          <textarea
                            name="value"
                            rows={10}
                            defaultValue={page.report_format ?? ""}
                            className="block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                          />
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input type="checkbox" name="clear" /> Clear value
                          </label>
                          <Button type="submit" disabled={!supportsExtendedColumns}>Save</Button>
                        </form>
                      </ColumnEditorDialog>
                    </div>
                  </div>

                  <div className="rounded-md border border-border/70 p-2 md:col-span-2">
                    <p className="text-xs font-medium">system prompt (markdown)</p>
                    <p className="mt-1 text-xs text-muted-foreground">{compactValue(page.system_prompt, 160)}</p>
                    <div className="mt-2">
                      <ColumnEditorDialog title="Edit system prompt" description="Markdown editor" triggerLabel="View / Edit">
                        <form action={updatePageTemplateColumnAction} className="space-y-3">
                          <input type="hidden" name="id" value={page.id} />
                          <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                          <input type="hidden" name="column" value="system_prompt" />
                          <textarea
                            name="value"
                            rows={12}
                            defaultValue={page.system_prompt ?? ""}
                            className="block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                          />
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input type="checkbox" name="clear" /> Clear value
                          </label>
                          <Button type="submit" disabled={!supportsExtendedColumns}>Save</Button>
                        </form>
                      </ColumnEditorDialog>
                    </div>
                  </div>

                  <div className="rounded-md border border-border/70 p-2">
                    <p className="text-xs font-medium">execution_order (numeric)</p>
                    <p className="mt-1 text-xs text-muted-foreground">{compactValue(page.execution_order)}</p>
                    <div className="mt-2">
                      <ColumnEditorDialog title="Edit execution_order" description="Numeric value" triggerLabel="View / Edit">
                        <form action={updatePageTemplateColumnAction} className="space-y-3">
                          <input type="hidden" name="id" value={page.id} />
                          <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                          <input type="hidden" name="column" value="execution_order" />
                          <Input name="value" type="number" step="any" defaultValue={page.execution_order ?? ""} />
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input type="checkbox" name="clear" /> Clear value
                          </label>
                          <Button type="submit" disabled={!supportsExtendedColumns}>Save</Button>
                        </form>
                      </ColumnEditorDialog>
                    </div>
                  </div>
                  </div>
                </details>

                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={movePageTemplateAction}>
                    <input type="hidden" name="id" value={page.id} />
                    <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                    <input type="hidden" name="direction" value="up" />
                    <Button type="submit" size="sm" variant="secondary">Move Up</Button>
                  </form>
                  <form action={movePageTemplateAction}>
                    <input type="hidden" name="id" value={page.id} />
                    <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                    <input type="hidden" name="direction" value="down" />
                    <Button type="submit" size="sm" variant="secondary">Move Down</Button>
                  </form>
                  <form action={deletePageTemplateAction}>
                    <input type="hidden" name="id" value={page.id} />
                    <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                    <ConfirmSubmitDialogButton
                      type="submit"
                      size="sm"
                      variant="destructive"
                      confirmTitle="Delete page template"
                      confirmDescription="Delete this page template?"
                      confirmText="Delete"
                    >
                      Delete
                    </ConfirmSubmitDialogButton>
                  </form>
                </div>
              </div>
            );
            })() : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
