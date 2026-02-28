import { cn } from "@/lib/utils";

export function TimelineRoadmapPreview(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 120"
      className={cn("h-28 w-full text-foreground", props.className)}
      role="img"
      aria-label="Timeline roadmap preview"
    >
      <rect x="0" y="0" width="320" height="120" fill="none" />
      <line
        x1="24"
        y1="60"
        x2="296"
        y2="60"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="2"
      />
      {[
        { x: 60, label: "Q1", color: "hsl(var(--neutral-500))" },
        { x: 130, label: "Q2", color: "hsl(var(--info))" },
        { x: 200, label: "Q3", color: "hsl(var(--neutral-500))" },
        { x: 270, label: "Q4", color: "hsl(var(--success))" },
      ].map((m) => (
        <g key={m.label}>
          <circle cx={m.x} cy="60" r="7" fill={m.color} />
          <text
            x={m.x}
            y="88"
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            opacity="0.7"
          >
            {m.label}
          </text>
        </g>
      ))}
      <rect
        x="112"
        y="34"
        width="96"
        height="18"
        rx="6"
        fill="hsl(var(--info))"
        fillOpacity="0.14"
        stroke="hsl(var(--info))"
        strokeOpacity="0.35"
      />
    </svg>
  );
}

