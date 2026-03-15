import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "name@company.com",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "disabled@example.com",
  },
};

export const Filled: Story = {
  args: {
    value: "operations@client.com",
  },
};
