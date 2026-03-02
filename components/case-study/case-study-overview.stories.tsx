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

export const CustomPalette: Story = {
  args: {
    caseStudy: { overview: sampleCaseStudy.overview },
    title: "Executive Overview",
    palette: {
      primary: "#1e3a8a",
      secondary: "#1f2937",
      accent: "#38bdf8",
      background: "#f8fafc",
      text: "#111827",
    },
  },
};

export const PaletteFallback: Story = {
  args: {
    caseStudy: { overview: sampleCaseStudy.overview },
    palette: {
      primary: "invalid",
      accent: "#0ea5e9",
    },
  },
};
