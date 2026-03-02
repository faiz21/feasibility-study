import type { Meta, StoryObj } from "@storybook/react";
import { PackageCards } from "./package-cards";

const defaultItems = [
  {
    title: "Brand Clarity Session",
    description: "A 1-hour consultation with summary brief to define your brand tone and messaging.",
    priceLabel: "Starting from $48.00",
  },
  {
    title: "Visual Strategy & Content Map",
    description: "Includes social media guidelines, post ideas, and a 30-day content roadmap.",
    priceLabel: "Starting from $52.00",
  },
  {
    title: "Full Campaign Planning",
    description: "End-to-end content strategy with goal setting, mapping, and performance review.",
    priceLabel: "Starting from $55.00",
  },
];

const meta = {
  title: "Report/PackageCards",
  component: PackageCards,
  tags: ["autodocs"],
  args: {
    items: defaultItems,
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <PackageCards {...args} />
    </div>
  ),
} satisfies Meta<typeof PackageCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoPackages: Story = {
  args: {
    items: defaultItems.slice(0, 2),
  },
};
