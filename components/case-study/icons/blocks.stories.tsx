import type { Meta, StoryObj } from "@storybook/react";

import { IconCategoryGrid } from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Icon Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CategoryGrid: Story = {
  render: () => <IconCategoryGrid block={getBlockByType("icons.categoryGrid")} context={context} path={[]} />,
};

