import type { Meta, StoryObj } from "@storybook/react";

import inalumTemplate from "@/templates/report_template/generated/automation_audit_template/sample.json";
import { ReportTemplatePageRenderer } from "./report-template-page-renderer";

type TemplateBlock = { id: string; type: string; data: Record<string, unknown> };
type TemplatePage = { schemaVersion: 1; pageTitle: string; layout: TemplateBlock[] };
const templatePages = (inalumTemplate.pages || []) as TemplatePage[];

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
