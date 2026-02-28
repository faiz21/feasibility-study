import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudyGoals } from "./case-study-goals";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Case Study/Goals",
  component: CaseStudyGoals,
  tags: ["autodocs"],
} satisfies Meta<typeof CaseStudyGoals>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseStudy: { goals: sampleCaseStudy.goals },
  },
};

