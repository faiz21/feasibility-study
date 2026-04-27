import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatCard } from "@/components/ui/dashboard";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, FolderOpen, Layers3 } from "lucide-react";
import { resolveReportsUiTheme, type ReportsUiTheme } from "@/lib/report-view-theme";
import { ClientReportLandingCover } from "@/components/report/cover/client-report-landing-cover";
import { withAlpha } from "@/lib/portal-theme";

type AccessTemplate = {
  id: string;
  name: string;
  granularity_id: string;
  category: string | null;
};

type EntityRow = {
  id: string;
  name: string;
  description?: string | null;
  granularity_id: string;
  photo_url?: string | null;
};

type ReportPageRow = {
  report_id: string;
  page_order: number;
  report_page_templates:
    | {
        page_key: string;
        title: string;
      }
    | Array<{
        page_key: string;
        title: string;
      }>
    | null;
};

function formatMonthYear(input?: string | null): string {
  if (!input) return "-";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" })
    .format(date)
    .replace(" ", "-");
}

function normalizeScopes(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function isSafeAssetUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  if (value.startsWith("/")) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function resolveClientAssetUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return encodeURI(trimmed);
  }
  const supabaseBase = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  if (trimmed.startsWith("/storage/v1/object/public/")) {
    if (!supabaseBase) return null;
    return encodeURI(`${supabaseBase.replace(/\/$/, "")}${trimmed}`);
  }
  if (trimmed.startsWith("/")) {
    return encodeURI(trimmed);
  }
  if (!trimmed.includes("/")) return null;
  if (!supabaseBase) return null;
  return encodeURI(`${supabaseBase.replace(/\/$/, "")}/storage/v1/object/public/${trimmed.replace(/^\/+/, "")}`);
}

function getCategoryBadgeStyle(category: string | null, theme: ReportsUiTheme) {
  switch (category) {
    case "Digital Solution":
      return { borderColor: withAlpha(theme.info, "66"), background: withAlpha(theme.info, "22"), color: theme.info };
    case "Automation":
      return { borderColor: withAlpha(theme.success, "66"), background: withAlpha(theme.success, "22"), color: theme.success };
    case "General":
      return { borderColor: withAlpha(theme.borderStrong, "AA"), background: theme.surfaceMuted, color: theme.textPrimary };
    case "Sales & Marketing":
      return { borderColor: withAlpha(theme.warning, "66"), background: withAlpha(theme.warning, "22"), color: theme.warning };
    case "Tech":
      return {
        borderColor: withAlpha(theme.accent, "66"),
        background: `linear-gradient(90deg, ${withAlpha(theme.accent, "22")}, ${withAlpha(theme.info, "22")})`,
        color: theme.textPrimary,
      };
    case "Cybersecurity":
      return {
        borderColor: withAlpha(theme.critical, "66"),
        background: withAlpha(theme.critical, "22"),
        color: theme.critical,
      };
    default:
      return {
        borderColor: withAlpha(theme.accent, "66"),
        background: theme.accentSoft,
        color: theme.accent,
      };
  }
}

