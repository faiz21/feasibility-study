"use client";

import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";

type BarChartProps = {
  data: { label: string; value: number }[];
};

type DonutChartProps = {
  data: { id: string; value: number }[];
};

type AreaChartProps = {
  data: { id: string; data: { x: string | number; y: number }[] }[];
};

export function CaseBarChart({ data }: BarChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveBar
        data={data}
        keys={["value"]}
        indexBy="label"
        margin={{ top: 16, right: 16, bottom: 36, left: 36 }}
        padding={0.35}
        borderRadius={4}
        colors={["hsl(var(--chart-2))"]}
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 0, tickPadding: 8 }}
        axisLeft={{ tickSize: 0, tickPadding: 8 }}
        enableLabel={false}
        role="application"
        ariaLabel="Case study bar chart"
      />
    </div>
  );
}

export function CaseDonutChart({ data }: DonutChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsivePie
        data={data}
        margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
        innerRadius={0.58}
        padAngle={1}
        cornerRadius={3}
        activeOuterRadiusOffset={4}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        colors={{ scheme: "set2" }}
        role="application"
        ariaLabel="Case study donut chart"
      />
    </div>
  );
}

export function CaseGaugeChart({ data }: DonutChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsivePie
        data={data}
        startAngle={-90}
        endAngle={90}
        margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
        innerRadius={0.6}
        padAngle={0.6}
        cornerRadius={2}
        activeOuterRadiusOffset={2}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        colors={{ scheme: "paired" }}
        role="application"
        ariaLabel="Case study gauge chart"
      />
    </div>
  );
}

export function CaseAreaChart({ data }: AreaChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 36, left: 36 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 0, tickPadding: 8 }}
        axisLeft={{ tickSize: 0, tickPadding: 8 }}
        enablePoints={true}
        pointSize={8}
        pointBorderWidth={1}
        pointBorderColor={{ from: "seriesColor" }}
        useMesh={true}
        enableArea={true}
        colors={["hsl(var(--chart-2))"]}
        role="application"
        ariaLabel="Case study area chart"
      />
    </div>
  );
}

