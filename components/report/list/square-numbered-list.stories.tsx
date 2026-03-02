import type { Meta, StoryObj } from "@storybook/react";
import { SquareNumberedList } from "./square-numbered-list";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const defaultItems = (sampleCaseStudy.benefits ?? []).slice(0, 3).map((benefit) => ({
  title: benefit.title,
  description: benefit.description,
}));

const meta = {
  title: "Report/SquareNumberedList",
  component: SquareNumberedList,
  tags: ["autodocs"],
  args: {
    title: "Benefits",
    items: defaultItems,
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <SquareNumberedList {...args} />
    </div>
  ),
} satisfies Meta<typeof SquareNumberedList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleColorDefault: Story = {};

export const MultiColorBadges: Story = {
  args: {
    badgeStyle: "multi-color",
  },
};

export const CompactSmall: Story = {
  args: {
    size: "sm",
    badgeSize: "sm",
    gridSpan: { base: 12, lg: 4 },
  },
};
