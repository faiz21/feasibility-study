import type { Meta, StoryObj } from "@storybook/react";

import { QuoteBackdropPanel, QuoteRibbonStack } from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Quote Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BackdropQuote: Story = {
  render: () => <QuoteBackdropPanel block={getBlockByType("quote.backdropPanel")} context={context} path={[]} />,
};
export const RibbonQuote: Story = {
  render: () => <QuoteRibbonStack block={getBlockByType("quote.ribbonStack")} context={context} path={[]} />,
};

