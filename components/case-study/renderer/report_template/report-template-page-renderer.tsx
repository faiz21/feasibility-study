import { AlertTriangle } from "lucide-react";

import { Charts } from "@/components/report/chart/charts";
import { ResultMetricCard } from "@/components/report/metric/result-metric-card";
import { GaugeNarativeGridBlock } from "@/components/report/metric/gauge-narative-grid-block";
import { BulletSummaryBlock } from "@/components/report/list/bullet-summary-block";
import { SquareNumberedList } from "@/components/report/list/square-numbered-list";
import { MultiColumnSection } from "@/components/report/section/multi-column-section";
import { Table } from "@/components/report/table/table";
import { NarrativeBlock } from "@/components/report/text/narrative-block";
type ReportTemplateBlock = {
  type: string;
  id: string;
  data: Record<string, unknown>;
};

type ReportTemplatePage = {
  pageTitle: string;
  layout: ReportTemplateBlock[];
};

type ReportTemplatePageRendererProps = {
  document: unknown;
};

function isReportTemplatePage(input: unknown): input is ReportTemplatePage {
  if (!input || typeof input !== "object") return false;
  const page = input as { pageTitle?: unknown; layout?: unknown[] };
  if (typeof page.pageTitle !== "string" || !Array.isArray(page.layout)) return false;
  return page.layout.every((b) => b && typeof b === "object" && typeof (b as { id?: unknown }).id === "string" && typeof (b as { type?: unknown }).type === "string");
}

