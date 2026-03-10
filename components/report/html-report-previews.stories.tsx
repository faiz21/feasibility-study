import type { Meta, StoryObj } from "@storybook/react";

type ReportIframeProps = {
  src: string;
  title: string;
  height?: string;
};

function ReportIframe({ src, title, height = "100vh" }: ReportIframeProps) {
  return (
    <iframe
      src={src}
      title={title}
      style={{
        width: "100%",
        height,
        border: 0,
        background: "white",
      }}
    />
  );
}

const meta = {
  title: "Reports/HTML Previews",
  component: ReportIframe,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    src: { control: "text" },
    title: { control: "text" },
    height: { control: "text" },
  },
} satisfies Meta<typeof ReportIframe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AutomationAssessmentReport: Story = {
  name: "Automation Assessment",
  args: {
    title: "Automation Assessment Report",
    src: "/report/automation_assessment_report.html",
    height: "100vh",
  },
};

export const CybersecurityAssessmentReport: Story = {
  name: "Cybersecurity Assessment",
  args: {
    title: "Cybersecurity Assessment Report",
    src: "/report/cybersecurity_assessment_report.html",
    height: "100vh",
  },
};

