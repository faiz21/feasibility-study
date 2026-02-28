import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudySection } from "./section";

const meta = {
  title: "Case Study/Section",
  component: CaseStudySection,
  tags: ["autodocs"],
  args: {
    title: "Overview",
    description: "Optional description goes here.",
    children: (
      <p className="text-sm text-muted-foreground">
        This is a generic section wrapper used throughout the template.
      </p>
    ),
  },
} satisfies Meta<typeof CaseStudySection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoDescription: Story = {
  args: {
    description: undefined,
  },
};

