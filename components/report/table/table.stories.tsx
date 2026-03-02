import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./table";

const meta = {
  title: "Report/Table",
  component: Table,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="grid grid-cols-12 gap-4 bg-background p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const headers = ["Segment", "Characteristics", "Marketing Strategy"];
const rows = [
  ["Segment 1", "Young professionals (ages 25-35)", "Mobile-friendly campaigns and limited-time offers"],
  ["Segment 2", "Families (ages 30-50)", "Family packages and service guarantees"],
  ["Segment 3", "Digital natives (early 20s)", "Social campaigns and student discounts"],
];

export const Default: Story = {
  args: {
    title: "Target Audience and Segmentation",
    headers,
    rows,
    density: "comfortable",
    gridSpan: { base: 12, lg: 6 },
  },
};

export const DensityOptions: Story = {
  render: () => (
    <>
      <Table title="Compact" headers={headers} rows={rows} density="compact" gridSpan={{ base: 12, lg: 4 }} />
      <Table title="Comfortable" headers={headers} rows={rows} density="comfortable" gridSpan={{ base: 12, lg: 4 }} />
      <Table title="Spacious" headers={headers} rows={rows} density="spacious" gridSpan={{ base: 12, lg: 4 }} />
    </>
  ),
};
