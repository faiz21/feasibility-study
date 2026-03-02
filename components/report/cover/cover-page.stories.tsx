import type { Meta, StoryObj } from "@storybook/react";
import { sampleCaseStudy } from "@/lib/case-study/sample";
import { ReportCoverPage } from "./cover-page";

const meta = {
  title: "Report/Cover Page",
  component: ReportCoverPage,
  tags: ["autodocs"],
} satisfies Meta<typeof ReportCoverPage>;

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
      title: "Company",
      subtitle: "Casestudy",
      company: {
        name: "Company Name",
        description: "Short company background description.",
      },
      contact: {},
    },
  },
};

export const CustomPalette: Story = {
  args: {
    caseStudy: sampleCaseStudy,
    palette: {
      primary: "var(--primary)",
      secondary: "var(--secondary)",
      accent: "var(--accent)",
      background: "var(--background)",
      text: "var(--foreground)",
    },
    headerLabel: "EXECUTIVE COVER",
  },
};
