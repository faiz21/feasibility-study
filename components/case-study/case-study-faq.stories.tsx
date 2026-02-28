import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudyFaq } from "./case-study-faq";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Case Study/FAQ",
  component: CaseStudyFaq,
  tags: ["autodocs"],
} satisfies Meta<typeof CaseStudyFaq>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseStudy: { faq: sampleCaseStudy.faq },
  },
};

