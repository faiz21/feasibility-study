import type { Meta, StoryObj } from "@storybook/react";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { BoxWithIconCard } from "./box-with-icon-card";

const meta = {
  title: "Report/BoxWithIconCard",
  component: BoxWithIconCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="grid grid-cols-12 gap-4 bg-background p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BoxWithIconCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    title: "Brand Awareness",
    description: "Increase brand awareness by 40% in 12 months.",
    icon: <CampaignOutlinedIcon sx={{ fontSize: 24 }} aria-hidden="true" />,
  },
  {
    title: "Boost Sales",
    description: "Boost sales by 25% within the first year.",
    icon: <BarChartOutlinedIcon sx={{ fontSize: 24 }} aria-hidden="true" />,
  },
  {
    title: "Market Expansion",
    description: "Expand market reach by entering 2-3 regional markets.",
    icon: <PublicOutlinedIcon sx={{ fontSize: 24 }} aria-hidden="true" />,
  },
];

export const Default: Story = {
  args: {
    title: "Goals and Objectives",
    items,
    size: "md",
    gridSpan: { base: 12, lg: 12 },
  },
};

export const SizeOptions: Story = {
  render: () => (
    <>
      <BoxWithIconCard title="Small" items={items} size="sm" />
      <BoxWithIconCard title="Medium" items={items} size="md" />
      <BoxWithIconCard title="Large" items={items} size="lg" />
    </>
  ),
};
