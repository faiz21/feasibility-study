import type { Meta, StoryObj } from "@storybook/react";

import {
  CoverCompanyProfileCard,
  CoverHeroImage,
  CoverReportMetaCard,
  CoverTagline,
  CoverTitleStack,
  CoverYearBadge,
} from "./blocks";
import { getBlockByType } from "../story-utils";

const context = { blockMap: new Map(), renderRef: () => null };

const meta = {
  title: "Case Study/Cover Blocks",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeroImage: Story = {
  render: () => <CoverHeroImage block={getBlockByType("cover.heroImage")} context={context} path={[]} />,
};
export const TitleStack: Story = {
  render: () => <CoverTitleStack block={getBlockByType("cover.titleStack")} context={context} path={[]} />,
};
export const CompanyProfile: Story = {
  render: () => <CoverCompanyProfileCard block={getBlockByType("cover.companyProfileCard")} context={context} path={[]} />,
};
export const Tagline: Story = {
  render: () => <CoverTagline block={getBlockByType("cover.tagline")} context={context} path={[]} />,
};
export const YearBadge: Story = {
  render: () => <CoverYearBadge block={getBlockByType("cover.yearBadge")} context={context} path={[]} />,
};
export const ReportMeta: Story = {
  render: () => <CoverReportMetaCard block={getBlockByType("cover.reportMetaCard")} context={context} path={[]} />,
};

