import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudyKeyFindings } from "./case-study-key-findings";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Case Study/Key Findings",
  component: CaseStudyKeyFindings,
  tags: ["autodocs"],
} satisfies Meta<typeof CaseStudyKeyFindings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseStudy: { keyFindings: sampleCaseStudy.keyFindings },
  },
};

