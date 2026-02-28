import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudyCover } from "./case-study-cover";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Case Study/Cover",
  component: CaseStudyCover,
  tags: ["autodocs"],
} satisfies Meta<typeof CaseStudyCover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseStudy: sampleCaseStudy,
  },
};

export const Minimal: Story = {
  args: {
    caseStudy: {
      title: "Case Study",
      company: {
        name: "Company Name",
        description: "Short company background description.",
      },
      contact: {},
    },
  },
};
