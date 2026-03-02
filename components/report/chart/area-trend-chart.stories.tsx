import type { Meta, StoryObj } from "@storybook/react";
import { AreaTrendChart } from "./area-trend-chart";

const points = [
  { x: "2022", primary: 9, secondary: 3 },
  { x: "2023", primary: 21, secondary: 8 },
  { x: "2024", primary: 34, secondary: 16 },
  { x: "2025", primary: 36, secondary: 18 },
  { x: "2026", primary: 22, secondary: 8 },
  { x: "2027", primary: 34, secondary: 16 },
];

const meta = {
  title: "Report/AreaTrendChart",
  component: AreaTrendChart,
  tags: ["autodocs"],
  args: {
    title: "Gains",
    points,
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <AreaTrendChart {...args} />
    </div>
  ),
} satisfies Meta<typeof AreaTrendChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AlternateTrend: Story = {
  args: {
    points: [
      { x: "Q1", primary: 10, secondary: 5 },
      { x: "Q2", primary: 28, secondary: 11 },
      { x: "Q3", primary: 18, secondary: 8 },
      { x: "Q4", primary: 32, secondary: 14 },
    ],
  },
};
