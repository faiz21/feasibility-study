import type { Meta, StoryObj } from "@storybook/react";

import { QuoteBackdropPanel, QuoteRibbonStack } from "./blocks";
import { getBlockByType } from "../story-utils";
import { asRecord } from "../helpers";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Quote Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function withSize(type: "quote.backdropPanel" | "quote.ribbonStack", size: "sm" | "md" | "lg") {
  const block = getBlockByType(type);
  const data = asRecord(block.data);
  const style = asRecord(data.style);
  return {
    ...block,
    data: {
      ...data,
      style: {
        ...style,
        size,
      },
    },
  };
}

function renderInGrid(content: JSX.Element, spanClass: string) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className={spanClass}>{content}</div>
    </div>
  );
}

export const BackdropQuote: Story = {
  render: () =>
    renderInGrid(
      <QuoteBackdropPanel block={withSize("quote.backdropPanel", "md")} context={context} path={[]} />,
      "col-span-12 md:col-span-8",
    ),
};

export const BackdropQuoteSmall: Story = {
  render: () =>
    renderInGrid(
      <QuoteBackdropPanel block={withSize("quote.backdropPanel", "sm")} context={context} path={[]} />,
      "col-span-12 md:col-span-4",
    ),
};

export const BackdropQuoteLarge: Story = {
  render: () =>
    renderInGrid(
      <QuoteBackdropPanel block={withSize("quote.backdropPanel", "lg")} context={context} path={[]} />,
      "col-span-12",
    ),
};

export const RibbonQuote: Story = {
  render: () =>
    renderInGrid(
      <QuoteRibbonStack block={withSize("quote.ribbonStack", "md")} context={context} path={[]} />,
      "col-span-12 md:col-span-8",
    ),
};

export const RibbonQuoteSmall: Story = {
  render: () =>
    renderInGrid(
      <QuoteRibbonStack block={withSize("quote.ribbonStack", "sm")} context={context} path={[]} />,
      "col-span-12 md:col-span-4",
    ),
};

export const RibbonQuoteLarge: Story = {
  render: () =>
    renderInGrid(
      <QuoteRibbonStack block={withSize("quote.ribbonStack", "lg")} context={context} path={[]} />,
      "col-span-12",
    ),
};
