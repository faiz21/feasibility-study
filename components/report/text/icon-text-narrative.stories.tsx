import type { Meta, StoryObj } from "@storybook/react";
import { IconTextNarrative } from "./icon-text-narrative";

const meta = {
  title: "Report/IconTextNarrative",
  component: IconTextNarrative,
  tags: ["autodocs"],
  args: {
    title: "New Clients",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam semper felis vel metus tincidunt.",
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <IconTextNarrative {...args} />
    </div>
  ),
} satisfies Meta<typeof IconTextNarrative>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    body: "Concise narrative copy for executive summary.",
  },
};
