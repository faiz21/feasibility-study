import type { Meta, StoryObj } from "@storybook/react";

import { DemographicSummaryCards } from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Demographics Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SummaryCards: Story = {
  render: () => (
    <DemographicSummaryCards
      block={getBlockByType("demographics.summaryCards")}
      context={context}
      path={[]}
    />
  ),
};

