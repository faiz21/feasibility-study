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

async function readUploadedText(formData: FormData, key: string): Promise<string | null> {
  const value = formData.get(key);
  if (!(value instanceof File) || value.size <= 0) return null;
  const text = (await value.text()).trim();
  return text.length > 0 ? text : null;
}

function parseJsonOrRedirect(jsonText: string, reportTypeId: string): unknown {
  try {
    return JSON.parse(jsonText);
  } catch {
    redirect(`/admin/report-types/${reportTypeId}/pages?error=Invalid+JSON+in+sample+data`);
  }
}

function normalizeTemplateForPreview(template: string): string {
  return template;
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
  const sampleData = sampleDataText ? parseJsonOrRedirect(sampleDataText, reportTypeId) : null;

  if (!reportTypeId || !pageKey || !title || !htmlTemplate || !Number.isFinite(pageOrder)) {
    redirect(`/admin/report-types/${reportTypeId}/pages?error=Missing+required+fields+(HTML+is+required)`);
  }

  const { error } = await supabase.from("report_page_templates").insert({
    report_type_template_id: reportTypeId,
    page_key: pageKey,
    page_order: pageOrder,
    title,
    html_template: htmlTemplate,
    readme_markdown: readmeMarkdown,
    sample_data: sampleData,
  });

  if (error) redirect(`/admin/report-types/${reportTypeId}/pages?error=${encodeURIComponent(error.message)}`);

  revalidatePath(`/admin/report-types/${reportTypeId}/pages`);
  redirect(`/admin/report-types/${reportTypeId}/pages?success=Page+created`);
}

