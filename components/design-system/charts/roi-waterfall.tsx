import { cn } from "@/lib/utils";

export function RoiWaterfallPreview(props: { className?: string }) {
  const steps = [
    { x: 40, y: 72, w: 34, h: 24, fill: "hsl(var(--neutral-500))" },
    { x: 92, y: 54, w: 34, h: 42, fill: "hsl(var(--success))" },
    { x: 144, y: 62, w: 34, h: 34, fill: "hsl(var(--warning))" },
    { x: 196, y: 46, w: 34, h: 50, fill: "hsl(var(--info))" },
    { x: 248, y: 40, w: 34, h: 56, fill: "hsl(var(--neutral-800))" },
  ];

  return (
    <svg
      viewBox="0 0 320 120"
      className={cn("h-28 w-full text-foreground", props.className)}
      role="img"
      aria-label="ROI waterfall chart preview"
    >
      <rect x="0" y="0" width="320" height="120" fill="none" />
      <line
        x1="24"
        y1="96"
        x2="296"
        y2="96"
        stroke="currentColor"
        strokeOpacity="0.22"
      />
      {steps.map((s, i) => (
        <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx="4" fill={s.fill} />
      ))}
      {steps.slice(0, -1).map((s, i) => (
        <line
          key={i}
          x1={s.x + s.w}
          y1={s.y}
          x2={steps[i + 1]!.x}
          y2={steps[i + 1]!.y}
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeDasharray="4 4"
        />
      ))}
    </svg>
  );
}