function blockView(block: ReportTemplateBlock) {
  const data = block.data as Record<string, unknown>;

  switch (block.type) {
    case "report.layout.watermark":
      return (
        <section className="col-span-12 rounded-2xl border border-dashed border-border/80 bg-surface-soft/70 p-3 text-xs text-muted-foreground">
          Watermark: {String(data.patternKey ?? "pattern")} (opacity {String(data.opacity ?? "n/a")})
        </section>
      );

    case "report.layout.headerBar":
      return (
        <section className="col-span-12 rounded-2xl border border-brand/20 bg-brand px-5 py-4 text-white">
          <p className="text-xs uppercase tracking-[0.16em] text-white/70">Header</p>
          <p className="mt-1 text-lg font-bold">{String(data.headerLabel ?? "Report Header")}</p>
        </section>
      );

    case "report.layout.footerStrip": {
      const contacts = Array.isArray(data.contacts) ? data.contacts : [];
      return (
        <section className="col-span-12 rounded-2xl border border-border/80 bg-surface-soft/70 px-5 py-3 text-sm text-foreground">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {contacts.map((c, i) => {
              if (!c || typeof c !== "object") return null;
              const kind = String((c as { kind?: unknown }).kind ?? "contact");
              const value = String((c as { value?: unknown }).value ?? "-");
              return (
                <span key={`${kind}-${i}`}>
                  <strong>{kind}:</strong> {value}
                </span>
              );
            })}
          </div>
        </section>
      );
    }

    case "report.text.narrativeBlock": {
      const title = typeof data.title === "string" ? data.title : "Overview";
      const content = typeof data.content === "string" ? data.content : "No narrative provided.";
      const bullets = Array.isArray(data.bullets) ? data.bullets.map((b) => String(b)) : [];
      return (
        <>
          <NarrativeBlock title={title} content={content} size="sm" gridSpan={{ base: 12, lg: 7 }} />
          {bullets.length > 0 ? (
            <BulletSummaryBlock title="Key Points" bullets={bullets} gridSpan={{ base: 12, lg: 5 }} />
          ) : null}
        </>
      );
    }

    case "report.section.multiColumn": {
      const leftData = (data.left && typeof data.left === "object") ? (data.left as Record<string, unknown>) : {};
      const rightData = (data.right && typeof data.right === "object") ? (data.right as Record<string, unknown>) : {};
      const leftTitle = typeof leftData.title === "string" ? leftData.title : "Left";
      const leftContent = typeof leftData.content === "string" ? leftData.content : "No content.";
      const rightTitle = typeof rightData.title === "string" ? rightData.title : "Right";
      const rightContent = typeof rightData.content === "string" ? rightData.content : "No content.";

      return (
        <div className="col-span-12">
          <MultiColumnSection
            left={<NarrativeBlock title={leftTitle} content={leftContent} size="sm" gridSpan={{ base: 12 }} />}
            right={<NarrativeBlock title={rightTitle} content={rightContent} size="sm" gridSpan={{ base: 12 }} />}
          />
        </div>
      );
    }

    case "report.table.table": {
      const headers = Array.isArray(data.headers) ? data.headers.map((h) => String(h)) : [];
      const rows = Array.isArray(data.rows)
        ? data.rows.map((r) => (Array.isArray(r) ? r.map((v) => String(v)) : []))
        : [];
      return (
        <Table
          title={typeof data.title === "string" ? data.title : "Table"}
          headers={headers}
          rows={rows}
          gridSpan={{ base: 12 }}
          density="compact"
        />
      );
    }

    case "report.chart.charts": {
      const mapped = Array.isArray(data.series)
        ? data.series
            .filter((s) => s && typeof s === "object")
            .map((s) => ({
              label: String((s as { label?: unknown }).label ?? "Series"),
              value: Number((s as { value?: unknown }).value ?? 0),
            }))
        : [];

      return (
        <Charts
          title={typeof data.title === "string" ? data.title : "Bar Chart"}
          series={mapped}
          gridSpan={{ base: 12, lg: 7 }}
          size="sm"
        />
      );
    }

    case "report.metric.gaugeNarrativeGrid": {
      const gaugeItems = Array.isArray(data.items)
        ? data.items
            .filter((s) => s && typeof s === "object")
            .map((s) => ({
              label: String((s as { label?: unknown }).label ?? "Segment"),
              percent: Number((s as { percent?: unknown }).percent ?? 0),
            }))
        : [];

      return (
        <GaugeNarativeGridBlock
          title={typeof data.title === "string" ? data.title : "Readiness Gauge"}
          items={gaugeItems}
          narrative={typeof data.narrative === "string" ? data.narrative : undefined}
          gridSpan={{ base: 12, lg: 7 }}
        />
      );
    }

    case "report.metric.resultMetricCard": {
      const metrics = Array.isArray(data.metrics) ? data.metrics : [];
      const mapped = metrics
        .filter((m) => m && typeof m === "object")
        .map((m) => ({
          value: String((m as { value?: unknown }).value ?? "-"),
          label: String((m as { label?: unknown }).label ?? "Metric"),
        }));

      return (
        <ResultMetricCard
          title={typeof data.title === "string" ? data.title : "KPI"}
          metrics={mapped.slice(0, 2)}
          size="sm"
          gridSpan={{ base: 12, lg: 5 }}
        />
      );
    }

    case "report.list.squareNumberedList": {
      const items = Array.isArray(data.items) ? data.items : [];
      return (
        <SquareNumberedList
          title={typeof data.title === "string" ? data.title : "Workflow"}
          items={items
            .filter((s) => s && typeof s === "object")
            .map((s) => ({
              title: String((s as { title?: unknown }).title ?? "Step"),
              description: String((s as { description?: unknown }).description ?? ""),
            }))}
          size="sm"
          gridSpan={{ base: 12 }}
        />
      );
    }

    default:
      return (
        <section className="col-span-12 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          Unsupported block type: <code>{block.type}</code>
        </section>
      );
  }
}

export function ReportTemplatePageRenderer({ document }: ReportTemplatePageRendererProps) {
  if (!isReportTemplatePage(document)) {
    return (
      <main className="mx-auto w-full max-w-6xl p-4 md:p-8">
        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Invalid report template payload.
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-8">
      <header className="space-y-2">
        <p className="text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-primary">Template preview</p>
        <h1 className="text-4xl font-semibold tracking-tight" data-font="display">{document.pageTitle}</h1>
        <p className="text-base leading-7 text-muted-foreground">Rendered with components from `components/report`.</p>
      </header>
      <section className="grid grid-cols-12 gap-4 md:gap-6">
        {document.layout.map((block) => (
          <div key={block.id} className="contents">
            {blockView(block)}
          </div>
        ))}
      </section>
    </main>
  );
}
