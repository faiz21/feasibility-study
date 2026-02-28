import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudyKeyMetrics } from "./case-study-key-metrics";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Case Study/Key Metrics",
  component: CaseStudyKeyMetrics,
  tags: ["autodocs"],
} satisfies Meta<typeof CaseStudyKeyMetrics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseStudy: { keyMetrics: sampleCaseStudy.keyMetrics },
  },
};

