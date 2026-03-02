import type { Meta, StoryObj } from "@storybook/react";
import { DonutChartBlock } from "./donut-chart-block";

const meta = {
  title: "Report/DonutChartBlock",
  component: DonutChartBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof DonutChartBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    slices: [
      { label: "Video", value: 64.9, color: "var(--chart-series-1)" },
      { label: "Text", value: 7.9, color: "var(--muted)" },
      { label: "Picture", value: 21.2, color: "var(--card-foreground)" },
      { label: "Link", value: 6, color: "var(--chart-series-3)" },
    ],
  },
};
