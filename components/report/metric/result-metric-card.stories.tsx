import type { Meta, StoryObj } from "@storybook/react";
import { QuoteStatement } from "../text/quote-statement";
import { ResultMetricCard } from "./result-metric-card";

const SAMPLE_METRICS = [
  { value: "30%", label: "Growth in foot traffic through promotions & outreach." },
  { value: "50%", label: "Increase in engagement via events & social media." },
];

const SAMPLE_STATEMENT =
  "By prioritizing customer experience and community, Borcelle proved that bookstores can thrive in the digital age.";

const meta = {
  title: "Report/ResultMetricCard",
  component: ResultMetricCard,
  tags: ["autodocs"],
  args: {
    title: "Result",
    metrics: SAMPLE_METRICS,
    size: "md",
    variant: "dark",
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-6 bg-muted p-4 md:p-8">
      <ResultMetricCard {...args} />
      <QuoteStatement statement={SAMPLE_STATEMENT} size="md" />
    </div>
  ),
} satisfies Meta<typeof ResultMetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BrandVariant: Story = {
  args: {
    variant: "brand",
  },
};

export const MutedVariant: Story = {
  args: {
    variant: "muted",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};
