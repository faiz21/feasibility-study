import type { Meta, StoryObj } from "@storybook/react";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { IconList } from "./icon-list";
import { sampleCaseStudy } from "@/lib/case-study/sample";

const ICONS = [CampaignOutlinedIcon, InsightsOutlinedIcon, FlagOutlinedIcon, VerifiedUserOutlinedIcon, GroupsOutlinedIcon];

const defaultItems = (sampleCaseStudy.goals ?? []).slice(0, 5).map((goal, index) => ({
  title: goal.title,
  description: goal.description,
  icon: ICONS[index] ? (
    (() => {
      const Icon = ICONS[index];
      return <Icon sx={{ fontSize: 28 }} aria-hidden="true" />;
    })()
  ) : undefined,
}));

const meta = {
  title: "Report/IconList",
  component: IconList,
  tags: ["autodocs"],
  args: {
    title: "Goals and Objectives",
    items: defaultItems,
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <IconList {...args} />
    </div>
  ),
} satisfies Meta<typeof IconList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CompactSmall: Story = {
  args: {
    size: "sm",
    density: "compact",
    iconSize: "sm",
    gridSpan: { base: 12, lg: 6 },
  },
};

export const ComfortableLarge: Story = {
  args: {
    size: "lg",
    density: "comfortable",
    iconSize: "lg",
    gridSpan: { base: 12, lg: 8 },
  },
};
