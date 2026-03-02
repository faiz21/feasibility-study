import type { Meta, StoryObj } from "@storybook/react";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import BackHandOutlinedIcon from "@mui/icons-material/BackHandOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { ServiceCategoryGrid } from "./service-category-grid";

const BASE_ITEMS = [
  {
    label: "Professional Service",
    icon: <BackHandOutlinedIcon sx={{ fontSize: "100%" }} />,
  },
  {
    label: "Information Technology",
    icon: <FavoriteBorderIcon sx={{ fontSize: "100%" }} />,
  },
  {
    label: "Accounting Management",
    icon: <BarChartOutlinedIcon sx={{ fontSize: "100%" }} />,
  },
];

const meta = {
  title: "Report/Service Category Grid",
  component: ServiceCategoryGrid,
  tags: ["autodocs"],
  args: {
    items: BASE_ITEMS.map((item) => ({ ...item, tone: "blue" as const })),
    layout: "left",
  },
} satisfies Meta<typeof ServiceCategoryGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftBlueSet: Story = {
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <ServiceCategoryGrid {...args} />
    </div>
  ),
};

export const RightMixedTones: Story = {
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <ServiceCategoryGrid
        {...args}
        layout="right"
        items={[
          { ...BASE_ITEMS[0], tone: "gray" },
          { ...BASE_ITEMS[1], tone: "blue" },
          { ...BASE_ITEMS[2], tone: "charcoal" },
        ]}
      />
    </div>
  ),
};

export const LeftThreeRows: Story = {
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <ServiceCategoryGrid
        {...args}
        layout="left"
        items={[
          { ...BASE_ITEMS[0], tone: "blue" },
          { ...BASE_ITEMS[1], tone: "blue" },
          { ...BASE_ITEMS[2], tone: "blue" },
          { ...BASE_ITEMS[0], tone: "charcoal" },
          { ...BASE_ITEMS[1], tone: "charcoal" },
          { ...BASE_ITEMS[2], tone: "charcoal" },
          { ...BASE_ITEMS[0], tone: "gray" },
          { ...BASE_ITEMS[1], tone: "gray" },
          { ...BASE_ITEMS[2], tone: "gray" },
        ]}
      />
    </div>
  ),
};

export const ImageLikeComposition: Story = {
  render: () => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <ServiceCategoryGrid
        gridSpan={{ base: 12, md: 6, lg: 6 }}
        layout="left"
        items={[
          { ...BASE_ITEMS[0], tone: "blue" },
          { ...BASE_ITEMS[1], tone: "blue" },
          { ...BASE_ITEMS[2], tone: "blue" },
          { ...BASE_ITEMS[0], tone: "charcoal" },
          { ...BASE_ITEMS[1], tone: "charcoal" },
          { ...BASE_ITEMS[2], tone: "charcoal" },
          { ...BASE_ITEMS[0], tone: "gray" },
          { ...BASE_ITEMS[1], tone: "gray" },
          { ...BASE_ITEMS[2], tone: "gray" },
        ]}
      />
      <ServiceCategoryGrid
        gridSpan={{ base: 12, md: 6, lg: 6 }}
        layout="right"
        items={[
          { ...BASE_ITEMS[0], tone: "gray" },
          { ...BASE_ITEMS[1], tone: "blue" },
          { ...BASE_ITEMS[2], tone: "charcoal" },
        ]}
      />
    </div>
  ),
};

export const PaletteOverride: Story = {
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <ServiceCategoryGrid
        {...args}
        items={[
          { ...BASE_ITEMS[0], tone: "blue" },
          { ...BASE_ITEMS[1], tone: "blue" },
          { ...BASE_ITEMS[2], tone: "blue" },
        ]}
        palette={{
          primary: "var(--primary)",
          secondary: "var(--secondary)",
          accent: "var(--accent)",
          background: "var(--background)",
          text: "var(--foreground)",
        }}
      />
    </div>
  ),
};
