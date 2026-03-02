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
      title: "A Journey of Innovation and Success",
      subtitle: "A concise executive narrative for the partnership.",
      company: {
        name: "Borcelle",
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
      primary: "#1e3a8a",
      secondary: "#1f2937",
      accent: "#38bdf8",
      background: "#f8fafc",
      text: "#111827",
    },
    headerLabel: "TITLE",
    pageNumberLabel: "01",
  },
};

export const PaletteFallback: Story = {
  args: {
    caseStudy: sampleCaseStudy,
    palette: {
      primary: "invalid",
      accent: "#0284c7",
    },
  },
};
