import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Pillar card variants ────────────────────────────────────────────────────

const pillarCardVariants = cva(
  "group relative flex flex-col gap-4 rounded-xl border p-6 transition-shadow hover:shadow-md",
  {
    variants: {
      accent: {
        default: "border-border bg-card text-card-foreground",
        blue: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100",
        green:
          "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/40 dark:text-green-100",
        amber:
          "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100",
        violet:
          "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-100",
        rose: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100",
      },
    },
    defaultVariants: { accent: "default" },
  },
);

const pillarIconVariants = cva(
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold",
  {
    variants: {
      accent: {
        default: "bg-primary/10 text-primary",
        blue: "bg-blue-200/60 text-blue-700 dark:bg-blue-800/60 dark:text-blue-300",
        green:
          "bg-green-200/60 text-green-700 dark:bg-green-800/60 dark:text-green-300",
        amber:
          "bg-amber-200/60 text-amber-700 dark:bg-amber-800/60 dark:text-amber-300",
        violet:
          "bg-violet-200/60 text-violet-700 dark:bg-violet-800/60 dark:text-violet-300",
        rose: "bg-rose-200/60 text-rose-700 dark:bg-rose-800/60 dark:text-rose-300",
      },
    },
    defaultVariants: { accent: "default" },
  },
);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Pillar {
  /** Short label shown in the icon cell (e.g. "01", an emoji, or an SVG node) */
  icon?: React.ReactNode;
  title: string;
  description: string;
  /** Optional badge/tag below the description */
  tag?: string;
  accent?: VariantProps<typeof pillarCardVariants>["accent"];
}

export interface PillarsBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section heading shown above the grid */
  heading?: string;
  /** Optional sub-heading / lead text */
  subheading?: string;
  pillars: Pillar[];
  /**
   * Grid column count on medium+ screens.
   * Defaults to auto (2 on md, 3 on lg).
   */
  columns?: 2 | 3 | 4;
}

// ─── Column map ──────────────────────────────────────────────────────────────

const columnsClass: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

// ─── Component ───────────────────────────────────────────────────────────────

export function PillarsBlock({
  heading,
  subheading,
  pillars,
  columns = 3,
  className,
  ...props
}: PillarsBlockProps) {
  return (
    <section className={cn("w-full space-y-8", className)} {...props}>
      {/* Header */}
      {(heading || subheading) && (
        <div className="space-y-2">
          {heading && (
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-muted-foreground max-w-2xl">{subheading}</p>
          )}
        </div>
      )}

      {/* Divider */}
      {(heading || subheading) && (
        <div className="h-px w-full bg-gradient-to-r from-border via-border/50 to-transparent" />
      )}

      {/* Grid */}
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          columnsClass[columns] ?? columnsClass[3],
        )}
      >
        {pillars.map((pillar, index) => (
          <PillarCard key={index} pillar={pillar} />
        ))}
      </div>
    </section>
  );
}

// ─── Internal card ───────────────────────────────────────────────────────────

function PillarCard({ pillar }: { pillar: Pillar }) {
  const { icon, title, description, tag, accent = "default" } = pillar;

  return (
    <div className={cn(pillarCardVariants({ accent }))}>
      {/* Top row: icon + optional tag */}
      <div className="flex items-start justify-between gap-2">
        <div className={cn(pillarIconVariants({ accent }))}>
          {icon ?? (
            <span className="text-xs font-semibold uppercase tracking-wider">
              ✦
            </span>
          )}
        </div>
        {tag && (
          <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium opacity-70">
            {tag}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="space-y-1.5">
        <h3 className="font-semibold leading-snug">{title}</h3>
        <p className="text-sm leading-relaxed opacity-75">{description}</p>
      </div>

      {/* Subtle bottom accent line */}
      <div
        className={cn(
          "absolute bottom-0 left-6 right-6 h-px rounded-full opacity-30",
          accent === "default" && "bg-foreground",
          accent === "blue" && "bg-blue-500",
          accent === "green" && "bg-green-500",
          accent === "amber" && "bg-amber-500",
          accent === "violet" && "bg-violet-500",
          accent === "rose" && "bg-rose-500",
        )}
      />
    </div>
  );
}