export default async function ReportsPage() {
  const { profile } = await requireRole("client");
  const supabase = await createClient();

  const [
    { data: accessData },
    { data: clientReportRows },
    { data: granularityAccessRows },
    { data: granularities },
    { data: entities },
    { data: clientRow },
  ] = await Promise.all([
    supabase
      .from("client_report_type_access")
      .select(`
      report_type_template_id,
      report_type_templates (
        id, name, category, description, granularity_id
      )
    `)
      .eq("client_id", profile.client_id),
    supabase
      .from("client_reports")
      .select("report_id")
      .eq("client_id", profile.client_id),
    supabase
      .from("client_granularity_access")
      .select("granularity_id")
      .eq("client_id", profile.client_id),
    supabase.from("granularities").select("id,name,code"),
    supabase
      .from("report_entities")
      .select("id,name,description,granularity_id,photo_url")
      .eq("client_id", profile.client_id)
      .order("name", { ascending: true }),
    supabase
      .from("clients")
      .select(
        "id,name,code,domain,logo_url,company_description,project_description,objective,scopes,project_start,project_end,cover_photo_url",
      )
      .eq("id", profile.client_id)
      .maybeSingle(),
  ]);

  const assignedReportIds = (clientReportRows ?? []).map((row) => row.report_id);
  const { data: assignedReports } = assignedReportIds.length
    ? await supabase
        .from("reports")
        .select("id,report_type_template_id,entity_id,status")
        .in("id", assignedReportIds)
    : {
        data: [] as Array<{
          id: string;
          report_type_template_id: string;
          entity_id: string;
          status: string;
        }>,
      };

  const { data: reportPages } = assignedReportIds.length
    ? await supabase
        .from("report_pages")
        .select("report_id,page_order,report_page_templates(page_key,title)")
        .in("report_id", assignedReportIds)
        .order("page_order", { ascending: true })
    : { data: [] as ReportPageRow[] };

  const templatesById = new Map<string, AccessTemplate>();
  (accessData ?? []).forEach((access) => {
    const template = Array.isArray(access.report_type_templates)
      ? access.report_type_templates[0]
      : access.report_type_templates;
    if (!template?.id) return;
    templatesById.set(template.id, {
      id: template.id,
      name: template.name,
      granularity_id: template.granularity_id,
      category: template.category ?? null,
    });
  });

  const configuredGranularityIds = new Set((granularityAccessRows ?? []).map((row) => row.granularity_id));

  const granularityLabelById = new Map(
    (granularities ?? []).map((row) => [
      row.id,
      `${row.name}${row.code ? ` (${row.code})` : ""}`,
    ]),
  );

  const groupedByGranularity = new Map<string, EntityRow[]>();
  (entities ?? [])
    .filter((entity) => configuredGranularityIds.has(entity.granularity_id))
    .forEach((entity) => {
      const existing = groupedByGranularity.get(entity.granularity_id) ?? [];
      existing.push({
        id: entity.id,
        name: entity.name,
        description: entity.description ?? null,
        granularity_id: entity.granularity_id,
        photo_url: resolveClientAssetUrl(entity.photo_url),
      });
      groupedByGranularity.set(entity.granularity_id, existing);
    });

  const reportByEntityAndType = new Map<
    string,
    { id: string; status: string }
  >();
  (assignedReports ?? []).forEach((report) => {
    reportByEntityAndType.set(`${report.entity_id}:${report.report_type_template_id}`, {
      id: report.id,
      status: report.status,
    });
  });

  const pagesByReportId = new Map<string, Array<{ pageKey: string; title: string; pageOrder: number }>>();
  (reportPages ?? []).forEach((row) => {
    const template = Array.isArray(row.report_page_templates)
      ? row.report_page_templates[0]
      : row.report_page_templates;
    if (!template?.page_key) return;
    const existing = pagesByReportId.get(row.report_id) ?? [];
    existing.push({
      pageKey: template.page_key,
      title: template.title,
      pageOrder: row.page_order,
    });
    pagesByReportId.set(row.report_id, existing);
  });

  const groupedEntries = Array.from(configuredGranularityIds)
    .sort((a, b) => {
      const labelA = granularityLabelById.get(a) ?? a;
      const labelB = granularityLabelById.get(b) ?? b;
      return labelA.localeCompare(labelB);
    })
    .map((granularityId) => [granularityId, groupedByGranularity.get(granularityId) ?? []] as const);

  const publishedReportsCount = (assignedReports ?? []).filter((report) => report.status === "published").length;
  const entitiesCount = (entities ?? []).filter((entity) => configuredGranularityIds.has(entity.granularity_id)).length;
  const scopes = normalizeScopes(clientRow?.scopes);
  const reportsTheme = resolveReportsUiTheme();
  const clientLogoUrl = resolveClientAssetUrl(clientRow?.logo_url);
  const clientCoverPhotoUrl = resolveClientAssetUrl(clientRow?.cover_photo_url);

  return (
    <div
      className="space-y-6"
      style={{
        color: reportsTheme.textPrimary,
      }}
    >
      <ClientReportLandingCover
        clientName={clientRow?.name ?? "Client"}
        companyDescription={
          clientRow?.company_description ??
          `Client code: ${clientRow?.code ?? "-"}${clientRow?.domain ? ` · Domain: ${clientRow.domain}` : ""}`
        }
        projectDescription={clientRow?.project_description}
        objective={clientRow?.objective}
        scopes={scopes}
        projectPeriodLabel={`Project period: ${formatMonthYear(clientRow?.project_start)} to ${formatMonthYear(clientRow?.project_end)}`}
        logoUrl={clientLogoUrl}
        coverPhotoUrl={clientCoverPhotoUrl}
        colors={{
          primary: reportsTheme.accent,
          secondary: reportsTheme.textSecondary,
          accent: reportsTheme.info,
          background: reportsTheme.surface,
          foreground: reportsTheme.textPrimary,
          border: reportsTheme.borderStrong,
          muted: reportsTheme.surfaceMuted,
          "card-foreground": reportsTheme.surfaceElevated,
          "muted-foreground": reportsTheme.textSecondary,
          "cover-background": reportsTheme.accent,
          "cover-overlay": withAlpha(reportsTheme.textPrimary, "AA"),
          "cover-title": reportsTheme.accentContrast,
          "cover-subtitle": reportsTheme.accentSoft,
          "section-body": reportsTheme.textSecondary,
        }}
      />

      <PageHeader
        title="Feasibility Study Report"
        description="Browse configured granularities, entities, and accessible report types."
        className="rounded-[1.5rem] border border-border/80 bg-card/80 p-5"
      />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Configured Granularities", value: groupedEntries.length },
          { label: "Entities", value: entitiesCount },
          { label: "Enabled Reports", value: publishedReportsCount },
        ].map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} className="border-border/80" />
        ))}
      </section>

      {groupedEntries.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            <FolderOpen className="mx-auto h-12 w-12 opacity-50 mb-3" />
            <p>No granularity is configured for your client yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {groupedEntries.map(([granularityId, entities]) => (
            <Card
              key={granularityId}
              style={{
                borderColor: reportsTheme.borderStrong,
                background: `linear-gradient(180deg, ${reportsTheme.surfaceElevated}, ${reportsTheme.surface})`,
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex min-w-0 select-none flex-wrap items-center gap-2 text-lg tracking-tight" style={{ color: reportsTheme.textPrimary }}>
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border"
                    style={{
                      borderColor: reportsTheme.borderStrong,
                      background: reportsTheme.surfaceMuted,
                    }}
                  >
                    <Layers3 className="h-4 w-4" style={{ color: reportsTheme.accent }} />
                  </span>
                  <span className="min-w-0 break-words font-semibold">{granularityLabelById.get(granularityId) ?? granularityId}</span>
                  <Badge
                    variant="secondary"
                    className="shrink-0"
                    style={{
                      borderColor: reportsTheme.borderStrong,
                      background: reportsTheme.surfaceMuted,
                      color: reportsTheme.textSecondary,
                    }}
                  >
                    {entities.length} entities
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {entities.map((entity) => {
                    const accessibleTemplates = Array.from(templatesById.values()).filter(
                      (template) => template.granularity_id === entity.granularity_id,
                    );

                    return (
                      <Card
                        key={entity.id}
                        className="border shadow-none"
                        style={{
                          borderColor: reportsTheme.border,
                          background: reportsTheme.surfaceElevated,
                        }}
                      >
                        {isSafeAssetUrl(entity.photo_url) ? (
                          <div
                            className="h-28 w-full rounded-t-xl border-b bg-cover bg-center bg-no-repeat"
                            style={{
                              borderColor: reportsTheme.border,
                              backgroundImage: `url("${entity.photo_url}")`,
                            }}
                            aria-label={`${entity.name} thumbnail`}
                            role="img"
                          />
                        ) : null}
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-2">
                            <Building2 className="mt-1 h-4 w-4 shrink-0" style={{ color: reportsTheme.accent }} />
                            <div className="min-w-0">
                              <CardTitle
                                className="break-words text-lg font-semibold tracking-tight"
                                style={{ color: reportsTheme.textPrimary }}
                              >
                                {entity.description?.trim() || entity.name}
                              </CardTitle>
                              {entity.description?.trim() ? (
                                <p className="text-sm font-medium" style={{ color: reportsTheme.textSecondary }}>
                                  {entity.name}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {accessibleTemplates.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No report type access configured.</p>
                          ) : (
                            accessibleTemplates.map((template) => {
                              const targetReport = reportByEntityAndType.get(`${entity.id}:${template.id}`);
                              const isPublished = targetReport?.status === "published";
                              const reportPagesForRow = targetReport ? (pagesByReportId.get(targetReport.id) ?? []) : [];
                              return isPublished && targetReport ? (
                                <Link
                                  key={`${entity.id}-${template.id}`}
                                  href={`/reports/${template.id}/${targetReport.id}`}
                                  className="flex min-w-0 flex-col gap-3 rounded-[1.1rem] border px-4 py-3 text-sm transition-all duration-200 hover:-translate-y-0.5"
                                  style={{
                                    borderColor: reportsTheme.borderStrong,
                                    background: reportsTheme.surfaceMuted,
                                    color: reportsTheme.textPrimary,
                                  }}
                                >
                                  <span className="flex min-w-0 flex-col gap-2">
                                    <span className="flex min-w-0 flex-wrap items-center gap-2">
                                      <FileText className="h-3.5 w-3.5" style={{ color: reportsTheme.accent }} />
                                      {template.category ? (
                                        <Badge
                                          className="shrink-0 border"
                                          style={getCategoryBadgeStyle(template.category, reportsTheme)}
                                        >
                                          {template.category}
                                        </Badge>
                                      ) : null}
                                      <span className="min-w-0 break-words font-medium" style={{ color: reportsTheme.textPrimary }}>
                                        {template.name}
                                      </span>
                                    </span>
                                    <span className="flex flex-wrap gap-1.5">
                                      {reportPagesForRow.length > 0 ? (
                                        reportPagesForRow.map((page) => (
                                          <span
                                            key={`${targetReport.id}-${page.pageOrder}-${page.pageKey}`}
                                            className="rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em]"
                                            style={{
                                              borderColor: reportsTheme.borderStrong,
                                              background: reportsTheme.surfaceElevated,
                                              color: reportsTheme.textSecondary,
                                            }}
                                            title={page.title}
                                          >
                                            {page.pageKey}
                                          </span>
                                        ))
                                      ) : (
                                        <span
                                          className="text-sm font-medium"
                                          style={{ color: reportsTheme.textSecondary }}
                                        >
                                          No report pages found
                                        </span>
                                      )}
                                    </span>
                                  </span>
                                  <span className="flex flex-wrap items-center gap-2">
                                    <Badge
                                      className="shrink-0 border"
                                      style={{
                                        borderColor: reportsTheme.borderStrong,
                                        background: reportsTheme.accentSoft,
                                        color: reportsTheme.accent,
                                      }}
                                    >
                                      Enabled
                                    </Badge>
                                    <span className="text-xs font-medium uppercase tracking-[0.14em]" style={{ color: reportsTheme.textSecondary }}>
                                      {reportPagesForRow.length} pages
                                    </span>
                                  </span>
                                </Link>
                              ) : (
                                <div
                                  key={`${entity.id}-${template.id}`}
                                  className="pointer-events-none flex min-w-0 flex-wrap items-center gap-2 rounded-[1.1rem] border border-dashed border-border/60 px-4 py-3 text-sm"
                                  style={{
                                    borderColor: reportsTheme.border,
                                    background: reportsTheme.surfaceElevated,
                                    color: reportsTheme.textSecondary,
                                    opacity: 0.9,
                                  }}
                                >
                                  <span className="flex min-w-0 flex-wrap items-center gap-2">
                                    {template.category ? (
                                      <Badge
                                        className="shrink-0 border"
                                        style={getCategoryBadgeStyle(template.category, reportsTheme)}
                                      >
                                        {template.category}
                                      </Badge>
                                    ) : null}
                                    <span className="min-w-0 break-words font-medium">{template.name}</span>
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {entities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No entities are configured for this granularity.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
