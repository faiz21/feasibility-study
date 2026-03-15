import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportMarkdownChatRoom } from "@/components/admin/report-markdown-chat-room";
import { RunnerActionButton } from "@/components/admin/runner-action-button";
import { ReportMarkdownLocaleWorkbench } from "@/components/admin/report-markdown-locale-workbench";
import { Badge } from "@/components/ui/badge";

type AdminMarkdownPage = {
  id: string;
  page_order: number;
  report_page_template_id: string | null;
  en_content: unknown;
  id_content: unknown;
  ja_content: unknown;
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

type ReportRow = {
  id: string;
  report_type_template_id: string | null;
  entity_id: string | null;
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

function getLocaleJsonText(page: AdminMarkdownPage, locale: string): string {
  const content =
    locale === "id"
      ? page.id_content
      : locale === "ja"
        ? page.ja_content
        : page.en_content;

  return JSON.stringify(content ?? {}, null, 2);
}

function hasEnJsonContent(page: AdminMarkdownPage): boolean {
  if (page.en_content === null || page.en_content === undefined) return false;
  if (typeof page.en_content === "string") return page.en_content.trim().length > 0;
  if (Array.isArray(page.en_content)) return page.en_content.length > 0;
  if (typeof page.en_content === "object") return Object.keys(page.en_content).length > 0;
  return true;
}

function hasRawReport(page: AdminMarkdownPage): boolean {
  return typeof page.raw_report === "string" && page.raw_report.trim().length > 0;
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

function getScoreLabel(score: number | null): string {
  return typeof score === "number" && Number.isFinite(score) ? `${Math.max(0, Math.min(100, score))}` : "No score";
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

  const clientIdFromQuery = query.client_id ?? "";
  const granularityId = query.granularity_id ?? "all";
  const locale = ["en", "id", "ja"].includes(query.locale ?? "") ? String(query.locale) : "en";
  const requestedPageId = String(query.page_id ?? "").trim();

  const { data: reportById } = await supabase
    .from("reports")
    .select("id,report_type_template_id,entity_id")
    .eq("id", reportId)
    .maybeSingle();

  let resolvedReport = reportById as ReportRow | null;
  if (!resolvedReport) {
    const { data: fallbackByEntity } = await supabase
      .from("reports")
      .select("id,report_type_template_id,entity_id")
      .eq("entity_id", reportId)
      .order("created_at", { ascending: false })
      .limit(1);
    resolvedReport = (fallbackByEntity?.[0] as ReportRow | undefined) ?? null;
  }

  if (!resolvedReport) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-critical">Report not found.</p>
        <Link href="/admin/client-reports" className="text-sm text-primary underline">
          Back to Client Reports
        </Link>
      </div>
    );
  }

  const reportRow = resolvedReport;
  const resolvedReportId = reportRow.id;
  const { data: pages } = await supabase
    .from("report_pages")
    .select(
      "id,page_order,report_page_template_id,en_content,id_content,ja_content,raw_report,raw_report_id,raw_report_jp,overall,outline_alignment,writing_alignment,analysis_score,notes,page_summary,report_page_templates(page_key,title)",
    )
    .eq("report_id", resolvedReportId)
    .order("page_order", { ascending: true });

  let clientId = clientIdFromQuery;
  if (!clientId && reportRow.entity_id) {
    const { data: entityRow } = await supabase
      .from("report_entities")
      .select("client_id")
      .eq("id", reportRow.entity_id)
      .maybeSingle();
    clientId = String(entityRow?.client_id ?? "");
  }
  const rows = (pages ?? []) as AdminMarkdownPage[];
  const enJsonCount = rows.filter(hasEnJsonContent).length;
  const rawReportCount = rows.filter(hasRawReport).length;
  const firstAvailable = rows.find((row) => hasLocaleMarkdown(row, locale));
  const selected =
    rows.find((row) => row.id === requestedPageId) ??
    firstAvailable ??
    rows[0] ??
    null;

  const selectedTemplate = selected ? toPageTemplate(selected.report_page_templates) : {};
  const selectedMarkdown = selected ? getLocaleMarkdown(selected, locale) : "";
  const selectedJsonText = selected ? getLocaleJsonText(selected, locale) : "{}";

  const { data: reportType } = await supabase
    .from("report_type_templates")
    .select("name")
    .eq("id", reportRow.report_type_template_id)
    .maybeSingle();
  const reportTypeName = reportType?.name ?? null;

  const reportRunnerDisabled = !reportRow.report_type_template_id || !reportRow.entity_id || !clientId;

  return (
    <div className="mx-auto w-full max-w-[2200px] space-y-6 px-1 sm:px-2 lg:px-3 2xl:px-4">
      <PageHeader
        title={`Markdown Preview — ${reportTypeName ?? "Report"}`}
        description="Edit locale markdown and JSON content side by side while reviewing the live markdown preview."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/admin/client-reports?client_id=${clientId}&granularity_id=${granularityId}`}
          className="text-sm text-primary underline"
        >
          Back to Client Reports
        </Link>
        <Link
          href={`/admin/client-reports/${resolvedReportId}/edit?client_id=${clientId}&granularity_id=${granularityId}&locale=${locale}`}
          className="text-sm text-primary underline"
        >
          Open Edit Content
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-base">Report Template</CardTitle>
              <p className="text-sm text-muted-foreground">
                {reportTypeName ?? "Unknown template"}{" "}
                <span className="text-xs">(ID: {reportRow.report_type_template_id ?? "-"})</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Report ID: {resolvedReportId} | Entity ID: {reportRow.entity_id ?? "-"} | Client ID: {clientId || "-"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <RunnerActionButton
                endpoint="/api/admin/report-runner"
                label="Run Report Runner"
                payload={{ reportId: resolvedReportId, clientId, pageId: selected?.id ?? "" }}
                disabled={reportRunnerDisabled}
                disabledReason="Missing report_type_template_id, entity_id, or client_id"
                confirmMessage="Run Report Runner now? This will trigger AI processing and may rewrite report content."
              />
              <RunnerActionButton
                endpoint="/api/admin/report-json-runner"
                label="Run Report JSON"
                payload={{ reportId: resolvedReportId }}
                disabled={!resolvedReportId}
                disabledReason="Missing report ID"
                confirmMessage="Run Report JSON now? This will trigger AI translation/JSON generation."
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">Locale Workspace</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Coverage counters stay pinned to EN source readiness while the workspace below switches by locale.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={enJsonCount === rows.length && rows.length > 0
                  ? "border-transparent bg-success text-success-foreground hover:bg-success"
                  : "border-transparent bg-warning text-warning-foreground hover:bg-warning"}
              >
                EN JSON {enJsonCount}/{rows.length || 0}
              </Badge>
              <Badge
                className={rawReportCount === rows.length && rows.length > 0
                  ? "border-transparent bg-success text-success-foreground hover:bg-success"
                  : "border-transparent bg-warning text-warning-foreground hover:bg-warning"}
              >
                EN Markdown {rawReportCount}/{rows.length || 0}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link
            href={buildHref({ reportId: resolvedReportId, clientId, granularityId, locale: "en", pageId: selected?.id })}
            className={`rounded px-3 py-1.5 text-xs ${locale === "en" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
          >
            EN
          </Link>
          <Link
            href={buildHref({ reportId: resolvedReportId, clientId, granularityId, locale: "id", pageId: selected?.id })}
            className={`rounded px-3 py-1.5 text-xs ${locale === "id" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
          >
            ID
          </Link>
          <Link
            href={buildHref({ reportId: resolvedReportId, clientId, granularityId, locale: "ja", pageId: selected?.id })}
            className={`rounded px-3 py-1.5 text-xs ${locale === "ja" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
          >
            JA
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="h-fit xl:sticky xl:top-20">
          <CardHeader>
            <CardTitle className="text-base">Pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {rows.length === 0 ? <p className="text-sm text-muted-foreground">No pages found.</p> : null}
            {rows.map((row) => {
              const template = toPageTemplate(row.report_page_templates);
              const hasContent = hasLocaleMarkdown(row, locale);
              const isActive = selected?.id === row.id;
              const pageRunnerDisabled = !reportRow.entity_id || !reportRow.report_type_template_id || !clientId || !row.report_page_template_id;
              const score = getScoreLabel(row.overall);

              return (
                <div
                  key={row.id}
                  className={`rounded-xl border p-3 transition-colors ${isActive ? "border-primary bg-primary/5" : "border-border/70 bg-card"}`}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <Link
                      href={buildHref({ reportId: resolvedReportId, clientId, granularityId, locale, pageId: row.id })}
                      className={`block text-sm font-semibold tracking-tight ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
                    >
                      {template?.page_key ?? `P${row.page_order}`}
                    </Link>
                    <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {score}
                    </span>
                  </div>

                  <p className="mb-3 line-clamp-2 text-xs leading-5 text-muted-foreground">{template?.title ?? "Untitled"}</p>

                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge
                      className={hasEnJsonContent(row)
                        ? "border-transparent bg-success text-success-foreground hover:bg-success"
                        : "border-transparent bg-warning text-warning-foreground hover:bg-warning"}
                    >
                      EN JSON
                    </Badge>
                    <Badge
                      className={hasRawReport(row)
                        ? "border-transparent bg-success text-success-foreground hover:bg-success"
                        : "border-transparent bg-warning text-warning-foreground hover:bg-warning"}
                    >
                      EN Markdown
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <RunnerActionButton
                      endpoint="/api/admin/page-runner"
                      label="Run Page Runner"
                      variant="secondary"
                      size="sm"
                      className="h-7 px-2.5 text-[11px]"
                      payload={{ reportId: resolvedReportId, pageId: row.id, clientId }}
                      disabled={pageRunnerDisabled}
                      disabledReason="Missing template/entity/client/page_template_id"
                      confirmMessage="Run Page Runner for this page? This will trigger AI processing and may rewrite page content."
                    />
                    <RunnerActionButton
                      endpoint="/api/admin/page-json-runner"
                      label="Run Page JSON"
                      variant="secondary"
                      size="sm"
                      className="h-7 px-2.5 text-[11px]"
                      payload={{ reportId: resolvedReportId, pageId: row.id }}
                      disabled={!resolvedReportId || !row.id}
                      disabledReason="Missing report or page ID"
                      confirmMessage="Run Page JSON for this page? This will trigger AI translation/JSON generation for this page."
                    />
                  </div>

                  {!hasContent ? (
                    <p className="mt-2 text-[11px] text-muted-foreground">No content for current locale.</p>
                  ) : null}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base">
                {selectedTemplate?.title ?? "Page"}{" "}
                <span className="text-xs text-muted-foreground">({selectedTemplate?.page_key ?? "-"})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-5 md:pt-0 2xl:p-6 2xl:pt-0">
              {selected ? (
                <ReportMarkdownLocaleWorkbench
                  reportId={resolvedReportId}
                  pageId={selected.id}
                  locale={locale as "en" | "id" | "ja"}
                  initialMarkdown={selectedMarkdown}
                  initialJsonText={selectedJsonText}
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
                  key={selected.id}
                  reportId={resolvedReportId}
                  userId={user.id}
                  pageId={selected.id}
                  initialEnMarkdown={String(selected.raw_report ?? "")}
                  initialScores={{
                    overall: selected.overall,
                    outline_alignment: selected.outline_alignment,
                    writing_alignment: selected.writing_alignment,
                    analysis_score: selected.analysis_score,
                    notes: Array.isArray(selected.notes) ? selected.notes : [],
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
      </div>
    </div>
  );
}
