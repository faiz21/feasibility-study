import { cn } from "@/lib/utils";

export function PrioritizationQuadrantPreview(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={cn("h-28 w-full text-foreground", props.className)}
      role="img"
      aria-label="Prioritization quadrant preview"
    >
      <rect x="0" y="0" width="200" height="140" fill="none" />
      <rect
        x="28"
        y="20"
        width="144"
        height="100"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.22"
      />
      <line
        x1="100"
        y1="20"
        x2="100"
        y2="120"
        stroke="currentColor"
        strokeOpacity="0.18"
      />
      <line
        x1="28"
        y1="70"
        x2="172"
        y2="70"
        stroke="currentColor"
        strokeOpacity="0.18"
      />
      {/* points */}
      {[
        { cx: 132, cy: 46, fill: "hsl(var(--info))" },
        { cx: 150, cy: 88, fill: "hsl(var(--success))" },
        { cx: 72, cy: 52, fill: "hsl(var(--warning))" },
        { cx: 60, cy: 96, fill: "hsl(var(--neutral-500))" },
      ].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="5" fill={p.fill} />
      ))}
      <text
        x="100"
        y="134"
        textAnchor="middle"
        fontSize="10"
        fill="currentColor"
        opacity="0.6"
      >
        Effort →
      </text>
      <text
        x="12"
        y="70"
        textAnchor="middle"
        fontSize="10"
        fill="currentColor"
        opacity="0.6"
        transform="rotate(-90 12 70)"
      >
        Impact →
      </text>
    </svg>
  );
}