async function updatePageTemplateAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const reportTypeId = String(formData.get("report_type_template_id") ?? "");
  const pageKey = String(formData.get("page_key") ?? "").trim();
  const pageOrder = Number(formData.get("page_order") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const htmlTextFromFile = await readUploadedText(formData, "html_file");
  const htmlTextManual = String(formData.get("html_template") ?? "").trim();
  const htmlTemplate = htmlTextFromFile ?? (htmlTextManual.length > 0 ? htmlTextManual : null);
  const readmeTextFromFile = await readUploadedText(formData, "readme_file");
  const clearReadme = formData.get("clear_readme") === "on";
  const readmeMarkdownText = String(formData.get("readme_markdown") ?? "").trim();
  const readmeMarkdown = clearReadme
    ? null
    : readmeTextFromFile ?? (readmeMarkdownText.length > 0 ? readmeMarkdownText : undefined);
  const sampleDataTextFromFile = await readUploadedText(formData, "sample_data_file");
  const clearSampleData = formData.get("clear_sample_data") === "on";
  const sampleDataTextManual = String(formData.get("sample_data_json") ?? "").trim();
  const sampleDataText = sampleDataTextFromFile ?? (sampleDataTextManual.length > 0 ? sampleDataTextManual : null);
  const sampleData = clearSampleData
    ? null
    : sampleDataText
      ? parseJsonOrRedirect(sampleDataText, reportTypeId)
      : undefined;

  if (!id || !reportTypeId || !pageKey || !title || !Number.isFinite(pageOrder)) {
    redirect(`/admin/report-types/${reportTypeId}/pages?error=Missing+required+fields`);
  }

  if (htmlTemplate === null) {
    const { data: existing } = await supabase
      .from("report_page_templates")
      .select("html_template")
      .eq("id", id)
      .eq("report_type_template_id", reportTypeId)
      .maybeSingle();

    if (!existing?.html_template) {
      redirect(`/admin/report-types/${reportTypeId}/pages?error=Missing+HTML+template+(upload+or+paste+HTML)`);
    }
  }

  const updates: Record<string, unknown> = {
    page_key: pageKey,
    page_order: pageOrder,
    title,
    updated_at: new Date().toISOString(),
  };

  if (htmlTemplate !== null) {
    updates.html_template = htmlTemplate;
  }

  if (readmeMarkdown !== undefined) {
    updates.readme_markdown = readmeMarkdown;
  }

  if (sampleData !== undefined) {
    updates.sample_data = sampleData;
  }

  const { error } = await supabase
    .from("report_page_templates")
    .update(updates)
    .eq("id", id);

  if (error) redirect(`/admin/report-types/${reportTypeId}/pages?error=${encodeURIComponent(error.message)}`);

  revalidatePath(`/admin/report-types/${reportTypeId}/pages`);
  redirect(`/admin/report-types/${reportTypeId}/pages?success=Page+updated`);
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

export default async function ReportTypePagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportTypeId: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  await requireRole("admin");
  const supabase = await createClient();
  const { reportTypeId } = await params;
  const query = await searchParams;

  const [{ data: reportType }, { data: pages }] = await Promise.all([
    supabase
      .from("report_type_templates")
      .select("id,name,category")
      .eq("id", reportTypeId)
      .maybeSingle(),
    supabase
      .from("report_page_templates")
      .select("id,page_key,page_order,title,html_template,readme_markdown,sample_data")
      .eq("report_type_template_id", reportTypeId)
      .order("page_order", { ascending: true }),
  ]);

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

  const nextOrder = Math.max(0, ...(pages ?? []).map((page) => page.page_order)) + 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Manage Pages — ${reportType.name}`}
        description={`Category: ${reportType.category}`}
      />
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
              <summary className="cursor-pointer text-sm font-medium">
                Manual code editors (optional)
              </summary>
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
              </div>
            </details>
            <Button type="submit">Add Page</Button>
          </form>
        </FormDialog>
      </div>
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
          <CardTitle className="text-base">Page List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(pages?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">Add your first page template.</p>
          ) : null}
          {(pages ?? []).map((page) => (
            <div key={page.id} className="rounded-xl border border-border/70 p-3">
              {(() => {
                const canPreview = Boolean(page.html_template && page.sample_data);
                const normalizedHtml = normalizeTemplateForPreview(page.html_template ?? "");
                const sampleForPreview = coerceSampleData(page.sample_data);
                const hasContract = hasReferenceContract(sampleForPreview);
                const tokens = extractTokens(normalizedHtml);
                const unresolvedTokens = tokens.filter((token) => !hasValueByPath(sampleForPreview, token));
                const previewUrl = `/admin/report-types/${reportTypeId}/pages/${page.id}/preview`;
                const templateUrl = `/admin/report-types/${reportTypeId}/pages/${page.id}/template`;
                const sampleDataUrl = `/admin/report-types/${reportTypeId}/pages/${page.id}/sample-data`;
                return (
                  <>
              <p className="text-sm font-medium">
                #{page.page_order} · {page.page_key} · {page.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Assets: HTML {page.html_template ? "✓" : "✗"} · README {page.readme_markdown ? "✓" : "✗"} · Sample JSON {page.sample_data ? "✓" : "✗"}
              </p>
              <p className={`mt-1 text-xs ${hasContract ? "text-success" : "text-warning"}`}>
                {hasContract
                  ? "Reference contract: Ready for content upload"
                  : "Reference contract: Missing template JSON object/array"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {canPreview ? (
                  <FormDialog
                    title="Template Preview"
                    description="Preview is enabled when HTML template and sample JSON exist."
                    triggerLabel="Preview"
                    fullScreen
                    allowBrowserFullscreen
                  >
                    {unresolvedTokens.length > 0 ? (
                      <p className="mb-2 rounded-md border border-critical/30 bg-critical/10 px-3 py-2 text-xs text-critical">
                        Unresolved tokens: {unresolvedTokens.join(", ")}
                      </p>
                    ) : null}
                    <div className="rounded-lg border border-border/70 p-2">
                      <iframe
                        title={`preview-${page.id}`}
                        src={previewUrl}
                        className="h-[calc(100vh-15rem)] w-full rounded-md bg-white"
                      />
                    </div>
                  </FormDialog>
                ) : (
                  <Button type="button" size="sm" variant="secondary" disabled>
                    Preview (needs .html + .json)
                  </Button>
                )}
                <FormDialog title="Edit Page Template" description="Update key, order, title, and assets." triggerLabel="Edit">
                  <form action={updatePageTemplateAction} className="space-y-2" encType="multipart/form-data">
                    <input type="hidden" name="id" value={page.id} />
                    <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                    <div className="grid gap-2 md:grid-cols-3">
                      <Input name="page_key" defaultValue={page.page_key} required />
                      <Input name="page_order" type="number" defaultValue={page.page_order} min={1} required />
                      <Input name="title" defaultValue={page.title} required />
                    </div>
                    <div className="block text-sm">
                      Upload HTML template (.html)
                      <input
                        type="file"
                        name="html_file"
                        accept=".html,.hml,text/html,text/plain"
                        className="mt-1 block w-full rounded-lg border border-input bg-card p-2 text-xs shadow-soft"
                      />
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Want the current template?{" "}
                        <Link href={templateUrl} target="_blank" className="text-primary underline">
                          Open raw HTML
                        </Link>
                      </span>
                    </div>
                    <div className="block text-sm">
                      Upload README (.md)
                      <input
                        type="file"
                        name="readme_file"
                        accept=".md,.markdown,text/markdown,text/plain"
                        className="mt-1 block w-full rounded-lg border border-input bg-card p-2 text-xs shadow-soft"
                      />
                      <div className="mt-2">
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          <input type="checkbox" name="clear_readme" />
                          Clear README
                        </label>
                      </div>
                    </div>
                    <div className="block text-sm">
                      Upload sample data (.json)
                      <input
                        type="file"
                        name="sample_data_file"
                        accept=".json,application/json,text/json,text/plain"
                        className="mt-1 block w-full rounded-lg border border-input bg-card p-2 text-xs shadow-soft"
                      />
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Want the current sample data?{" "}
                        <Link href={sampleDataUrl} target="_blank" className="text-primary underline">
                          Open sample JSON
                        </Link>
                      </span>
                      <div className="mt-2">
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          <input type="checkbox" name="clear_sample_data" />
                          Clear sample JSON
                        </label>
                      </div>
                    </div>
                    <details className="rounded-lg border border-border/70 p-3">
                      <summary className="cursor-pointer text-sm font-medium">
                        Manual code editors (optional)
                      </summary>
                      <div className="mt-3 space-y-3">
                        <label className="block text-sm">
                          HTML Template (manual)
                          <textarea
                            name="html_template"
                            rows={8}
                            className="mt-1 block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                            placeholder="Leave blank to keep existing. Paste new HTML here to replace."
                          />
                        </label>
                        <label className="block text-sm">
                          README (.md) manual
                          <textarea
                            name="readme_markdown"
                            rows={4}
                            className="mt-1 block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                            placeholder="Leave blank to keep existing. Paste new README here to replace."
                          />
                        </label>
                        <label className="block text-sm">
                          Sample data (.json) manual
                          <textarea
                            name="sample_data_json"
                            rows={4}
                            className="mt-1 block w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-soft"
                            placeholder='Leave blank to keep existing. Paste new JSON here to replace. Example: {"title":"Example"}'
                          />
                        </label>
                      </div>
                    </details>
                    <Button type="submit">Save Changes</Button>
                  </form>
                </FormDialog>
                <form action={movePageTemplateAction}>
                  <input type="hidden" name="id" value={page.id} />
                  <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                  <input type="hidden" name="direction" value="up" />
                  <Button type="submit" size="sm" variant="secondary">
                    Move Up
                  </Button>
                </form>
                <form action={movePageTemplateAction}>
                  <input type="hidden" name="id" value={page.id} />
                  <input type="hidden" name="report_type_template_id" value={reportTypeId} />
                  <input type="hidden" name="direction" value="down" />
                  <Button type="submit" size="sm" variant="secondary">
                    Move Down
                  </Button>
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
                  </>
                );
              })()}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
