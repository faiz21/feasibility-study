import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudyContact } from "./case-study-contact";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Case Study/Contact",
  component: CaseStudyContact,
  tags: ["autodocs"],
} satisfies Meta<typeof CaseStudyContact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caseStudy: { contact: sampleCaseStudy.contact },
  },
};

