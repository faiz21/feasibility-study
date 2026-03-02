import type { Meta, StoryObj } from "@storybook/react";
import { ChallengeSolutionResultsCards } from "./challenge-solution-results-cards";

const meta = {
  title: "Report/ChallengeSolutionResultsCards",
  component: ChallengeSolutionResultsCards,
  tags: ["autodocs"],
  args: {
    challengeText:
      "The organization faces several operational challenges including collaboration gaps, inefficient scheduling, and delayed reporting.",
    solutionText:
      "Implementing client portal updates, automated scheduling, and real-time tracking dashboards can significantly improve workflow efficiency.",
    results: [
      { value: "40%", description: "faster project turnaround time" },
      { value: "25%", description: "improvement in resource utilization" },
      { value: "30%", description: "increase in positive client feedback" },
    ],
  },
  render: (args) => (
    <div className="grid grid-cols-12 gap-4 bg-muted p-4 md:p-6">
      <ChallengeSolutionResultsCards {...args} />
    </div>
  ),
} satisfies Meta<typeof ChallengeSolutionResultsCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithExtraResult: Story = {
  args: {
    results: [
      { value: "40%", description: "faster project turnaround time" },
      { value: "25%", description: "improvement in resource utilization" },
      { value: "30%", description: "increase in positive client feedback" },
      { value: "50%", description: "boosting team efficiency" },
    ],
  },
};
