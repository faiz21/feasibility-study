import type { Meta, StoryObj } from "@storybook/react";
import { BulletSummaryBlock } from "./bullet-summary-block";

const bullets = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Aliquam semper felis vel metus tincidunt.",
];

const meta = {
  title: "Report/BulletSummaryBlock",
  component: BulletSummaryBlock,
  tags: ["autodocs"],
  args: {
    title: "Gains",
    bullets,
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <BulletSummaryBlock {...args} />
    </div>
  ),
} satisfies Meta<typeof BulletSummaryBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OneBullet: Story = {
  args: {
    bullets: [bullets[0]],
  },
};
