import type { Meta, StoryObj } from "@storybook/react";
import { AgeDistributionBars } from "./age-distribution-bars";

const meta = {
  title: "Report/AgeDistributionBars",
  component: AgeDistributionBars,
  tags: ["autodocs"],
} satisfies Meta<typeof AgeDistributionBars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Age 18-24", percent: 41 },
      { label: "Age 25-34", percent: 45 },
      { label: "Age 35-44", percent: 14 },
    ],
  },
};
