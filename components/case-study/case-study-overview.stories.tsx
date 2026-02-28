import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudyOverview } from "./case-study-overview";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Case Study/Overview",
  component: CaseStudyOverview,
  tags: ["autodocs"],
} satisfies Meta<typeof CaseStudyOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseStudy: { overview: sampleCaseStudy.overview },
  },
};

