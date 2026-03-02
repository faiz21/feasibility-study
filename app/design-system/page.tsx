import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ColorSwatch } from "@/components/design-system/color-swatch";
import { DesignSystemSection } from "@/components/design-system/section";
import {
  DesignSystemSidebarNav,
  type SidebarSection,
} from "@/components/design-system/sidebar-nav";
import { PrintButton } from "@/components/design-system/print-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  neutralScaleTokens,
  semanticColorTokens,
  statusColorTokens,
} from "@/lib/design-system/tokens";
import { RadarChartPreview } from "@/components/design-system/charts/radar-chart";
import { HeatmapMatrixPreview } from "@/components/design-system/charts/heatmap-matrix";
import { BarChartPreview } from "@/components/design-system/charts/bar-chart";
import { TimelineRoadmapPreview } from "@/components/design-system/charts/timeline-roadmap";
import { RoiWaterfallPreview } from "@/components/design-system/charts/roi-waterfall";
import { PrioritizationQuadrantPreview } from "@/components/design-system/charts/prioritization-quadrant";

export default function DesignSystemPage() {
  const sections: SidebarSection[] = [
    { id: "overview", label: "Overview" },
    { id: "colors", label: "Color system" },
    { id: "typography", label: "Typography" },
    { id: "components", label: "Components" },
    { id: "data-viz", label: "Data visualization" },
    { id: "enterprise", label: "Enterprise readiness" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 xl:grid-cols-[250px_1fr_320px]">
        <aside className="ds-print-hidden hidden border-r bg-background xl:block">
          <div className="sticky top-0 h-screen px-3 py-5">
            <div className="mb-5 flex items-center justify-between px-3">
              <Link href={"/"} className="text-sm font-semibold tracking-tight">
                Strategy Workspace
              </Link>
            </div>
            <DesignSystemSidebarNav sections={sections} />
            <div className="mt-6 px-3">
              <div className="rounded-lg border bg-card p-3 text-xs text-muted-foreground">
                Minimal color. High contrast. Content-first.
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="ds-print-hidden sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3">
              <div className="flex min-w-0 items-center gap-3 text-sm">
                <Link href={"/"} className="font-medium text-muted-foreground">
                  Home
                </Link>
                <span className="text-muted-foreground/60">/</span>
                <span className="truncate font-semibold">Design System</span>
              </div>
              <div className="flex items-center gap-2">
                <PrintButton />
                <ThemeSwitcher />
              </div>
            </div>
          </div>

          <div className="ds-print-page mx-auto w-full max-w-5xl px-5 py-10">
            <DesignSystemSection
              id="overview"
              title="Vuexy-inspired tokenized UI"
              description="Modern dashboard aesthetics with semantic tokens, clear hierarchy, and dark-mode parity."
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg tracking-tight">
                    Executive narrative ready
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border bg-neutral-50 p-4">
                      <div className="text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                        PRINCIPLES
                      </div>
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        <li>Token-first color application</li>
                        <li>Card-based modular dashboard blocks</li>
                        <li>Subtle elevation and rounded surfaces</li>
                        <li>Consistent interaction and focus states</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border bg-neutral-50 p-4">
                      <div className="text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                        STATUS SEMANTICS
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge className="bg-success text-success-foreground hover:bg-success">
                          Value opportunity
                        </Badge>
                        <Badge className="bg-warning text-warning-foreground hover:bg-warning">
                          Risk
                        </Badge>
                        <Badge className="bg-error text-error-foreground hover:bg-error">
                          Error state
                        </Badge>
                        <Badge className="bg-info text-info-foreground hover:bg-info">
                          Strategic initiative
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DesignSystemSection>

            <div className="h-10" />

            <DesignSystemSection
              id="colors"
              title="Color System"
              description="Semantic tokens + grayscale scale. Minimal usage (emphasis only)."
            >
              <div className="space-y-6">
                <div>
                  <div className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                    SEMANTIC TOKENS
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {semanticColorTokens.map((token) => (
                      <ColorSwatch
                        key={token.name}
                        name={token.name}
                        description={token.description}
                        sampleClassName={token.sampleClassName}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                    NEUTRAL SCALE (50–900)
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {neutralScaleTokens.map((token) => (
                      <ColorSwatch
                        key={token.name}
                        name={token.name}
                        sampleClassName={token.sampleClassName}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                    SYSTEM STATUS TOKENS
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {statusColorTokens.map((token) => (
                      <ColorSwatch
                        key={token.name}
                        name={token.name}
                        description={token.description}
                        sampleClassName={token.sampleClassName}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </DesignSystemSection>

            <div className="h-10" />

            <DesignSystemSection
              id="typography"
              title="Typography"
              description="Modern sans-serif system stack with clear hierarchy and generous whitespace."
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg tracking-tight">
                    Hierarchy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-3xl font-semibold tracking-tight">
                      H1 — Section headline
                    </div>
                    <div className="text-xl font-semibold tracking-tight">
                      H2 — Insight header
                    </div>
                    <div className="text-base font-semibold tracking-tight">
                      H3 — Supporting structure
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm leading-6 text-foreground">
                      Analytical body copy prioritizes clarity. Use short,
                      specific sentences. Prefer numbers, ranges, and explicit
                      assumptions.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Secondary detail stays muted and aligned. Avoid decorative
                      language and visual noise.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </DesignSystemSection>

            <div className="h-10" />

            <DesignSystemSection id="components" title="Components">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base tracking-tight">
                      Buttons
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="destructive">Error</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base tracking-tight">
                      Inputs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" placeholder="name@company.com" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="tos" />
                      <Label htmlFor="tos">Accept terms</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base tracking-tight">
                      Badges (emphasis only)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Badge variant="outline">Neutral</Badge>
                    <Badge className="bg-info text-info-foreground hover:bg-info">
                      Strategic
                    </Badge>
                    <Badge className="bg-warning text-warning-foreground hover:bg-warning">
                      Risk
                    </Badge>
                    <Badge className="bg-success text-success-foreground hover:bg-success">
                      Upside
                    </Badge>
                    <Badge className="bg-error text-error-foreground hover:bg-error">
                      Error
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base tracking-tight">
                      Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Alignment grid</span>
                      <span className="font-medium text-foreground">
                        12-col / max 5xl
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Whitespace</span>
                      <span className="font-medium text-foreground">
                        generous, consistent
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Radii</span>
                      <span className="font-medium text-foreground">
                        0.4rem base
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DesignSystemSection>

            <div className="h-10" />

            <DesignSystemSection
              id="data-viz"
              title="Data Visualization"
              description="Flat, analytical visuals. No gradients. No playful styles."
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base tracking-tight">
                      Radar chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadarChartPreview />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base tracking-tight">
                      Heatmap matrix
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HeatmapMatrixPreview />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base tracking-tight">
                      Bar chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChartPreview />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base tracking-tight">
                      Timeline roadmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TimelineRoadmapPreview />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base tracking-tight">
                      ROI waterfall
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RoiWaterfallPreview />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base tracking-tight">
                      Prioritization quadrant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PrioritizationQuadrantPreview />
                  </CardContent>
                </Card>
              </div>
            </DesignSystemSection>

            <div className="h-10" />

            <DesignSystemSection
              id="enterprise"
              title="Enterprise readiness"
              description="Print/PDF friendly and built for secure internal environments."
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base tracking-tight">
                    Export & presentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-foreground">
                        Print/PDF
                      </div>
                      <div>Hides navigation chrome when printing.</div>
                    </div>
                    <Badge variant="outline">Ready</Badge>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-foreground">
                        Content-first layout
                      </div>
                      <div>Optimized for executive scanning.</div>
                    </div>
                    <Badge variant="outline">Ready</Badge>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-foreground">
                        Motion discipline
                      </div>
                      <div>Subtle transitions only.</div>
                    </div>
                    <Badge variant="outline">Ready</Badge>
                  </div>
                </CardContent>
              </Card>
            </DesignSystemSection>
          </div>
        </main>

        <aside className="ds-print-hidden hidden border-l bg-background xl:block">
          <div className="sticky top-0 h-screen px-5 py-5">
            <div className="text-xs font-semibold tracking-[0.14em] text-muted-foreground">
              INSIGHTS
            </div>
            <div className="mt-3 space-y-3 text-sm">
              <div className="rounded-lg border bg-card p-4">
                <div className="font-semibold tracking-tight">
                  Decision support, not decoration
                </div>
                <p className="mt-2 text-muted-foreground">
                  Default to neutral and structure. Use blue/status colors only
                  to direct attention to a decision.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="font-semibold tracking-tight">
                  Scroll-based storytelling
                </div>
                <p className="mt-2 text-muted-foreground">
                  Sidebar anchors support narrative flow without heavy
                  animation.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="font-semibold tracking-tight">
                  Executive presentation mode
                </div>
                <p className="mt-2 text-muted-foreground">
                  Use the Print/PDF control for clean exports.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
