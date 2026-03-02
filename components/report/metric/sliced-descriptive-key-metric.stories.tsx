import type { Meta, StoryObj } from "@storybook/react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import { SlicedDescriptiveKeyMetric } from "./sliced-descriptive-key-metric";

const SAMPLE_DESCRIPTION =
  "Some readers might prefer details like a breakdown of your funding while others, like your trustees, will be more interested in the challenges you encountered and the lessons you learned from them.";

const SAMPLE_ITEMS = [
  {
    icon: <FavoriteBorderIcon sx={{ fontSize: 48 }} aria-hidden="true" />,
    value: "750M",
    label: "The entries recorded",
  },
  {
    icon: <MyLocationOutlinedIcon sx={{ fontSize: 48 }} aria-hidden="true" />,
    value: "200M",
    label: "Scheduled hours",
  },
];

const meta = {
  title: "Report/SlicedDescriptiveKeyMetric",
  component: SlicedDescriptiveKeyMetric,
  tags: ["autodocs"],
} satisfies Meta<typeof SlicedDescriptiveKeyMetric>;

export default meta;
type Story = StoryObj<typeof meta>;

function renderInGrid(content: JSX.Element, spanClass: string) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className={spanClass}>{content}</div>
    </div>
  );
}

export const LeftNavy: Story = {
  render: () =>
    renderInGrid(
      <SlicedDescriptiveKeyMetric
        title="Key metrics"
        description={SAMPLE_DESCRIPTION}
        items={SAMPLE_ITEMS}
        variant="left"
        tone="navy"
      />,
      "col-span-12 md:col-span-6 lg:col-span-6",
    ),
};

export const RightNavy: Story = {
  render: () =>
    renderInGrid(
      <SlicedDescriptiveKeyMetric
        title="Key metrics"
        description={SAMPLE_DESCRIPTION}
        items={SAMPLE_ITEMS}
        variant="right"
        tone="navy"
      />,
      "col-span-12 md:col-span-6 lg:col-span-6",
    ),
};

export const LeftCharcoal: Story = {
  render: () =>
    renderInGrid(
      <SlicedDescriptiveKeyMetric
        title="Key metrics"
        description={SAMPLE_DESCRIPTION}
        items={SAMPLE_ITEMS}
        variant="left"
        tone="charcoal"
      />,
      "col-span-12 md:col-span-6 lg:col-span-6",
    ),
};

export const RightCharcoal: Story = {
  render: () =>
    renderInGrid(
      <SlicedDescriptiveKeyMetric
        title="Key metrics"
        description={SAMPLE_DESCRIPTION}
        items={SAMPLE_ITEMS}
        variant="right"
        tone="charcoal"
      />,
      "col-span-12 md:col-span-6 lg:col-span-6",
    ),
};

export const LeftLight: Story = {
  render: () =>
    renderInGrid(
      <SlicedDescriptiveKeyMetric
        title="Key metrics"
        description={SAMPLE_DESCRIPTION}
        items={SAMPLE_ITEMS}
        variant="left"
        tone="light"
      />,
      "col-span-12 md:col-span-6 lg:col-span-6",
    ),
};

export const PaletteOverride: Story = {
  render: () =>
    renderInGrid(
      <SlicedDescriptiveKeyMetric
        title="Key metrics"
        description={SAMPLE_DESCRIPTION}
        items={SAMPLE_ITEMS}
        variant="right"
        tone="navy"
        palette={{
          primary: "var(--primary)",
          secondary: "var(--secondary)",
          accent: "var(--accent)",
          background: "var(--primary)",
          text: "var(--background)",
        }}
      />,
      "col-span-12 md:col-span-6 lg:col-span-6",
    ),
};
