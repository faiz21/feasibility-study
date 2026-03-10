import Link from "next/link";
import { marked } from "marked";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportMarkdownChatRoom } from "@/components/admin/report-markdown-chat-room";

type AdminMarkdownPage = {
  id: string;
  page_order: number;
  raw_report: string | null;
  raw_report_id: string | null;
  raw_report_jp: string | null;
  overall: number | null;
  outline_alignment: number | null;
  writing_alignment: number | null;
  analysis_score: number | null;
  notes: string[] | null;
  page_summary: string | null;
  report_page_templates:
    | {
        page_key?: string | null;
        title?: string | null;
      }
    | Array<{
        page_key?: string | null;
        title?: string | null;
      }>
    | null;
};

function toPageTemplate(
  template: AdminMarkdownPage["report_page_templates"],
): { page_key?: string | null; title?: string | null } {
  return Array.isArray(template) ? (template[0] ?? {}) : (template ?? {});
}

function getLocaleMarkdown(page: AdminMarkdownPage, locale: string): string {
  if (locale === "id") return String(page.raw_report_id ?? "");
  if (locale === "ja") return String(page.raw_report_jp ?? "");
  return String(page.raw_report ?? "");
}

function hasLocaleMarkdown(page: AdminMarkdownPage, locale: string): boolean {
  return getLocaleMarkdown(page, locale).trim().length > 0;
}

function renderMarkdown(markdown: string): string {
  const text = String(markdown ?? "").trim();
  if (!text) return '<p class="text-sm text-muted-foreground">No markdown content for this locale/page.</p>';
  return marked.parse(text, { gfm: true, breaks: true }) as string;
}

