import type { Meta, StoryObj } from "@storybook/react";

import { ResultMetricCard, ResultQuoteCallout } from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Result Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const MetricCard: Story = {
  render: () => <ResultMetricCard block={getBlockByType("result.metricCard")} context={context} path={[]} />,
};
export const QuoteCallout: Story = {
  render: () => <ResultQuoteCallout block={getBlockByType("result.quoteCallout")} context={context} path={[]} />,
};

