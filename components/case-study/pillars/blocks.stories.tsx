import type { Meta, StoryObj } from "@storybook/react";

import { ThreePillarSummary } from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Pillars Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChallengeSolutionResult: Story = {
  render: () => (
    <ThreePillarSummary
      block={getBlockByType("pillars.challengeSolutionResult")}
      context={context}
      path={[]}
    />
  ),
};

