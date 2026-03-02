import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type GridSpanConfig, spanClassName } from "../report-grid";
import { IconCard, type IconCardSize } from "./icon-card";
import { type ReportPalette } from "../report-theme";

export type BoxWithIconCardItem = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export type BoxWithIconCardProps = {
  title?: string;
  items: BoxWithIconCardItem[];
  size?: IconCardSize;
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function BoxWithIconCard({
  title = "Goals and Objectives",
  items,
  size = "md",
  palette,
  gridSpan = { base: 12, lg: 12 },
  className,
}: BoxWithIconCardProps) {
  if (items.length === 0) return null;

  return (
    <section className={cn(spanClassName(gridSpan), className)} aria-label={title}>
      <h3 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">{title}</h3>
      <div className="mt-4 grid grid-cols-12 gap-4 md:gap-5">
        {items.map((item, index) => (
          <IconCard
            key={`${item.title}-${index}`}
            title={item.title}
            description={item.description}
            icon={item.icon}
            size={size}
            palette={palette}
            gridSpan={{ base: 12, md: 6, lg: 4 }}
          />
        ))}
      </div>
    </section>
  );
}
