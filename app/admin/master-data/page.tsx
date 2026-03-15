import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/portal/auth";
import { PageHeader, StatCard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHead,
  DataGridRow,
  DataGridTable,
} from "@/components/ui/data-grid";

type AnyRow = Record<string, unknown>;

const GPT_JSON_SCHEMA_KEY = "gpt json schema";
const REPORT_FORMAT_KEY = "Report_format";
const SYSTEM_PROMPT_KEY = "system prompt";

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as Record<string, unknown>).length === 0;
  return false;
}

function toPct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Number(((part / total) * 100).toFixed(1));
}

function filledPct(rows: AnyRow[], key: string): number {
  if (rows.length === 0) return 0;
  const filled = rows.filter((row) => !isBlank(row[key])).length;
  return toPct(filled, rows.length);
}

function blankPct(rows: AnyRow[], key: string): number {
  if (rows.length === 0) return 0;
  const blank = rows.filter((row) => isBlank(row[key])).length;
  return toPct(blank, rows.length);
}

function hasColumn(rows: AnyRow[], key: string): boolean {
  return rows.some((row) => Object.prototype.hasOwnProperty.call(row, key));
}

export default async function AdminMasterDataPage() {
  await requireRole("admin");
  const supabase = await createClient();

  const [{ data: templateRows }, { data: entityRows }, { data: reportPageRows }] = await Promise.all([
    supabase.from("report_page_templates").select("*").order("created_at", { ascending: false }).limit(2000),
    supabase.from("report_entities").select("*").order("created_at", { ascending: false }).limit(2000),
    supabase.from("report_pages").select("*").order("created_at", { ascending: false }).limit(20000),
  ]);

  const templates = (templateRows ?? []) as AnyRow[];
  const entities = (entityRows ?? []) as AnyRow[];
  const pages = (reportPageRows ?? []) as AnyRow[];

  const templateHasAnalysisLevel = hasColumn(templates, "analysis_level");
  const templateHasGptSchema = hasColumn(templates, GPT_JSON_SCHEMA_KEY);
  const templateHasReportFormat = hasColumn(templates, REPORT_FORMAT_KEY);
  const templateHasSystemPrompt = hasColumn(templates, SYSTEM_PROMPT_KEY);
  const templateHasReadme = hasColumn(templates, "readme_markdown");

  const templateAnalysisPct = templateHasAnalysisLevel ? filledPct(templates, "analysis_level") : 0;
  const templateGptSchemaPct = templateHasGptSchema ? filledPct(templates, GPT_JSON_SCHEMA_KEY) : 0;
  const templateSampleDataPct = filledPct(templates, "sample_data");
  const templateHtmlPct = filledPct(templates, "html_template");
  const templateReportFormatBlankPct = templateHasReportFormat ? blankPct(templates, REPORT_FORMAT_KEY) : 100;
  const templateSystemPromptBlankPct = templateHasSystemPrompt ? blankPct(templates, SYSTEM_PROMPT_KEY) : 100;
  const templateReadmeBlankPct = templateHasReadme ? blankPct(templates, "readme_markdown") : 100;

  const entityHasDataset = hasColumn(entities, "dataset");
  const entityDatasetBlankPct = entityHasDataset ? blankPct(entities, "dataset") : 100;

  const groupedByReport = new Map<string, AnyRow[]>();
  pages.forEach((row) => {
    const reportId = String(row.report_id ?? "");
    if (!reportId) return;
    const existing = groupedByReport.get(reportId) ?? [];
    existing.push(row);
    groupedByReport.set(reportId, existing);
  });

  const perReportRows = Array.from(groupedByReport.entries()).map(([reportId, rows]) => ({
    reportId,
    totalPages: rows.length,
    rawEnBlankPct: blankPct(rows, "raw_report"),
    rawIdBlankPct: blankPct(rows, "raw_report_id"),
    rawJpBlankPct: blankPct(rows, "raw_report_jp"),
    enJsonBlankPct: blankPct(rows, "en_content"),
    idJsonBlankPct: blankPct(rows, "id_content"),
    jaJsonBlankPct: blankPct(rows, "ja_content"),
  }))
    .sort((a, b) => {
      const aScore = a.rawEnBlankPct + a.rawIdBlankPct + a.rawJpBlankPct + a.enJsonBlankPct + a.idJsonBlankPct + a.jaJsonBlankPct;
      const bScore = b.rawEnBlankPct + b.rawIdBlankPct + b.rawJpBlankPct + b.enJsonBlankPct + b.idJsonBlankPct + b.jaJsonBlankPct;
      return bScore - aScore;
    });

  const templateIssues = templates.filter((row) => {
    const missingAnalysis = templateHasAnalysisLevel && isBlank(row.analysis_level);
    const missingSchema = templateHasGptSchema && isBlank(row[GPT_JSON_SCHEMA_KEY]);
    const missingSample = isBlank(row.sample_data);
    const missingHtml = isBlank(row.html_template);
    const reportFormatBlank = templateHasReportFormat && isBlank(row[REPORT_FORMAT_KEY]);
    const systemPromptBlank = templateHasSystemPrompt && isBlank(row[SYSTEM_PROMPT_KEY]);
    const readmeBlank = templateHasReadme && isBlank(row.readme_markdown);
    return missingAnalysis || missingSchema || missingSample || missingHtml || reportFormatBlank || systemPromptBlank || readmeBlank;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data Monitor"
        description="Data quality and completeness checks for report templates, entities, and report pages."
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Template Rows" value={templates.length} />
        <StatCard label="Entity Rows" value={entities.length} />
        <StatCard label="Report Page Rows" value={pages.length} />
        <StatCard label="Reports in Pages Table" value={groupedByReport.size} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">1) report_page_templates Quality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="analysis_level Filled %" value={`${templateAnalysisPct}%`} />
            <StatCard label="gpt json schema Filled %" value={`${templateGptSchemaPct}%`} />
            <StatCard label="sample_data Filled %" value={`${templateSampleDataPct}%`} />
            <StatCard label="html_template Filled %" value={`${templateHtmlPct}%`} />
            <StatCard label="Report_format Blank %" value={`${templateReportFormatBlankPct}%`} />
            <StatCard label="system prompt Blank %" value={`${templateSystemPromptBlankPct}%`} />
            <StatCard label="readme_markdown Blank %" value={`${templateReadmeBlankPct}%`} />
          </div>
          <p className="text-xs text-muted-foreground">
            Column availability: analysis_level {templateHasAnalysisLevel ? "present" : "missing"} · gpt json schema {templateHasGptSchema ? "present" : "missing"} · Report_format {templateHasReportFormat ? "present" : "missing"} · system prompt {templateHasSystemPrompt ? "present" : "missing"} · readme_markdown {templateHasReadme ? "present" : "missing"}
          </p>
          <p className="text-xs text-muted-foreground">
            Rows with any issue: {templateIssues.length}/{templates.length}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">2) report_entities Quality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="dataset Blank %" value={`${entityDatasetBlankPct}%`} />
            <StatCard label="dataset Column" value={entityHasDataset ? "present" : "missing"} />
          </div>
          <p className="text-xs text-muted-foreground">
            If `dataset` column is missing, this monitor reports blank as 100%.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">3) report_pages Blank Percentiles Per Report</CardTitle>
        </CardHeader>
        <CardContent>
          {perReportRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No report pages found.</p>
          ) : (
            <DataGrid>
              <DataGridTable>
                <DataGridHead>
                  <DataGridRow className="border-t-0">
                    <DataGridCell header>Report ID</DataGridCell>
                    <DataGridCell header>Pages</DataGridCell>
                    <DataGridCell header>raw_report Blank %</DataGridCell>
                    <DataGridCell header>raw_report_id Blank %</DataGridCell>
                    <DataGridCell header>raw_report_jp Blank %</DataGridCell>
                    <DataGridCell header>en_content Blank %</DataGridCell>
                    <DataGridCell header>id_content Blank %</DataGridCell>
                    <DataGridCell header>ja_content Blank %</DataGridCell>
                  </DataGridRow>
                </DataGridHead>
                <DataGridBody>
                  {perReportRows.map((row) => (
                    <DataGridRow key={row.reportId}>
                      <DataGridCell className="font-mono text-xs">{row.reportId}</DataGridCell>
                      <DataGridCell>{row.totalPages}</DataGridCell>
                      <DataGridCell>{row.rawEnBlankPct}%</DataGridCell>
                      <DataGridCell>{row.rawIdBlankPct}%</DataGridCell>
                      <DataGridCell>{row.rawJpBlankPct}%</DataGridCell>
                      <DataGridCell>{row.enJsonBlankPct}%</DataGridCell>
                      <DataGridCell>{row.idJsonBlankPct}%</DataGridCell>
                      <DataGridCell>{row.jaJsonBlankPct}%</DataGridCell>
                    </DataGridRow>
                  ))}
                </DataGridBody>
              </DataGridTable>
            </DataGrid>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
