import type { Meta, StoryObj } from "@storybook/react";

import { ProfitVsExpenseSplit, YearPercentBadgeColumn } from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Stats Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const YearPercent: Story = {
  render: () => <YearPercentBadgeColumn block={getBlockByType("stats.yearPercentColumn")} context={context} path={[]} />,
};
export const ProfitExpense: Story = {
  render: () => <ProfitVsExpenseSplit block={getBlockByType("stats.profitExpenseSplit")} context={context} path={[]} />,
};

