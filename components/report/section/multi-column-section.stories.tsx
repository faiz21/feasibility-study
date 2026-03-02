import type { Meta, StoryObj } from "@storybook/react";
import { IconList } from "../list/icon-list";
import { MultiColumnSection } from "./multi-column-section";
import { NarrativeCard } from "../text/paragraph";
import { SquareNumberedList } from "../list/square-numbered-list";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const iconItems = (sampleCaseStudy.goals ?? []).slice(0, 4).map((goal) => ({
  title: goal.title,
  description: goal.description,
}));

const benefitItems = (sampleCaseStudy.benefits ?? []).slice(0, 3).map((benefit) => ({
  title: benefit.title,
  description: benefit.description,
}));

const meta = {
  title: "Report/MultiColumnSection",
  component: MultiColumnSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="bg-muted p-4 md:p-8">
      <MultiColumnSection {...args} />
    </div>
  ),
} satisfies Meta<typeof MultiColumnSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NarrativeCardAndSquareList: Story = {
  args: {
    left: (
      <NarrativeCard
        title="Overview"
        content={sampleCaseStudy.overview}
        size="sm"
        gridSpan={{ base: 12 }}
      />
    ),
    right: (
      <SquareNumberedList
        title="Benefits"
        items={benefitItems}
        size="sm"
        badgeStyle="multi-color"
        gridSpan={{ base: 12 }}
      />
    ),
    leftSpan: { base: 12, lg: 7 },
    rightSpan: { base: 12, lg: 5 },
  },
};

export const IconListAndSquareList: Story = {
  args: {
    left: (
      <IconList title="Goals and Objectives" items={iconItems} size="sm" gridSpan={{ base: 12 }} />
    ),
    right: (
      <SquareNumberedList title="Benefits" items={benefitItems} size="sm" gridSpan={{ base: 12 }} />
    ),
    leftSpan: { base: 12, lg: 8 },
    rightSpan: { base: 12, lg: 4 },
    gap: "comfortable",
  },
};
