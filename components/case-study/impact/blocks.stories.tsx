import type { Meta, StoryObj } from "@storybook/react";

import { ImpactCategoryPanel, ImpactTopMetricRow } from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Impact Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TopMetricRow: Story = {
  render: () => <ImpactTopMetricRow block={getBlockByType("impact.topMetricRow")} context={context} path={[]} />,
};
export const CategoryPanel: Story = {
  render: () => <ImpactCategoryPanel block={getBlockByType("impact.categoryPanel")} context={context} path={[]} />,
};

