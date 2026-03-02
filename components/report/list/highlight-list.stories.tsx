import type { Meta, StoryObj } from "@storybook/react";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import { HighlightList } from "./highlight-list";

const baseItems = [
  "Worked with over 25 businesses",
  "Average 3x engagement boost post-launch",
  "Service availability: Weekdays 10AM-6PM",
];

const iconItems = [
  { label: "Data-driven planning", icon: <BarChartOutlinedIcon sx={{ fontSize: 16 }} aria-hidden="true" /> },
  { label: "Customer-first engagement", icon: <FavoriteBorderIcon sx={{ fontSize: 16 }} aria-hidden="true" /> },
  { label: "Iterative improvement", icon: <LightbulbOutlinedIcon sx={{ fontSize: 16 }} aria-hidden="true" /> },
];

const meta = {
  title: "Report/HighlightList",
  component: HighlightList,
  tags: ["autodocs"],
  args: {
    title: "Highlights",
    items: baseItems,
    mode: "checklist",
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <HighlightList {...args} />
    </div>
  ),
} satisfies Meta<typeof HighlightList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checklist: Story = {};

export const Number: Story = {
  args: {
    title: "Workflow Process",
    items: [
      "Intro call & client brief",
      "Strategic alignment",
      "Creative development",
      "Final presentation & handover",
      "Follow-up review session",
    ],
    mode: "number",
  },
};

export const Bullet: Story = {
  args: {
    items: baseItems,
    mode: "bullet",
  },
};

export const Icon: Story = {
  args: {
    items: iconItems,
    mode: "icon",
  },
};
