import type { Meta, StoryObj } from "@storybook/react";
import { ReportQuoteBackdrop, ReportQuoteRibbon } from "./quote-blocks";

const SAMPLE_QUOTE =
  "By prioritizing customer experience and community, Borcelle proved that bookstores can thrive in the digital age.";

const meta = {
  title: "Report/Quote Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderInGrid(content: JSX.Element, spanClass: string) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className={spanClass}>{content}</div>
    </div>
  );
}

export const BackdropMd: Story = {
  render: () =>
    renderInGrid(
      <ReportQuoteBackdrop quote={SAMPLE_QUOTE} size="md" />,
      "col-span-12 md:col-span-8",
    ),
};

export const BackdropSm: Story = {
  render: () =>
    renderInGrid(
      <ReportQuoteBackdrop quote={SAMPLE_QUOTE} size="sm" />,
      "col-span-12 md:col-span-4",
    ),
};

export const BackdropLg: Story = {
  render: () =>
    renderInGrid(
      <ReportQuoteBackdrop quote={SAMPLE_QUOTE} size="lg" />,
      "col-span-12",
    ),
};

export const RibbonMd: Story = {
  render: () =>
    renderInGrid(
      <ReportQuoteRibbon
        items={["YOUR HEALTH DESERVES TRUSTED CARE - TODAY AND EVERY DAY."]}
        repeat={4}
        size="md"
      />,
      "col-span-12 md:col-span-8",
    ),
};

export const RibbonSm: Story = {
  render: () =>
    renderInGrid(
      <ReportQuoteRibbon
        items={["YOUR HEALTH DESERVES TRUSTED CARE - TODAY AND EVERY DAY."]}
        repeat={4}
        size="sm"
      />,
      "col-span-12 md:col-span-4",
    ),
};

export const RibbonLg: Story = {
  render: () =>
    renderInGrid(
      <ReportQuoteRibbon
        items={["YOUR HEALTH DESERVES TRUSTED CARE - TODAY AND EVERY DAY."]}
        repeat={4}
        size="lg"
      />,
      "col-span-12",
    ),
};

export const CustomPalette: Story = {
  render: () =>
    renderInGrid(
      <ReportQuoteBackdrop
        quote={SAMPLE_QUOTE}
        size="md"
        palette={{
          primary: "var(--primary)",
          secondary: "var(--secondary)",
          accent: "var(--accent)",
          background: "var(--background)",
          text: "var(--foreground)",
        }}
      />,
      "col-span-12 md:col-span-8",
    ),
};
