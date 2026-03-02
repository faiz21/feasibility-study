import type { Meta, StoryObj } from "@storybook/react";
import { Charts } from "./charts";

const meta = {
  title: "Report/Charts",
  component: Charts,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="grid grid-cols-12 gap-4 bg-background p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Charts>;

export default meta;
type Story = StoryObj<typeof meta>;

const series = [
  { label: "Digital Marketing", value: 8, color: "var(--muted-foreground)" },
  { label: "Social Media", value: 12, color: "var(--foreground)" },
  { label: "Offline Marketing", value: 16, color: "var(--accent)" },
];

export const Default: Story = {
  args: {
    title: "Advertising and Promotion",
    series,
    size: "md",
    gridSpan: { base: 12, lg: 6 },
  },
};

export const SizeOptions: Story = {
  render: () => (
    <>
      <Charts title="Small" series={series} size="sm" gridSpan={{ base: 12, lg: 4 }} />
      <Charts title="Medium" series={series} size="md" gridSpan={{ base: 12, lg: 4 }} />
      <Charts title="Large" series={series} size="lg" gridSpan={{ base: 12, lg: 4 }} />
    </>
  ),
};
