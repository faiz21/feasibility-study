import type { Meta, StoryObj } from "@storybook/react";
import { NumberedList } from "./numbered-list";

const defaultItems = [
  "Intro call & client brief",
  "Strategic alignment",
  "Creative development",
  "Final presentation & handover",
  "Follow-up review session",
];

const meta = {
  title: "Report/NumberedList",
  component: NumberedList,
  tags: ["autodocs"],
  args: {
    items: defaultItems,
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <NumberedList {...args} />
    </div>
  ),
} satisfies Meta<typeof NumberedList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    items: defaultItems.slice(0, 3),
  },
};
