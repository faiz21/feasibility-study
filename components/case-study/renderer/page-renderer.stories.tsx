import type { Meta, StoryObj } from "@storybook/react";

import { CASE_STUDY_DOCUMENT } from "@/lib/case-study/catalog";
import { CaseStudyPageRenderer } from "./page-renderer";
import { CaseStudyBlockRenderer } from "./block-renderer";

const meta = {
  title: "Case Study/Renderer",
  component: CaseStudyPageRenderer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CaseStudyPageRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = {
  args: {
    document: CASE_STUDY_DOCUMENT,
  },
};

export const UnknownTypeFallback: Story = {
  args: {
    document: CASE_STUDY_DOCUMENT,
  },
  render: () => (
    <CaseStudyBlockRenderer
      block={
        {
          schemaVersion: 1,
          id: "unknown-1",
          type: "unknown.type",
          data: {},
        } as never
      }
      context={{ blockMap: new Map(), renderRef: () => null }}
      path={[]}
    />
  ),
};
