import type { Meta, StoryObj } from "@storybook/react";

import { ReportTemplatePageRenderer } from "./report-template-page-renderer";

type TemplateBlock = { id: string; type: string; data: Record<string, unknown> };
type TemplatePage = { pageTitle: string; layout: TemplateBlock[] };

const templatePages: TemplatePage[] = [
  {
    pageTitle: "INALUM Automation Audit (Sample)",
    layout: [
      {
        id: "hdr-001",
        type: "report.layout.headerBar",
        data: { headerLabel: "Automation Audit" },
      },
      {
        id: "nar-001",
        type: "report.text.narrativeBlock",
        data: {
          title: "Executive Snapshot",
          content:
            "This is a lightweight sample payload used for Storybook preview. Replace with generated templates when available.",
          bullets: ["Baseline visibility", "Event logging readiness", "Instrumentation confidence"],
        },
      },
      {
        id: "chart-001",
        type: "report.chart.charts",
        data: {
          title: "PLC Brand Mix (Example)",
          series: [
            { label: "Rockwell", value: 3 },
            { label: "Siemens", value: 2 },
            { label: "Omron", value: 1 },
            { label: "TBD", value: 1 },
          ],
        },
      },
      {
        id: "kpi-001",
        type: "report.metric.resultMetricCard",
        data: {
          title: "Readiness",
          metrics: [
            { value: "2.3/5", label: "L2 Visibility" },
            { value: "1.8/5", label: "L3 Reporting" },
          ],
        },
      },
      {
        id: "list-001",
        type: "report.list.squareNumberedList",
        data: {
          title: "Next Actions",
          items: [
            { title: "Survey I/O", description: "Confirm signal quality and coverage." },
            { title: "Alarm Logging", description: "Standardize events and timestamps." },
            { title: "Mass Flow", description: "Validate belt scales and silo levels." },
          ],
        },
      },
      {
        id: "ftr-001",
        type: "report.layout.footerStrip",
        data: {
          contacts: [
            { kind: "Email", value: "ops@example.com" },
            { kind: "Phone", value: "+62 000-0000-0000" },
          ],
        },
      },
    ],
  },
];

const firstBlockByType: TemplateBlock[] = [];
const seenTypes = new Set<string>();
for (const page of templatePages) {
  for (const block of page.layout) {
    if (!seenTypes.has(block.type)) {
      seenTypes.add(block.type);
      firstBlockByType.push(block);
    }
  }
}

const meta = {
  title: "report_template/INALUM Automation Audit",
  component: ReportTemplatePageRenderer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ReportTemplatePageRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPage: Story = {
  args: {
    document: templatePages[0],
  },
};

export const FullTemplatePages: Story = {
  render: () => (
    <div className="space-y-10">
      {templatePages.map((page) => (
        <ReportTemplatePageRenderer key={page.pageTitle} document={page} />
      ))}
    </div>
  ),
};

export const ComponentTypeCoverage: Story = {
  args: {
    document: {
      schemaVersion: 1,
      pageTitle: "Component Type Coverage",
      layout: firstBlockByType,
    },
  },
};

export const MissingDataSafe: Story = {
  args: {
    document: {
      schemaVersion: 1,
      pageTitle: "Missing Data Safe",
      layout: [
        {
          schemaVersion: 1,
          type: "report.text.narrativeBlock",
          id: "safe-lfo-001",
          data: { title: "Fallback", content: "Minimal payload", bullets: [] },
          meta: { locale: "en", tags: ["edge-case"], createdAt: "2026-03-01T00:00:00Z" },
        },
      ],
    },
  },
};
