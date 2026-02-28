import type { Meta, StoryObj } from "@storybook/react";

import {
  CardGrid,
  FooterContactStrip,
  Grid2Column,
  Grid3Column,
  HeaderBarBrand,
  WatermarkBackgroundPattern,
} from "./blocks";
import { getBlockByType } from "../story-utils";

const context = {
  blockMap: new Map(),
  renderRef: (id: string) => <div className="rounded border p-2 text-xs">Ref: {id}</div>,
};

const meta = {
  title: "Case Study/Layout Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Header: Story = {
  render: () => <HeaderBarBrand block={getBlockByType("layout.headerBarBrand")} context={context} path={[]} />,
};

export const Footer: Story = {
  render: () => <FooterContactStrip block={getBlockByType("layout.footerContactStrip")} context={context} path={[]} />,
};

export const Watermark: Story = {
  render: () => (
    <WatermarkBackgroundPattern block={getBlockByType("layout.watermarkBackgroundPattern")} context={context} path={[]} />
  ),
};

export const TwoColumnGrid: Story = {
  render: () => <Grid2Column block={getBlockByType("layout.grid2Column")} context={context} path={[]} />,
};

export const ThreeColumnGrid: Story = {
  render: () => <Grid3Column block={getBlockByType("layout.grid3Column")} context={context} path={[]} />,
};

export const CardGridLayout: Story = {
  render: () => <CardGrid block={getBlockByType("layout.cardGrid")} context={context} path={[]} />,
};

