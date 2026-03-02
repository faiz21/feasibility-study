import type { Meta, StoryObj } from "@storybook/react";
import { DemographicsBlock } from "./demographics-block";

const meta = {
  title: "Report/DemographicsBlock",
  component: DemographicsBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof DemographicsBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalAudienceValue: "123K",
    malePercent: 55,
    femalePercent: 45,
    ageItems: [
      { label: "Age 18-24", percent: 41 },
      { label: "Age 25-34", percent: 45 },
      { label: "Age 35-44", percent: 14 },
    ],
  },
};
