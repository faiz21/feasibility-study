import type { Meta, StoryObj } from "@storybook/react";
import { PerformanceTableBlock } from "./performance-table-block";

const meta = {
  title: "Report/PerformanceTableBlock",
  component: PerformanceTableBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof PerformanceTableBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows: [
      { platform: "Platform 1", value: 1332, deltaPercent: -3 },
      { platform: "Platform 2", value: 1536, deltaPercent: 16 },
      { platform: "Platform 3", value: 1522, deltaPercent: 11 },
      { platform: "Platform 4", value: 1439, deltaPercent: 9 },
    ],
  },
};
