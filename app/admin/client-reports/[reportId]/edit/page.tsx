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
import { resolveClientTheme, type ClientThemeColors } from "@/lib/client-theme";
import { hasReferenceContract, validateJsonAgainstReference } from "@/lib/report-json-contract";
import { marked } from "marked";
import { StatusBanner } from "@/components/ui/status-banner";

async function readUploadedText(formData: FormData, key: string): Promise<string | null> {
  const value = formData.get(key);
  if (!(value instanceof File) || value.size <= 0) return null;
  const text = (await value.text()).trim();
  return text.length > 0 ? text : null;
}

function toObject(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  return input as Record<string, unknown>;
}

function isEmptyObject(input: Record<string, unknown> | null): boolean {
  if (!input) return true;
  return Object.keys(input).length === 0;
}

function buildThemeTokens(colors: ClientThemeColors) {
  const cssVars: Record<string, string> = {};
  Object.entries(colors).forEach(([key, value]) => {
    cssVars[`--client-${key}`] = value;
  });
  cssVars["--client-text"] = colors.foreground;
  return cssVars;
}

function toCssVarBlock(tokens: Record<string, string>) {
  return Object.entries(tokens)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
}

function attachBranding(content: unknown, branding: Record<string, unknown>) {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return { ...(content as Record<string, unknown>), ...branding };
  }
  return { content, ...branding };
}

function renderMarkdownPreview(markdown: string | null | undefined): string {
  const text = String(markdown ?? "").trim();
  if (!text) {
    return '<p class="text-sm text-muted-foreground">No markdown content available.</p>';
  }
  return marked.parse(text, { gfm: true, breaks: true }) as string;
}

async function updatePageAllLocalesJsonAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const supabase = await createClient();

  const reportId = String(formData.get("report_id") ?? "").trim();
  const pageId = String(formData.get("page_id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const granularityId = String(formData.get("granularity_id") ?? "all").trim();
  const previewLocale = String(formData.get("preview_locale") ?? "en").trim();
  const enUploaded = await readUploadedText(formData, "en_json_file");
  const idUploaded = await readUploadedText(formData, "id_json_file");
  const jaUploaded = await readUploadedText(formData, "ja_json_file");

  if (!reportId || !pageId) {
    redirect("/admin/client-reports?error=Invalid+multi-locale+json+update+request");
  }
  if (!enUploaded && !idUploaded && !jaUploaded) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${previewLocale}&error=Upload+at+least+one+locale+JSON+file+for+this+page`,
    );
  }

  const { data: currentPage, error: currentPageError } = await supabase
    .from("report_pages")
    .select("page_order,en_content,id_content,ja_content,report_page_templates(page_key,sample_data)")
    .eq("id", pageId)
    .eq("report_id", reportId)
    .maybeSingle();

  if (currentPageError || !currentPage) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${previewLocale}&error=${encodeURIComponent(
        currentPageError?.message ?? "Page not found",
      )}`,
    );
  }

  const templateRow = currentPage.report_page_templates as
    | { page_key?: string; sample_data?: unknown }[]
    | { page_key?: string; sample_data?: unknown }
    | null;
  const template = Array.isArray(templateRow) ? templateRow[0] : templateRow;
  const reference = template?.sample_data;
  const pageKey = template?.page_key ?? `page-${currentPage.page_order}`;

  if (!hasReferenceContract(reference)) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${previewLocale}&error=${encodeURIComponent(
        `Template JSON reference missing for ${pageKey}`,
      )}`,
    );
  }

  let nextEn: unknown = currentPage.en_content ?? {};
  let nextId: unknown = currentPage.id_content ?? {};
  let nextJa: unknown = currentPage.ja_content ?? {};
  const updatedLocales: string[] = [];

  if (enUploaded) {
    try {
      nextEn = JSON.parse(enUploaded);
    } catch {
      redirect(
        `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${previewLocale}&error=Invalid+JSON+format+for+EN+file`,
      );
    }
    const validation = validateJsonAgainstReference(reference, nextEn);
    if (!validation.ok) {
      redirect(
        `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${previewLocale}&error=${encodeURIComponent(
          `EN file does not match template JSON: ${validation.error}`,
        )}`,
      );
    }
    updatedLocales.push("EN");
  }

  if (idUploaded) {
    try {
      nextId = JSON.parse(idUploaded);
    } catch {
      redirect(
        `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${previewLocale}&error=Invalid+JSON+format+for+ID+file`,
      );
    }
    const validation = validateJsonAgainstReference(reference, nextId);
    if (!validation.ok) {
      redirect(
        `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${previewLocale}&error=${encodeURIComponent(
          `ID file does not match template JSON: ${validation.error}`,
        )}`,
      );
    }
    updatedLocales.push("ID");
  }

  if (jaUploaded) {
    try {
      nextJa = JSON.parse(jaUploaded);
    } catch {
      redirect(
        `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${previewLocale}&error=Invalid+JSON+format+for+JA+file`,
      );
    }
    const validation = validateJsonAgainstReference(reference, nextJa);
    if (!validation.ok) {
      redirect(
        `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${previewLocale}&error=${encodeURIComponent(
          `JA file does not match template JSON: ${validation.error}`,
        )}`,
      );
    }
    updatedLocales.push("JA");
  }

  const { error } = await supabase
    .from("report_pages")
    .update({
      en_content: nextEn,
      id_content: nextId,
      ja_content: nextJa,
      updated_at: new Date().toISOString(),
    })
    .eq("id", pageId)
    .eq("report_id", reportId);

  if (error) {
    redirect(
      `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${previewLocale}&error=${encodeURIComponent(
        error.message,
      )}`,
    );
  }

  revalidatePath(`/admin/client-reports/${reportId}/edit`);
  revalidatePath(`/reports/${reportId}`);
  redirect(
    `/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${previewLocale}&success=${encodeURIComponent(
      `Page ${currentPage.page_order} updated for locales: ${updatedLocales.join(", ")}`,
    )}`,
  );
}

export default async function AdminClientReportEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{
    client_id?: string;
    granularity_id?: string;
    locale?: string;
    success?: string;
    error?: string;
    md_preview?: string;
    md_page?: string;
  }>;
}) {
  await requireRole("admin");
  const supabase = await createClient();
  const { reportId } = await params;
  const query = await searchParams;
  const clientId = query.client_id ?? "";
  const granularityId = query.granularity_id ?? "all";
  const locale = ["en", "id", "ja"].includes(query.locale ?? "") ? String(query.locale) : "en";
  const markdownPreviewMode = ["en", "id"].includes(query.md_preview ?? "") ? String(query.md_preview) : "none";
  const markdownPreviewPageId = String(query.md_page ?? "").trim();

  const [{ data: report }, { data: pages }, { data: clientRow }] = await Promise.all([
    supabase
      .from("reports")
      .select("id,status,entity_id,report_type_template_id")
      .eq("id", reportId)
      .maybeSingle(),
    supabase
      .from("report_pages")
      .select("id,page_order,en_content,id_content,ja_content,raw_report,raw_report_id,report_page_templates(page_key,title,html_template,sample_data)")
      .eq("report_id", reportId)
      .order("page_order", { ascending: true }),
    clientId
      ? supabase
          .from("clients")
          .select("id,name,code,domain,default_locale,logo_url,color_palette,theme_tokens")
          .eq("id", clientId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
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

  const theme = resolveClientTheme(clientRow?.theme_tokens, clientRow?.color_palette);
  const themeTokens = buildThemeTokens(theme.colors);
  const brandingPayload = {
    client: {
      id: clientRow?.id ?? clientId,
      name: clientRow?.name ?? "",
      code: clientRow?.code ?? "",
      domain: clientRow?.domain ?? "",
      default_locale: clientRow?.default_locale ?? locale,
      logo_url: clientRow?.logo_url ?? "",
      color_palette: theme.palette,
      theme_tokens: clientRow?.theme_tokens ?? null,
    },
    theme: theme.palette,
    theme_tokens: clientRow?.theme_tokens ?? null,
    theme_css_vars: toCssVarBlock(themeTokens),
    branding: {
      logo_url: clientRow?.logo_url ?? "",
      ...theme.palette,
    },
  };

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
        <StatusBanner tone="success">{query.success}</StatusBanner>
      ) : null}
      {query.error ? (
        <StatusBanner tone="critical">{query.error}</StatusBanner>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rendered Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-border/70 p-2">
            <span className="text-xs text-muted-foreground">Preview Locale:</span>
            <Link
              href={`/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=en`}
              className={`rounded px-2 py-1 text-xs ${locale === "en" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
            >
              EN
            </Link>
            <Link
              href={`/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=id`}
              className={`rounded px-2 py-1 text-xs ${locale === "id" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
            >
              ID
            </Link>
            <Link
              href={`/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=ja`}
              className={`rounded px-2 py-1 text-xs ${locale === "ja" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
            >
              JA
            </Link>
          </div>
          {(pages ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No report pages available for preview.</p>
          ) : null}
          {(pages ?? []).map((page, pageIndex) => {
            const template = Array.isArray(page.report_page_templates)
              ? page.report_page_templates[0]
              : page.report_page_templates;
            const htmlTemplate = template?.html_template ?? "";
            const isMarkdownPreviewOpen =
              markdownPreviewPageId === page.id && (markdownPreviewMode === "en" || markdownPreviewMode === "id");
            const markdownPreviewLabel = markdownPreviewMode === "id" ? "ID" : "EN";
            const markdownPreviewSource = markdownPreviewMode === "id" ? page.raw_report_id : page.raw_report;
            const markdownPreviewHtml = isMarkdownPreviewOpen ? renderMarkdownPreview(markdownPreviewSource) : "";
            const localeContent =
              locale === "id"
                ? (page.id_content ?? page.en_content)
                : locale === "ja"
                  ? (page.ja_content ?? page.en_content)
                  : page.en_content;
            const localeObject = toObject(localeContent);
            const sampleObject = toObject(template?.sample_data);
            const content = !isEmptyObject(localeObject) ? localeObject : (sampleObject ?? localeObject ?? {});
            const rendered = renderTemplate(htmlTemplate, attachBranding(content, brandingPayload));
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
                    action={updatePageAllLocalesJsonAction}
                    className="mb-4 space-y-2 rounded-md border border-border/70 p-3"
                    encType="multipart/form-data"
                  >
                    <input type="hidden" name="report_id" value={reportId} />
                    <input type="hidden" name="page_id" value={page.id} />
                    <input type="hidden" name="client_id" value={clientId} />
                    <input type="hidden" name="granularity_id" value={granularityId} />
                    <input type="hidden" name="preview_locale" value={locale} />
                    <p className="text-xs text-muted-foreground">
                      Per-page multi-locale upload. Upload one or more locale JSON files for this page.
                    </p>
                    <div className="grid gap-3 lg:grid-cols-3">
                      <label className="block text-xs">
                        JA JSON file
                        <Input
                          name="ja_json_file"
                          type="file"
                          accept=".json,application/json,text/plain"
                          className="mt-1"
                        />
                      </label>
                      <label className="block text-xs">
                        EN JSON file
                        <Input
                          name="en_json_file"
                          type="file"
                          accept=".json,application/json,text/plain"
                          className="mt-1"
                        />
                      </label>
                      <label className="block text-xs">
                        ID JSON file
                        <Input
                          name="id_json_file"
                          type="file"
                          accept=".json,application/json,text/plain"
                          className="mt-1"
                        />
                      </label>
                    </div>
                    <Button type="submit" size="sm" variant="secondary">
                      Save Page Files (JA/EN/ID)
                    </Button>
                  </form>
                  <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-border/70 p-2">
                    <span className="text-xs text-muted-foreground">Markdown Preview:</span>
                    <Link
                      href={`/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${locale}&md_preview=en&md_page=${page.id}`}
                      className={`rounded px-2 py-1 text-xs ${isMarkdownPreviewOpen && markdownPreviewMode === "en" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                    >
                      Preview Markdown (EN)
                    </Link>
                    <Link
                      href={`/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${locale}&md_preview=id&md_page=${page.id}`}
                      className={`rounded px-2 py-1 text-xs ${isMarkdownPreviewOpen && markdownPreviewMode === "id" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                    >
                      Preview Markdown (ID)
                    </Link>
                    {isMarkdownPreviewOpen ? (
                      <Link
                        href={`/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${locale}&md_preview=none`}
                        className="rounded bg-muted px-2 py-1 text-xs text-foreground"
                      >
                        Hide Markdown Preview
                      </Link>
                    ) : null}
                  </div>
                  {isMarkdownPreviewOpen ? (
                    <div className="mb-4 rounded-md border border-border/70 bg-card p-3">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Markdown Preview ({markdownPreviewLabel})
                      </p>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: markdownPreviewHtml }}
                      />
                    </div>
                  ) : null}
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