function buildMarkdownViewerHtml(markdownHtml: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Markdown Preview</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      background: #ffffff;
      color: #0f172a;
      font: 15px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    h1,h2,h3,h4,h5,h6 { line-height: 1.25; margin: 1.2em 0 .55em; }
    p { margin: .6em 0 1em; }
    ul,ol { margin: .6em 0 1em 1.2em; padding: 0; }
    blockquote { margin: 1em 0; padding: .25em 1em; border-left: 4px solid #cbd5e1; color: #334155; }
    pre { overflow: auto; padding: 12px; border-radius: 8px; background: #0b1220; color: #e2e8f0; }
    code { font: 13px/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
    table { width: 100%; border-collapse: collapse; margin: 1em 0; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #f8fafc; }
    a { color: #1d4ed8; text-decoration: underline; }
    hr { border: 0; border-top: 1px solid #e2e8f0; margin: 1.2em 0; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${markdownHtml}
</body>
</html>`;
}

function buildHref(params: {
  reportId: string;
  clientId: string;
  granularityId: string;
  locale: string;
  pageId?: string;
}) {
  const pagePart = params.pageId ? `&page_id=${params.pageId}` : "";
  return `/admin/client-reports/${params.reportId}/markdown-preview?client_id=${params.clientId}&granularity_id=${params.granularityId}&locale=${params.locale}${pagePart}`;
}

export default async function AdminClientReportMarkdownPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ client_id?: string; granularity_id?: string; locale?: string; page_id?: string }>;
}) {
  const { user } = await requireRole("admin");
  const supabase = await createClient();
  const { reportId } = await params;
  const query = await searchParams;

  const clientId = query.client_id ?? "";
  const granularityId = query.granularity_id ?? "all";
  const locale = ["en", "id", "ja"].includes(query.locale ?? "") ? String(query.locale) : "en";
  const requestedPageId = String(query.page_id ?? "").trim();

  const [{ data: report }, { data: pages }] = await Promise.all([
    supabase
      .from("reports")
      .select("id,report_type_template_id")
      .eq("id", reportId)
      .maybeSingle(),
    supabase
      .from("report_pages")
      .select(
        "id,page_order,raw_report,raw_report_id,raw_report_jp,overall,outline_alignment,writing_alignment,analysis_score,notes,page_summary,report_page_templates(page_key,title)",
      )
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

  const rows = (pages ?? []) as AdminMarkdownPage[];
  const firstAvailable = rows.find((row) => hasLocaleMarkdown(row, locale));
  const selected =
    rows.find((row) => row.id === requestedPageId && hasLocaleMarkdown(row, locale)) ??
    firstAvailable ??
    rows[0] ??
    null;

  const selectedTemplate = selected ? toPageTemplate(selected.report_page_templates) : {};
  const selectedMarkdown = selected ? getLocaleMarkdown(selected, locale) : "";
  const renderedMarkdown = renderMarkdown(selectedMarkdown);
  const markdownViewerHtml = buildMarkdownViewerHtml(renderedMarkdown);

  const { data: reportType } = await supabase
    .from("report_type_templates")
    .select("name")
    .eq("id", report.report_type_template_id)
    .maybeSingle();
  const reportTypeName = reportType?.name;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Markdown Preview — ${reportTypeName ?? "Report"}`}
        description="Preview report page markdown content by locale."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/admin/client-reports?client_id=${clientId}&granularity_id=${granularityId}`}
          className="text-sm text-primary underline"
        >
          Back to Client Reports
        </Link>
        <Link
          href={`/admin/client-reports/${reportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${locale}`}
          className="text-sm text-primary underline"
        >
          Open Edit Content
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Language</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link
            href={buildHref({ reportId, clientId, granularityId, locale: "en", pageId: selected?.id })}
            className={`rounded px-3 py-1.5 text-xs ${locale === "en" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
          >
            EN
          </Link>
          <Link
            href={buildHref({ reportId, clientId, granularityId, locale: "id", pageId: selected?.id })}
            className={`rounded px-3 py-1.5 text-xs ${locale === "id" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
          >
            ID
          </Link>
          <Link
            href={buildHref({ reportId, clientId, granularityId, locale: "ja", pageId: selected?.id })}
            className={`rounded px-3 py-1.5 text-xs ${locale === "ja" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
          >
            JA
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {selectedTemplate?.title ?? "Page"}{" "}
                <span className="text-xs text-muted-foreground">({selectedTemplate?.page_key ?? "-"})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selected ? (
                <iframe
                  title={`markdown-preview-${selected.id}-${locale}`}
                  srcDoc={markdownViewerHtml}
                  className="h-[75vh] w-full rounded-md border border-border/70 bg-white"
                />
              ) : (
                <p className="text-sm text-muted-foreground">No page available for this locale.</p>
              )}
            </CardContent>
          </Card>

          {selected && locale === "en" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Review Chat (n8n)</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportMarkdownChatRoom
                  reportId={reportId}
                  userId={user.id}
                  pageId={selected.id}
                  initialEnMarkdown={String(selected.raw_report ?? "")}
                  initialScores={{
                    overall: selected.overall,
                    outline_alignment: selected.outline_alignment,
                    writing_alignment: selected.writing_alignment,
                    analysis_score: selected.analysis_score,
                    notes: Array.isArray(selected.notes) ? selected.notes : [],
                    page_summary: selected.page_summary,
                  }}
                />
              </CardContent>
            </Card>
          ) : null}

          {selected && locale !== "en" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Review Chat (n8n)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI Review Chat is available for EN only. Switch language to EN to use chat refinement.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="h-fit md:sticky md:top-20">
          <CardHeader>
            <CardTitle className="text-base">Pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pages found.</p>
            ) : null}
            {rows.map((row) => {
              const template = toPageTemplate(row.report_page_templates);
              const hasContent = hasLocaleMarkdown(row, locale);
              const isActive = selected?.id === row.id;
              const commonClasses = "block rounded-md border px-3 py-2 text-xs font-medium";

              if (!hasContent) {
                return (
                  <span
                    key={row.id}
                    className={`${commonClasses} cursor-not-allowed border-border/70 bg-muted text-muted-foreground opacity-80`}
                    title="No content for this locale"
                  >
                    {template?.page_key ?? `P${row.page_order}`} · {template?.title ?? "Untitled"}
                  </span>
                );
              }

              return (
                <Link
                  key={row.id}
                  href={buildHref({ reportId, clientId, granularityId, locale, pageId: row.id })}
                  className={`${commonClasses} ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
                >
                  {template?.page_key ?? `P${row.page_order}`} · {template?.title ?? "Untitled"}
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
