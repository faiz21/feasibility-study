import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const quoteBlockVariants = cva("relative w-full", {
  variants: {
    variant: {
      /**
       * Clean left-border with a faint background tint — great for inline
       * pull-quotes inside body copy.
       */
      bordered:
        "border-l-4 border-primary/60 bg-muted/50 px-6 py-5 rounded-r-xl",
      /**
       * Large decorative quotation marks with minimal surrounding chrome —
       * ideal for a standout hero-style quote.
       */
      prominent: "px-2 py-4",
      /**
       * Filled card with inverted colours — makes the quote pop in light
       * sections of a report.
       */
      filled:
        "rounded-xl bg-primary text-primary-foreground px-8 py-7 shadow-lg",
      /**
       * Subtle box with a dashed border — useful for "working notes" or
       * unverified placeholder quotes during editing.
       */
      draft:
        "rounded-xl border border-dashed border-border bg-background px-6 py-5",
    },
  },
  defaultVariants: { variant: "bordered" },
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface QuoteBlockProps
  extends React.BlockquoteHTMLAttributes<HTMLElement>,
    VariantProps<typeof quoteBlockVariants> {
  /** The quote text. Supports strings or any React node for rich content. */
  quote: React.ReactNode;
  /** Name of the person being quoted */
  author?: string;
  /** Job title, company, or contextual role */
  role?: string;
  /** Optional source / citation (book, report, interview date, etc.) */
  source?: string;
  /**
   * Whether to render large decorative quotation marks.
   * Defaults to `true` for `prominent`, `false` for others.
   */
  showDecorator?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function QuoteBlock({
  quote,
  author,
  role,
  source,
  variant = "bordered",
  showDecorator,
  className,
  ...props
}: QuoteBlockProps) {
  const decoratorDefault = variant === "prominent";
  const renderDecorator = showDecorator ?? decoratorDefault;

  const isFilled = variant === "filled";

  return (
    <blockquote
      className={cn(quoteBlockVariants({ variant }), className)}
      {...props}
    >
      {/* Decorative opening quote mark */}
      {renderDecorator && (
        <span
          aria-hidden
          className={cn(
            "absolute -top-4 left-0 select-none font-serif text-8xl leading-none",
            isFilled ? "text-primary-foreground/20" : "text-foreground/10",
          )}
        >
          &ldquo;
        </span>
      )}

      {/* Quote body */}
      <p
        className={cn(
          "relative leading-relaxed",
          variant === "prominent"
            ? "text-xl font-medium italic text-foreground md:text-2xl"
            : "text-base font-medium italic",
          isFilled && "text-primary-foreground",
        )}
      >
        {quote}
      </p>

      {/* Attribution */}
      {(author || source) && (
        <footer
          className={cn(
            "mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm",
            isFilled
              ? "text-primary-foreground/70"
              : "text-muted-foreground",
          )}
        >
          {/* Em-dash separator */}
          <span aria-hidden className="font-medium">
            —
          </span>

          <span className="flex flex-wrap items-baseline gap-x-1.5">
            {author && (
              <cite className="not-italic font-semibold text-inherit">
                {author}
              </cite>
            )}
            {role && (
              <span className="opacity-75 before:mr-1 before:content-[',']">
                {role}
              </span>
            )}
          </span>

          {source && (
            <>
              <span aria-hidden className="opacity-40">
                ·
              </span>
              <span className="italic opacity-60">{source}</span>
            </>
          )}
        </footer>
      )}
    </blockquote>
  );
}
