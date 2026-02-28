import type { Meta, StoryObj } from "@storybook/react";

import { KpiCard, KpiCardGrid2x2, KpiStrip3 } from "./blocks";
import { getBlockByType } from "../story-utils";

const context = {
  blockMap: new Map(),
  renderRef: (id: string) => <div className="rounded border p-2 text-xs">Ref: {id}</div>,
};

const meta = {
  title: "Case Study/KPI Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const KpiCardStory: Story = {
  render: () => <KpiCard block={getBlockByType("kpi.card")} context={context} path={[]} />,
};
export const KpiGrid: Story = {
  render: () => <KpiCardGrid2x2 block={getBlockByType("kpi.grid2x2")} context={context} path={[]} />,
};
export const KpiStrip: Story = {
  render: () => <KpiStrip3 block={getBlockByType("kpi.strip3")} context={context} path={[]} />,
};

