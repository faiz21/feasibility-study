import type { Meta, StoryObj } from "@storybook/react";
import { NarrativeBlock } from "./narrative-block";

const meta = {
  title: "Report/NarrativeBlock",
  component: NarrativeBlock,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="grid grid-cols-12 gap-4 bg-background p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NarrativeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseContent =
  "This business plan outlines a strategic approach to improve market position, customer engagement, and long-term profitability over the next 12-24 months.";

export const Default: Story = {
  args: {
    title: "Overview",
    content: baseContent,
    size: "md",
    gridSpan: { base: 12, md: 6, lg: 6 },
  },
};

export const SizeOptions: Story = {
  render: () => (
    <>
      <NarrativeBlock title="Small" content={baseContent} size="sm" gridSpan={{ base: 12, lg: 4 }} />
      <NarrativeBlock title="Medium" content={baseContent} size="md" gridSpan={{ base: 12, lg: 4 }} />
      <NarrativeBlock title="Large" content={baseContent} size="lg" gridSpan={{ base: 12, lg: 4 }} />
    </>
  ),
};
