import type { Meta, StoryObj } from "@storybook/react";

import {
  GoalsListWithIcons,
  NumberedBenefitsBlock,
  RankedPlatformList,
  WorkflowStepper,
} from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/List Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const GoalsWithIcons: Story = {
  render: () => <GoalsListWithIcons block={getBlockByType("list.goalsWithIcons")} context={context} path={[]} />,
};
export const NumberedBenefits: Story = {
  render: () => <NumberedBenefitsBlock block={getBlockByType("list.numberedBenefits")} context={context} path={[]} />,
};
export const RankedList: Story = {
  render: () => <RankedPlatformList block={getBlockByType("list.rankedWithDelta")} context={context} path={[]} />,
};
export const Workflow: Story = {
  render: () => <WorkflowStepper block={getBlockByType("process.workflowStepper")} context={context} path={[]} />,
};

