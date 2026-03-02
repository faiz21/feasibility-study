import type { Meta, StoryObj } from "@storybook/react";
import { Checklist } from "./checklist";

const defaultItems = [
  "Worked with over 25 businesses",
  "Average 3x engagement boost post-launch",
  "Service availability: Weekdays 10AM-6PM",
];

const meta = {
  title: "Report/Checklist",
  component: Checklist,
  tags: ["autodocs"],
  args: {
    items: defaultItems,
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <Checklist {...args} />
    </div>
  ),
} satisfies Meta<typeof Checklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OneItem: Story = {
  args: {
    items: [defaultItems[0]],
  },
};
