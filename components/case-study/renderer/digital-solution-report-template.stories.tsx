import type { Meta, StoryObj } from "@storybook/react";

import mesTemplate from "@/templates/report_template/generated/digital-solution-report_template/sample.json";
import type { CaseStudyBlock, CaseStudyPageDocument, GenericBlock } from "@/lib/case-study/types";
import { CaseStudyBlockRenderer } from "./block-renderer";
import { CaseStudyPageRenderer } from "./page-renderer";

function normalizeBlock(block: GenericBlock): CaseStudyBlock {
  const normalizedBase = {
    ...block,
    schemaVersion: 1 as const,
  };

  if (
    block.type === "chart.gaugeSegments" &&
    block.data &&
    typeof block.data === "object" &&
    !("series" in block.data)
  ) {
    const segments = Array.isArray((block.data as { segments?: unknown[] }).segments)
      ? ((block.data as { segments: Array<{ value?: number }> }).segments)
      : [];
    return {
      ...normalizedBase,
      data: {
        ...block.data,
        series: [
          {
            name: "segments",
            data: segments.map((item) => Number(item?.value ?? 0)),
          },
        ],
      },
    };
  }

  return normalizedBase as CaseStudyBlock;
}

function normalizePage(input: { pageTitle: string; layout: GenericBlock[] }): CaseStudyPageDocument {
  return {
    schemaVersion: 1,
    pageTitle: input.pageTitle,
    layout: input.layout.map(normalizeBlock),
  };
}

const templatePages = (mesTemplate.pages || []).map((page) =>
  normalizePage({ pageTitle: page.pageTitle, layout: page.layout as GenericBlock[] }),
);

const firstPage = templatePages[0];
const uniqueBlocks: CaseStudyBlock[] = [];
const seenTypes = new Set<string>();
for (const page of templatePages) {
  for (const block of page.layout) {
    if (!seenTypes.has(block.type)) {
      seenTypes.add(block.type);
      uniqueBlocks.push(block);
    }
  }
}

const meta = {
  title: "Case Study/Templates/INALUM Digital Solution Report",
  component: CaseStudyPageRenderer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CaseStudyPageRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    document: firstPage,
  },
};

export const FullTemplatePages: Story = {
  render: () => (
    <div className="space-y-10">
      {templatePages.map((page) => (
        <CaseStudyPageRenderer key={page.pageTitle} document={page} />
      ))}
    </div>
  ),
};

export const ComponentCoverage: Story = {
  render: () => {
    const blockMap = new Map(uniqueBlocks.map((b) => [b.id, b]));
    return (
      <main className="mx-auto w-full max-w-6xl space-y-4 p-4 md:p-8">
        <h2 className="text-xl font-semibold">Unique Component Coverage</h2>
        {uniqueBlocks.map((block) => (
          <CaseStudyBlockRenderer
            key={block.id}
            block={block}
            context={{
              blockMap,
              renderRef: (id) => {
                const ref = blockMap.get(id);
                if (!ref) return null;
                return (
                  <CaseStudyBlockRenderer
                    key={`${block.id}-ref-${id}`}
                    block={ref}
                    context={{ blockMap, renderRef: () => null }}
                    path={[block.id, id]}
                  />
                );
              },
            }}
            path={[block.id]}
          />
        ))}
      </main>
    );
  },
};

export const EdgeCaseUnknownBlock: Story = {
  render: () => (
    <CaseStudyBlockRenderer
      block={
        {
          schemaVersion: 1,
          id: "mes-unknown-001",
          type: "unknown.type",
          data: {},
        } as never
      }
      context={{ blockMap: new Map(), renderRef: () => null }}
      path={[]}
    />
  ),
};
