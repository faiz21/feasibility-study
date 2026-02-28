import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudyTemplate } from "./case-study-template";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Case Study/Template",
  component: CaseStudyTemplate,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CaseStudyTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseStudy: sampleCaseStudy,
  },
};

