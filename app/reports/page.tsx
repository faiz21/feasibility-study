import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/dashboard";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, FolderOpen, Layers3 } from "lucide-react";
import { resolveClientTheme, type ClientThemeColors } from "@/lib/client-theme";
import { ClientReportLandingCover } from "@/components/report/cover/client-report-landing-cover";

type AccessTemplate = {
  id: string;
  name: string;
  granularity_id: string;
  category: string | null;
};

type EntityRow = {
  id: string;
  name: string;
  granularity_id: string;
  photo_url?: string | null;
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

function getCategoryBadgeStyle(
  category: string | null,
  colors: ClientThemeColors,
) {
  switch (category) {
    case "Digital Solution":
      return { borderColor: `${colors.info}50`, background: `${colors.info}18`, color: colors.info };
    case "Automation":
      return { borderColor: `${colors.success}55`, background: `${colors.success}18`, color: colors.success };
    case "General":
      return { borderColor: `${colors.secondary}35`, background: colors.muted, color: colors.foreground };
    case "Sales & Marketing":
      return { borderColor: `${colors.warning}55`, background: `${colors.warning}22`, color: colors.warning };
    case "Tech":
      return {
        borderColor: `${colors.accent}50`,
        background: `linear-gradient(90deg, ${colors.primary}18, ${colors.accent}1A)`,
        color: colors.foreground,
      };
    case "Cybersecurity":
      return {
        borderColor: `${colors.critical}60`,
        background: `${colors.critical}18`,
        color: colors.critical,
      };
    default:
      return {
        borderColor: `${colors["tag-background"]}66`,
        background: colors["tag-background"],
        color: colors["tag-foreground"],
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
      .select("id,name,granularity_id,photo_url")
      .eq("client_id", profile.client_id)
      .order("name", { ascending: true }),
    supabase
      .from("clients")
      .select(
        "id,name,code,domain,logo_url,color_palette,theme_tokens,company_description,project_description,objective,scopes,project_start,project_end,cover_photo_url",
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
        granularity_id: entity.granularity_id,
        photo_url: entity.photo_url,
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
  const theme = resolveClientTheme(clientRow?.theme_tokens, clientRow?.color_palette);
  const clientPalette = theme.palette;
  const clientColors = theme.colors;
  const clientLogoUrl = resolveClientAssetUrl(clientRow?.logo_url);
  const clientCoverPhotoUrl = resolveClientAssetUrl(clientRow?.cover_photo_url);

  return (
    <div
      className="space-y-6"
      style={{
        color: clientPalette.text,
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
          primary: clientPalette.primary,
          secondary: clientPalette.secondary,
          accent: clientPalette.accent,
          background: clientColors.background,
          foreground: clientColors.foreground,
          border: clientColors.border,
          muted: clientColors.muted,
          "card-foreground": clientColors["card-foreground"],
          "muted-foreground": clientColors["muted-foreground"],
          "cover-background": clientColors["cover-background"],
          "cover-overlay": clientColors["cover-overlay"],
          "cover-title": clientColors["cover-title"],
          "cover-subtitle": clientColors["cover-subtitle"],
          "section-body": clientColors["section-body"],
        }}
      />

      <PageHeader
        title="Feasibility Study Report"
        description="Browse configured granularities, entities, and accessible report types."
        className="rounded-xl border p-4"
        style={{
          borderColor: `${clientPalette.primary}28`,
          background: `linear-gradient(180deg, ${clientPalette.primary}08, ${clientPalette.background})`,
        }}
      />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Configured Granularities", value: groupedEntries.length },
          { label: "Entities", value: entitiesCount },
          { label: "Enabled Reports", value: publishedReportsCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-4 shadow-soft"
            style={{
              borderColor: `${clientPalette.primary}33`,
              background: `linear-gradient(180deg, ${clientPalette.primary}0D, ${clientPalette.background})`,
            }}
          >
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: `${clientPalette.secondary}` }}>
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight" style={{ color: clientColors["kpi-value"] }}>
              {stat.value}
            </p>
          </div>
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
                borderColor: `${clientPalette.primary}35`,
                background: `linear-gradient(180deg, ${clientPalette.primary}0A, ${clientPalette.background})`,
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Layers3 className="h-4 w-4" style={{ color: clientPalette.primary }} />
                  {granularityLabelById.get(granularityId) ?? granularityId}
                  <Badge
                    variant="secondary"
                    className="border"
                    style={{
                      borderColor: `${clientPalette.primary}33`,
                      background: `${clientPalette.primary}1A`,
                      color: clientPalette.primary,
                    }}
                  >
                    {entities.length} entities
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {entities.map((entity) => {
                    const accessibleTemplates = Array.from(templatesById.values()).filter(
                      (template) => template.granularity_id === entity.granularity_id,
                    );

                    return (
                      <Card
                        key={entity.id}
                        className="border"
                        style={{
                          borderColor: `${clientPalette.primary}30`,
                          background: `${clientPalette.background}`,
                        }}
                      >
                        {isSafeAssetUrl(entity.photo_url) ? (
                          <div
                            className="h-28 w-full rounded-t-xl border-b bg-cover bg-center bg-no-repeat"
                            style={{
                              borderColor: `${clientPalette.primary}20`,
                              backgroundImage: `url("${entity.photo_url}")`,
                            }}
                            aria-label={`${entity.name} thumbnail`}
                            role="img"
                          />
                        ) : null}
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Building2 className="h-4 w-4" style={{ color: clientPalette.primary }} />
                            {entity.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {accessibleTemplates.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No report type access configured.</p>
                          ) : (
                            accessibleTemplates.map((template) => {
                              const targetReport = reportByEntityAndType.get(`${entity.id}:${template.id}`);
                              const isPublished = targetReport?.status === "published";
                              return isPublished && targetReport ? (
                                <Link
                                  key={`${entity.id}-${template.id}`}
                                  href={`/reports/${template.id}/${targetReport.id}`}
                                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors"
                                  style={{
                                    borderColor: `${clientPalette.primary}33`,
                                    background: `${clientPalette.primary}08`,
                                  }}
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <FileText className="h-3.5 w-3.5" style={{ color: clientPalette.primary }} />
                                    {template.category ? (
                                      <Badge
                                        className="border px-1.5 py-0 text-[10px] font-medium"
                                        style={getCategoryBadgeStyle(template.category, clientColors)}
                                      >
                                        {template.category}
                                      </Badge>
                                    ) : null}
                                    <span>{template.name}</span>
                                  </span>
                                  <Badge
                                    className="border"
                                    style={{
                                      borderColor: `${clientPalette.primary}33`,
                                      background: `${clientPalette.primary}1A`,
                                      color: clientPalette.primary,
                                    }}
                                  >
                                    Enabled
                                  </Badge>
                                </Link>
                              ) : (
                                <div
                                  key={`${entity.id}-${template.id}`}
                                  className="pointer-events-none flex items-center justify-between rounded-md border border-dashed border-border/60 px-3 py-2 text-sm text-muted-foreground opacity-60"
                                  style={{
                                    borderColor: `${clientPalette.primary}30`,
                                    background: `${clientPalette.background}`,
                                  }}
                                >
                                  <span className="inline-flex items-center gap-2">
                                    {template.category ? (
                                      <Badge
                                        className="border px-1.5 py-0 text-[10px] font-medium"
                                        style={getCategoryBadgeStyle(template.category, clientColors)}
                                      >
                                        {template.category}
                                      </Badge>
                                    ) : null}
                                    <span>{template.name}</span>
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
