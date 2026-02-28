import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudySegmentation } from "./case-study-segmentation";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Case Study/Segmentation",
  component: CaseStudySegmentation,
  tags: ["autodocs"],
} satisfies Meta<typeof CaseStudySegmentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseStudy: { segments: sampleCaseStudy.segments },
  },
};

