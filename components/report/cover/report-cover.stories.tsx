import type { Meta, StoryObj } from "@storybook/react";
import { ReportCover } from "./report-cover";

const meta = {
  title: "Report/ReportCover",
  component: ReportCover,
  tags: ["autodocs"],
} satisfies Meta<typeof ReportCover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "A Journey of Innovation and Success",
    subtitle:
      "Borcelle embarked on a transformative journey to turn innovative ideas into tangible business impacts.",
    reportLabel: "Case Study",
    yearLabel: "2030",
    companyName: "Borcelle",
    contact: {
      website: "www.machinevision.global",
      email: "info@machinevision.global",
      phone: "+62-8111-092-533",
    },
  },
};

export const CustomPalette: Story = {
  args: {
    ...Default.args,
    palette: {
      primary: "var(--primary)",
      secondary: "var(--secondary)",
      accent: "var(--accent)",
      background: "var(--background)",
      text: "var(--foreground)",
    },
  },
};

export const PaletteFallback: Story = {
  args: {
    ...Default.args,
    palette: {
      primary: "invalid",
      accent: "var(--accent)",
    },
  },
};
