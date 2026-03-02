import type { Meta, StoryObj } from "@storybook/react";
import { QuoteStatement } from "./quote-statement";

const SAMPLE_STATEMENT =
  "By prioritizing customer experience and community, Borcelle proved that bookstores can thrive in the digital age.";

const meta = {
  title: "Report/QuoteStatement",
  component: QuoteStatement,
  tags: ["autodocs"],
  args: {
    statement: SAMPLE_STATEMENT,
    size: "md",
  },
  render: (args) => (
    <div className="grid grid-cols-12 bg-muted p-4 md:p-8">
      <QuoteStatement {...args} />
    </div>
  ),
} satisfies Meta<typeof QuoteStatement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};
