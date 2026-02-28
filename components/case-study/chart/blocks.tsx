import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { BlockShell } from "../primitives";
import { asArray, asRecord, asString } from "../helpers";
import { CaseAreaChart, CaseBarChart, CaseDonutChart, CaseGaugeChart } from "./nivo-charts";

export function BarChartCard({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const series = asArray<Record<string, unknown>>(data.series);
  const normalized = series.map((item) => ({
    label: asString(item.name),
    value: Number(asArray<number>(item.data)[0] ?? 0),
  }));
  return (
    <BlockShell title={asString(data.title)}>
      <CaseBarChart data={normalized} />
    </BlockShell>
  );
}

export function DonutChartCard({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const normalized = asArray<Record<string, unknown>>(data.series).map((item) => ({
    id: asString(item.name),
    value: Number(item.value ?? 0),
  }));
  return (
    <BlockShell title={asString(data.title)}>
      <CaseDonutChart data={normalized} />
    </BlockShell>
  );
}

export function PeakTimeGauge({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const normalized = asArray<Record<string, unknown>>(data.segments).map((item) => ({
    id: asString(item.label),
    value: Number(item.value ?? 0),
  }));
  return (
    <BlockShell title={asString(data.title)}>
      <CaseGaugeChart data={normalized} />
    </BlockShell>
  );
}

export function SalesByProductDonut({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const normalized = asArray<Record<string, unknown>>(data.series).map((item) => ({
    id: asString(item.name),
    value: Number(item.value ?? 0),
  }));
  return (
    <BlockShell title={asString(data.title)}>
      <CaseDonutChart data={normalized} />
    </BlockShell>
  );
}

export function GainsAreaChart({ block }: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const x = asArray<number | string>(data.x);
  const series = asArray<Record<string, unknown>>(data.series);
  const normalized = series.map((item) => ({
    id: asString(item.name, "Series"),
    data: asArray<number>(item.data).map((value, index) => ({
      x: x[index] ?? index,
      y: Number(value ?? 0),
    })),
  }));
  return (
    <BlockShell title={asString(data.title)}>
      <CaseAreaChart data={normalized} />
    </BlockShell>
  );
}

