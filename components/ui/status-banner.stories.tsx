import type { Meta, StoryObj } from "@storybook/react";
import { StatusBanner } from "@/components/ui/status-banner";

const meta = {
  title: "UI/StatusBanner",
  component: StatusBanner,
  tags: ["autodocs"],
  args: {
    tone: "info",
    children: "Preview mode is active and submission is disabled.",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["success", "critical", "warning", "info"],
    },
  },
} satisfies Meta<typeof StatusBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    tone: "success",
    children: "Client report published successfully.",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
    children: "Client access has not been configured for this report type yet.",
  },
};

export const Critical: Story = {
  args: {
    tone: "critical",
    children: "Failed to load the report payload.",
  },
};
