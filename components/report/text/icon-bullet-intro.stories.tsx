import type { Meta, StoryObj } from "@storybook/react";
import { IconBulletIntro } from "./icon-bullet-intro";

const bullets = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Aliquam semper felis vel metus tincidunt.",
  "Quisque facilisis in leo eget iaculis.",
];

const meta = {
  title: "Report/IconBulletIntro",
  component: IconBulletIntro,
  tags: ["autodocs"],
  args: {
    title: "Sales Analysis",
    bullets,
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <IconBulletIntro {...args} />
    </div>
  ),
} satisfies Meta<typeof IconBulletIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongBullets: Story = {
  args: {
    bullets: bullets.map((b) => `${b} Lorem ipsum dolor sit amet.`),
  },
};
