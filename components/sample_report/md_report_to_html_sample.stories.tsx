import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "sample_report/md-report-to-html-sample",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

export const Sample: Story = {
  render: () => (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        title="Automation Readiness Assessment (Sample)"
        src="/sample_report/md_report_to_html_sample_sample.html"
        style={{ width: "100%", height: "100%", border: 0 }}
      />
    </div>
  ),
};
