import type { Meta, StoryObj } from "@storybook/react";
import { DonutBreakdownChart } from "./donut-breakdown-chart";

const series = [
  { label: "2022", value: 4.3, color: "var(--chart-series-1)" },
  { label: "2023", value: 11.6, color: "var(--muted)" },
  { label: "2024", value: 23.2, color: "var(--chart-series-2)" },
  { label: "2025", value: 26.1, color: "var(--chart-series-3)" },
  { label: "2026", value: 11.6, color: "var(--chart-series-1)" },
  { label: "2027", value: 23.2, color: "var(--card-foreground)" },
];

const meta = {
  title: "Report/DonutBreakdownChart",
  component: DonutBreakdownChart,
  tags: ["autodocs"],
  args: {
    title: "Sales by Product",
    series,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <DonutBreakdownChart {...args} />
    </div>
  ),
} satisfies Meta<typeof DonutBreakdownChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AlternateSeries: Story = {
  args: {
    series: [
      { label: "A", value: 35, color: "var(--chart-series-1)" },
      { label: "B", value: 25, color: "var(--chart-series-2)" },
      { label: "C", value: 20, color: "var(--chart-series-3)" },
      { label: "D", value: 20, color: "var(--card-foreground)" },
    ],
  },
};
