import type { Meta, StoryObj } from "@storybook/react";
import { NarrativeListBlock } from "./narrative-list-block";

const meta = {
  title: "Report/NarrativeListBlock",
  component: NarrativeListBlock,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="grid grid-cols-12 gap-4 bg-background p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NarrativeListBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  "There is growing demand for products in the market.",
  "Customers seek faster service and online accessibility.",
  "Brands with digital presence outperform offline-only competitors.",
];

export const Default: Story = {
  args: {
    title: "Key Findings and Recommendations",
    items,
    size: "md",
    gridSpan: { base: 12, md: 6, lg: 6 },
  },
};

export const SizeOptions: Story = {
  render: () => (
    <>
      <NarrativeListBlock title="Small" items={items} size="sm" gridSpan={{ base: 12, lg: 4 }} />
      <NarrativeListBlock title="Medium" items={items} size="md" gridSpan={{ base: 12, lg: 4 }} />
      <NarrativeListBlock title="Large" items={items} size="lg" gridSpan={{ base: 12, lg: 4 }} />
    </>
  ),
};
