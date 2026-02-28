import type { Meta, StoryObj } from "@storybook/react";

import inalumTemplate from "@/templates/report_template/generated/automation_audit_template/sample.json";
import type { CaseStudyPageDocument, GenericBlock } from "@/lib/case-study/types";
import { CaseStudyPageRenderer } from "./page-renderer";

function normalizeBlock(block: GenericBlock): GenericBlock {
  const normalizedBase = {
    ...block,
    schemaVersion: 1 as const,
  };

  if (
    block.type === "chart.gaugeSegments" &&
    block.data &&
    typeof block.data === "object" &&
    !("series" in block.data)
  ) {
    const segments = Array.isArray((block.data as { segments?: unknown[] }).segments)
      ? ((block.data as { segments: Array<{ value?: number }> }).segments)
      : [];
    return {
      ...normalizedBase,
      data: {
        ...block.data,
        series: [
          {
            name: "segments",
            data: segments.map((item) => Number(item?.value ?? 0)),
          },
        ],
      },
    };
  }

  return normalizedBase;
}

function normalizePage(input: { pageTitle: string; layout: GenericBlock[] }): CaseStudyPageDocument {
  return {
    schemaVersion: 1,
    pageTitle: input.pageTitle,
    layout: input.layout.map(normalizeBlock),
  };
}

const templatePages = (inalumTemplate.pages || []).map((page) =>
  normalizePage({ pageTitle: page.pageTitle, layout: page.layout as GenericBlock[] }),
);

const meta = {
  title: "Case Study/Templates/INALUM Automation Audit",
  component: CaseStudyPageRenderer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CaseStudyPageRenderer>;

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
        <CaseStudyPageRenderer key={page.pageTitle} document={page} />
      ))}
    </div>
  ),
};
