import type { Meta, StoryObj } from "@storybook/react";
import { DualMetricBlock } from "./dual-metric-block";

const meta = {
  title: "Report/DualMetricBlock",
  component: DualMetricBlock,
  tags: ["autodocs"],
  args: {
    heading: "Performance Summary",
    metricA: { label: "Profitability", value: "80%" },
    metricB: { label: "Expense", value: "20%" },
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <DualMetricBlock {...args} />
    </div>
  ),
} satisfies Meta<typeof DualMetricBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AlternateValues: Story = {
  args: {
    metricA: { label: "Completion", value: "74%" },
    metricB: { label: "Backlog", value: "26%" },
  },
};
