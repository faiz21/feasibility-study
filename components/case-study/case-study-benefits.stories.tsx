import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudyBenefits } from "./case-study-benefits";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Case Study/Benefits",
  component: CaseStudyBenefits,
  tags: ["autodocs"],
} satisfies Meta<typeof CaseStudyBenefits>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseStudy: { benefits: sampleCaseStudy.benefits },
  },
};

