import type { Meta, StoryObj } from "@storybook/react";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import { IconCard } from "./icon-card";

const meta = {
  title: "Report/IconCard",
  component: IconCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="grid grid-cols-12 gap-4 bg-background p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IconCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Boost Sales",
    description: "Boost sales by 25% within the first year of implementation.",
    icon: <BarChartOutlinedIcon sx={{ fontSize: 24 }} aria-hidden="true" />,
    size: "md",
    gridSpan: { base: 12, md: 6, lg: 4 },
  },
};

export const SizeOptions: Story = {
  render: () => (
    <>
      <IconCard title="Small" description="Compact card size." size="sm" gridSpan={{ base: 12, lg: 4 }} />
      <IconCard title="Medium" description="Balanced card size." size="md" gridSpan={{ base: 12, lg: 4 }} />
      <IconCard title="Large" description="Expanded card size." size="lg" gridSpan={{ base: 12, lg: 4 }} />
    </>
  ),
};
