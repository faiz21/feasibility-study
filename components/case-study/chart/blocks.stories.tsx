import type { Meta, StoryObj } from "@storybook/react";

import {
  BarChartCard,
  DonutChartCard,
  GainsAreaChart,
  PeakTimeGauge,
  SalesByProductDonut,
} from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Chart Blocks",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bar: Story = {
  render: () => <BarChartCard block={getBlockByType("chart.barCard")} context={context} path={[]} />,
};
export const Donut: Story = {
  render: () => <DonutChartCard block={getBlockByType("chart.donutCard")} context={context} path={[]} />,
};
export const Gauge: Story = {
  render: () => <PeakTimeGauge block={getBlockByType("chart.gaugeSegments")} context={context} path={[]} />,
};
export const SalesDonut: Story = {
  render: () => <SalesByProductDonut block={getBlockByType("chart.donutSalesByProduct")} context={context} path={[]} />,
};
export const Area: Story = {
  render: () => <GainsAreaChart block={getBlockByType("chart.areaGains")} context={context} path={[]} />,
};

