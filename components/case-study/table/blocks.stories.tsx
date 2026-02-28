import type { Meta, StoryObj } from "@storybook/react";

import { DataTableSimple } from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Table Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleTable: Story = {
  render: () => <DataTableSimple block={getBlockByType("table.simple")} context={context} path={[]} />,
};

