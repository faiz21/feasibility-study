import type { Meta, StoryObj } from "@storybook/react";
import { SummaryHighlight } from "./summary-highlight";

const meta = {
  title: "Report/SummaryHighlight",
  component: SummaryHighlight,
  tags: ["autodocs"],
} satisfies Meta<typeof SummaryHighlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Total Impression", value: "1,345,000", tone: "neutral" },
      { label: "Total Engagement", value: "175,000", tone: "primary" },
      { label: "Total New Followers", value: "6,500", tone: "dark" },
    ],
  },
};
