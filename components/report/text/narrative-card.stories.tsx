import type { Meta, StoryObj } from "@storybook/react";
import { NarrativeCard } from "./narrative-card";

const meta = {
  title: "Report/NarrativeCard",
  component: NarrativeCard,
  tags: ["autodocs"],
} satisfies Meta<typeof NarrativeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content:
      "Borcelle embarked on a transformative journey to turn innovative ideas into tangible business impacts. Through a strategic partnership with Giggling Platypus Co. they implemented cutting-edge solutions designed to enhance operational efficiency, drive growth, and achieve significant competitive advantages.",
  },
};

export const CustomPalette: Story = {
  args: {
    ...Default.args,
    title: "Executive Overview",
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
