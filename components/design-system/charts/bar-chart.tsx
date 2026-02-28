import { cn } from "@/lib/utils";

export function BarChartPreview(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 120"
      className={cn("h-28 w-full text-foreground", props.className)}
      role="img"
      aria-label="Bar chart preview"
    >
      <rect x="0" y="0" width="320" height="120" fill="none" />
      <line
        x1="28"
        y1="96"
        x2="304"
        y2="96"
        stroke="currentColor"
        strokeOpacity="0.25"
      />
      <line
        x1="28"
        y1="24"
        x2="28"
        y2="96"
        stroke="currentColor"
        strokeOpacity="0.25"
      />
      {[
        { x: 52, h: 40, cls: "hsl(var(--chart-3))" },
        { x: 92, h: 60, cls: "hsl(var(--chart-2))" },
        { x: 132, h: 30, cls: "hsl(var(--chart-3))" },
        { x: 172, h: 74, cls: "hsl(var(--chart-1))" },
        { x: 212, h: 46, cls: "hsl(var(--chart-3))" },
        { x: 252, h: 64, cls: "hsl(var(--chart-2))" },
      ].map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={96 - b.h}
          width="22"
          height={b.h}
          fill={b.cls}
          rx="4"
        />
      ))}
    </svg>
  );
}

