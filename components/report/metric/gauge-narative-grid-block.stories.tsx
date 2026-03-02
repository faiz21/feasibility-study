import type { Meta, StoryObj } from "@storybook/react";
import { GaugeNarativeGridBlock } from "./gauge-narative-grid-block";

const meta = {
  title: "Report/GaugeNarativeGridBlock",
  component: GaugeNarativeGridBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof GaugeNarativeGridBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Morning", percent: 8 },
      { label: "Afternoon", percent: 26 },
      { label: "Evening", percent: 34 },
      { label: "Midnight", percent: 32 },
    ],
    narrative:
      "Peak engagement is concentrated from afternoon to midnight, while morning activity remains significantly lower.",
  },
};
