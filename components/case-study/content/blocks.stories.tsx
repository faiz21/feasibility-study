import type { Meta, StoryObj } from "@storybook/react";

import {
  GoalsCardRow,
  HighlightsCard,
  IconBulletsAnalysisCard,
  LongFormOverview,
  PricingPackageCards,
  SectionSummaryTextBlock,
  SidePanelNarrativeCard,
  SupportingTextCard,
  TwoColumnTextBlock,
} from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Content Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SideNarrative: Story = {
  render: () => <SidePanelNarrativeCard block={getBlockByType("content.sidePanelNarrativeCard")} context={context} path={[]} />,
};
export const TwoColumnText: Story = {
  render: () => <TwoColumnTextBlock block={getBlockByType("content.twoColumnTextBlock")} context={context} path={[]} />,
};
export const LongOverview: Story = {
  render: () => <LongFormOverview block={getBlockByType("content.longFormOverview")} context={context} path={[]} />,
};
export const GoalsRow: Story = {
  render: () => <GoalsCardRow block={getBlockByType("cards.goalsRow")} context={context} path={[]} />,
};
export const PricingCards: Story = {
  render: () => <PricingPackageCards block={getBlockByType("cards.pricingPackages")} context={context} path={[]} />,
};
export const Highlights: Story = {
  render: () => <HighlightsCard block={getBlockByType("content.highlightsCard")} context={context} path={[]} />,
};
export const SupportingText: Story = {
  render: () => <SupportingTextCard block={getBlockByType("content.supportingTextCard")} context={context} path={[]} />,
};
export const IconBullets: Story = {
  render: () => <IconBulletsAnalysisCard block={getBlockByType("content.iconBulletsCard")} context={context} path={[]} />,
};
export const SectionSummary: Story = {
  render: () => <SectionSummaryTextBlock block={getBlockByType("content.sectionSummaryText")} context={context} path={[]} />,
};

