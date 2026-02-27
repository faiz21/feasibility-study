import { PillarsBlock, type Pillar } from "@/components/report/pillars-block";
import { QuoteBlock } from "@/components/report/quote-block";

// ─── Demo data ────────────────────────────────────────────────────────────────

const feasibilityPillars: Pillar[] = [
  {
    icon: "📐",
    title: "Technical Feasibility",
    description:
      "Assessment of the existing technology stack, infrastructure requirements, and the team's capacity to build and maintain the proposed system.",
    tag: "Core",
    accent: "blue",
  },
  {
    icon: "💰",
    title: "Financial Feasibility",
    description:
      "Cost-benefit analysis covering capital expenditure, operating costs, projected revenue streams, and expected return on investment.",
    tag: "Core",
    accent: "green",
  },
  {
    icon: "🏪",
    title: "Market Feasibility",
    description:
      "Evaluation of market size, target demographics, competitive landscape, and demand signals for the proposed product or service.",
    tag: "Core",
    accent: "amber",
  },
  {
    icon: "⚖️",
    title: "Legal & Regulatory",
    description:
      "Review of applicable regulations, licensing requirements, data-privacy obligations, and compliance risks across relevant jurisdictions.",
    accent: "violet",
  },
  {
    icon: "🏗️",
    title: "Operational Feasibility",
    description:
      "Analysis of business process changes, staffing needs, supply-chain dependencies, and organisational readiness to support the initiative.",
    accent: "rose",
  },
  {
    icon: "⏱️",
    title: "Schedule Feasibility",
    description:
      "Realistic timeline assessment including milestone planning, critical-path identification, and risk-adjusted delivery projections.",
  },
];

const riskPillars: Pillar[] = [
  {
    icon: "🔴",
    title: "High Impact Risks",
    description:
      "Regulatory non-compliance and technology lock-in present the most significant exposure and require immediate mitigation planning.",
    tag: "Urgent",
    accent: "rose",
  },
  {
    icon: "🟡",
    title: "Medium Impact Risks",
    description:
      "Talent acquisition delays and third-party API dependencies carry moderate probability and require active monitoring.",
    tag: "Monitor",
    accent: "amber",
  },
  {
    icon: "🟢",
    title: "Low Impact Risks",
    description:
      "Minor UX friction and localisation gaps are manageable within the current sprint cadence without dedicated mitigation budget.",
    tag: "Accepted",
    accent: "green",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-20">
      {/* ── Page header ── */}
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Feasibility Study · 2026
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          Project Aurora — Executive Report
        </h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          This report summarises findings across six feasibility dimensions and
          provides a consolidated recommendation for project approval.
        </p>
      </header>

      <div className="h-px bg-border" />

      {/* ── Executive quote ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Executive Perspective
        </h2>
        <QuoteBlock
          variant="prominent"
          quote="The data tells a clear story: the market window is open, the technology is proven, and the team has the operational maturity to execute. The question is no longer whether — it's when."
          author="Dr. Aisha Patel"
          role="Chief Strategy Officer"
          source="Steering Committee — January 2026"
        />
      </section>

      {/* ── Feasibility pillars ── */}
      <PillarsBlock
        heading="Feasibility Dimensions"
        subheading="Each pillar was evaluated independently by a domain specialist. Findings are summarised below and expanded in the appendices."
        pillars={feasibilityPillars}
        columns={3}
      />

      {/* ── Inline bordered quotes ── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Stakeholder Insights
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <QuoteBlock
            variant="bordered"
            quote="Our load-testing confirmed the platform handles 10× projected peak traffic with sub-200 ms p99 latency. Technical risk is low."
            author="Tomás Herrera"
            role="Lead Infrastructure Engineer"
          />
          <QuoteBlock
            variant="bordered"
            quote="Unit economics reach break-even at 4,200 monthly active users — a threshold our comparable launches have consistently crossed by month eight."
            author="Mei-Ling Zhou"
            role="Head of Finance"
            source="Internal Modelling, Feb 2026"
          />
        </div>
      </section>

      {/* ── Risk pillars ── */}
      <PillarsBlock
        heading="Risk Register Summary"
        subheading="Risks are classified by potential business impact. Full probability and exposure scores appear in Appendix C."
        pillars={riskPillars}
        columns={3}
      />

      {/* ── Filled / inverted quote for recommendation ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Recommendation</h2>
        <QuoteBlock
          variant="filled"
          quote="The Feasibility Working Group unanimously recommends proceeding to Phase 2 development. All six feasibility dimensions return a positive finding, and identified risks carry adequate mitigation plans."
          author="Feasibility Working Group"
          source="Final Report — 27 Feb 2026"
        />
      </section>

      {/* ── Draft / placeholder quote ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Pending Input{" "}
          <span className="text-sm font-normal text-muted-foreground">
            (draft)
          </span>
        </h2>
        <QuoteBlock
          variant="draft"
          quote="[Legal review pending — counsel's formal sign-off on cross-border data transfer obligations expected by 15 March 2026.]"
          author="Legal Team"
          role="Placeholder"
        />
      </section>
    </main>
  );
}
