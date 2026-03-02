import type { Meta, StoryObj } from "@storybook/react";
import { ServiceOperationsShowcaseSection } from "./service-operations-showcase-section";

const meta = {
  title: "Report/ServiceOperationsShowcaseSection",
  component: ServiceOperationsShowcaseSection,
  tags: ["autodocs"],
  args: {
    challengeSolutionResults: {
      challengeText:
        "The organization faces several operational challenges including collaboration gaps, inefficient scheduling, and delayed reporting.",
      solutionText:
        "Implementing client portal updates, automated scheduling, and real-time tracking dashboards can significantly improve workflow efficiency.",
      results: [
        { value: "40%", description: "faster project turnaround time" },
        { value: "25%", description: "improvement in resource utilization" },
        { value: "30%", description: "increase in positive client feedback" },
        { value: "50%", description: "boosting team efficiency" },
      ],
    },
    packages: [
      {
        title: "Brand Clarity Session",
        description: "A 1-hour consultation with summary brief to define your brand tone and messaging.",
        priceLabel: "Starting from $48.00",
      },
      {
        title: "Visual Strategy & Content Map",
        description: "Includes social media guidelines, post ideas, and a 30-day content roadmap.",
        priceLabel: "Starting from $52.00",
      },
      {
        title: "Full Campaign Planning",
        description: "End-to-end content strategy with goal setting, mapping, and performance review.",
        priceLabel: "Starting from $55.00",
      },
    ],
    workflowItems: [
      "Intro call & client brief",
      "Strategic alignment",
      "Creative development",
      "Final presentation & handover",
      "Follow-up review session",
    ],
    highlightItems: [
      "Worked with over 25 businesses",
      "Average 3x engagement boost post-launch",
      "Service availability: Weekdays 10AM-6PM",
    ],
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <ServiceOperationsShowcaseSection {...args} />
    </div>
  ),
} satisfies Meta<typeof ServiceOperationsShowcaseSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageLikeComposition: Story = {};

export const PaletteOverride: Story = {
  args: {
    palette: {
      primary: "var(--primary)",
      secondary: "var(--secondary)",
      accent: "var(--accent)",
      background: "var(--background)",
      text: "var(--foreground)",
    },
  },
};
