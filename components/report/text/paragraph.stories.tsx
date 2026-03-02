import type { Meta, StoryObj } from "@storybook/react";
import { NarrativeCard } from "./paragraph";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const meta = {
  title: "Report/Paragraph",
  component: NarrativeCard,
  tags: ["autodocs"],
  args: {
    title: "Overview",
    content: sampleCaseStudy.overview,
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <NarrativeCard {...args} />
    </div>
  ),
} satisfies Meta<typeof NarrativeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LargeSpan: Story = {
  args: {
    size: "lg",
    gridSpan: { base: 12, lg: 8 },
  },
};

export const PaletteFallback: Story = {
  args: {
    palette: {
      primary: "bad",
      accent: "var(--accent)",
    },
  },
};
