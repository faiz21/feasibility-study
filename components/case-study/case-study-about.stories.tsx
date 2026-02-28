import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudyAbout } from "./case-study-about";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Case Study/About",
  component: CaseStudyAbout,
  tags: ["autodocs"],
} satisfies Meta<typeof CaseStudyAbout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseStudy: { aboutUs: sampleCaseStudy.aboutUs },
  },
};

